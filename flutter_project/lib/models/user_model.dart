// User Subscription and 7-Day Trial Model stored in Firebase Firestore

class UserModel {
  final String phone;
  final DateTime trialStartDate;
  final bool isSubscribed;
  final DateTime? subscriptionExpiry;
  final String plan; // e.g. "UGX 15,000 / Month"
  final String paymentMethod; // "MTN Mobile Money", "Airtel Money", "None"
  final DateTime? lastActiveAt;

  UserModel({
    required this.phone,
    required this.trialStartDate,
    required this.isSubscribed,
    this.subscriptionExpiry,
    this.plan = 'UGX 15,000 / Month',
    this.paymentMethod = 'None',
    this.lastActiveAt,
  });

  /// Check if 7 days free trial has elapsed
  bool get isTrialExpired {
    final now = DateTime.now();
    final trialEnd = trialStartDate.add(const Duration(days: 7));
    return now.isAfter(trialEnd);
  }

  /// Days left in trial
  int get trialDaysRemaining {
    final now = DateTime.now();
    final trialEnd = trialStartDate.add(const Duration(days: 7));
    if (now.isAfter(trialEnd)) return 0;
    return trialEnd.difference(now).inDays + 1;
  }

  /// Check if user has active access (either within 7 days trial OR subscribed)
  bool get hasAccess {
    if (isSubscribed) {
      if (subscriptionExpiry == null) return true;
      return DateTime.now().isBefore(subscriptionExpiry!);
    }
    return !isTrialExpired;
  }

  factory UserModel.fromMap(Map<String, dynamic> data, String phone) {
    DateTime trialDate = DateTime.now();
    if (data['trial_start_date'] != null) {
      trialDate = DateTime.tryParse(data['trial_start_date']) ?? DateTime.now();
    }

    DateTime? subExpiry;
    if (data['subscription_expiry'] != null) {
      subExpiry = DateTime.tryParse(data['subscription_expiry']);
    }

    return UserModel(
      phone: phone,
      trialStartDate: trialDate,
      isSubscribed: data['is_subscribed'] == true,
      subscriptionExpiry: subExpiry,
      plan: data['plan'] ?? 'UGX 15,000 / Month',
      paymentMethod: data['payment_method'] ?? 'None',
      lastActiveAt: data['last_active_at'] != null 
          ? DateTime.tryParse(data['last_active_at']) 
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'phone': phone,
      'trial_start_date': trialStartDate.toIso8601String(),
      'is_subscribed': isSubscribed,
      'subscription_expiry': subscriptionExpiry?.toIso8601String(),
      'plan': plan,
      'payment_method': paymentMethod,
      'last_active_at': DateTime.now().toIso8601String(),
      'app_version': '1.0.0 (Light <20MB)',
    };
  }
}
