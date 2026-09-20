// ============================================================================
// FIREBASE SERVICE FOR ZINNA TIPS
// Handles: Phone Registration, 7-Day Free Trial Tracking, Firestore Persistence,
// and Subscription Activation via MTN / Airtel Mobile Money
// ============================================================================

import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class FirebaseService extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  UserModel? _currentUser;
  bool _isLoading = true;
  bool _isSimulatedExpired = false; // Toggle for testing paywall flow

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isRegistered => _currentUser != null && _currentUser!.phone.isNotEmpty;
  
  bool get isSubscribed => _currentUser?.isSubscribed ?? false;
  
  bool get isTrialExpired {
    if (_isSimulatedExpired) return true;
    return _currentUser?.isTrialExpired ?? false;
  }
  
  int get trialDaysRemaining {
    if (_isSimulatedExpired) return 0;
    return _currentUser?.trialDaysRemaining ?? 0;
  }

  bool get hasAccess {
    if (_currentUser == null) return false;
    if (_currentUser!.isSubscribed) return true;
    return !isTrialExpired;
  }

  /// Initialize and restore user session from local cache & Firestore
  Future<void> loadUserSession() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final savedPhone = prefs.getString('zinna_user_phone');

      if (savedPhone != null && savedPhone.isNotEmpty) {
        await _fetchOrInitUserInFirestore(savedPhone);
      }
    } catch (e) {
      debugPrint("Error loading user session: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Register user with phone number and automatically start 7-Day Free Trial
  Future<bool> registerWithPhone(String rawPhone) async {
    _isLoading = true;
    notifyListeners();

    try {
      String cleanPhone = rawPhone.trim();
      if (!cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.startsWith('0') 
            ? '+256${cleanPhone.substring(1)}' 
            : '+256$cleanPhone';
      }

      await _fetchOrInitUserInFirestore(cleanPhone);

      // Save phone to shared preferences for instant offline launch
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('zinna_user_phone', cleanPhone);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("Registration error: $e");
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Fetch user document from Firestore or create new record with 7-Day trial
  Future<void> _fetchOrInitUserInFirestore(String phone) async {
    try {
      final docRef = _firestore.collection('users').doc(phone);
      final snapshot = await docRef.get();

      if (snapshot.exists && snapshot.data() != null) {
        // Existing user: load current trial start date and subscription
        _currentUser = UserModel.fromMap(snapshot.data()!, phone);
      } else {
        // First registration: Start 7-DAY FREE TRIAL immediately
        final now = DateTime.now();
        final newUser = UserModel(
          phone: phone,
          trialStartDate: now,
          isSubscribed: false,
          subscriptionExpiry: null,
          plan: '7-Day Free Trial (Active)',
          paymentMethod: 'None',
        );

        // Save to Firestore
        await docRef.set(newUser.toMap(), SetOptions(merge: true));
        _currentUser = newUser;
      }
    } catch (e) {
      debugPrint("Firestore access fallback: $e");
      // Fallback in-memory / local storage user if offline
      _currentUser ??= UserModel(
        phone: phone,
        trialStartDate: DateTime.now(),
        isSubscribed: false,
      );
    }
  }

  /// Activate UGX 15,000 / Month subscription after MTN / Airtel MoMo payment
  Future<bool> activateSubscription({
    required String provider, // "MTN Mobile Money" or "Airtel Money"
    required String transactionRef,
  }) async {
    if (_currentUser == null) return false;

    try {
      final expiryDate = DateTime.now().add(const Duration(days: 30)); // 1 Month
      final updatedUser = UserModel(
        phone: _currentUser!.phone,
        trialStartDate: _currentUser!.trialStartDate,
        isSubscribed: true,
        subscriptionExpiry: expiryDate,
        plan: 'UGX 15,000 / Month (VIP AI Access)',
        paymentMethod: provider,
      );

      // Update Firestore
      final docRef = _firestore.collection('users').doc(_currentUser!.phone);
      await docRef.set(updatedUser.toMap(), SetOptions(merge: true));

      // Log payment record in Firestore
      await _firestore.collection('payments').add({
        'phone': _currentUser!.phone,
        'amount': 15000,
        'currency': 'UGX',
        'provider': provider,
        'reference': transactionRef,
        'status': 'completed',
        'timestamp': DateTime.now().toIso8601String(),
      });

      _currentUser = updatedUser;
      _isSimulatedExpired = false;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("Error activating subscription in Firestore: $e");
      return false;
    }
  }

  /// Developer/Tester toggle: simulate trial expired to verify paywall screen
  void toggleSimulateExpired() {
    _isSimulatedExpired = !_isSimulatedExpired;
    notifyListeners();
  }

  /// Logout / reset session
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('zinna_user_phone');
    _currentUser = null;
    _isSimulatedExpired = false;
    notifyListeners();
  }
}
