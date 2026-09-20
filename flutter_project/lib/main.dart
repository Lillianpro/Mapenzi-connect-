// ============================================================================
// ZINNA TIPS - AI FOOTBALL & BASKETBALL PREDICTIONS
// Light, High-Accuracy Sports Predictions for Android (<20MB footprint)
// Technologies: Flutter, Firebase Auth, Cloud Firestore, Mobile Money Uganda
// ============================================================================

import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'screens/today_screen.dart';
import 'screens/vip_screen.dart';
import 'screens/live_scores_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/paywall_screen.dart';
import 'screens/auth_screen.dart';
import 'services/firebase_service.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase safely
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("Firebase init note (running with fallback storage): $e");
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FirebaseService()),
        ChangeNotifierProvider(create: (_) => ApiService()),
      ],
      child: const ZinnaTipsApp(),
    ),
  );
}

class ZinnaTipsApp extends StatelessWidget {
  const ZinnaTipsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zinna Tips',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system, // Supports dark and light modes
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF16A34A), // Zinna Green
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF16A34A),
          secondary: Color(0xFF22C55E),
          surface: Colors.white,
          onSurface: Color(0xFF0F172A),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0.5,
          centerTitle: false,
        ),
        cardTheme: CardTheme(
          color: Colors.white,
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Colors.white,
          selectedItemColor: Color(0xFF16A34A),
          unselectedItemColor: Color(0xFF94A3B8),
          elevation: 8,
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF22C55E),
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Dark stadium slate
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF22C55E),
          secondary: Color(0xFF16A34A),
          surface: Color(0xFF1E293B),
          onSurface: Color(0xFFF8FAFC),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E293B),
          foregroundColor: Colors.white,
          elevation: 0.5,
          centerTitle: false,
        ),
        cardTheme: CardTheme(
          color: Color(0xFF1E293B),
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Color(0xFF1E293B),
          selectedItemColor: Color(0xFF22C55E),
          unselectedItemColor: Color(0xFF64748B),
          elevation: 8,
        ),
      ),
      home: const RootGateScreen(),
    );
  }
}

/// Root gate that routes to:
/// 1. AuthScreen if not registered with phone number
/// 2. MainNavigationHub if registered and within 7-Day Trial or Subscribed
/// 3. PaywallScreen if Trial has ended and user has not subscribed (UGX 15,000 / month)
class RootGateScreen extends StatefulWidget {
  const RootGateScreen({super.key});

  @override
  State<RootGateScreen> createState() => _RootGateScreenState();
}

class _RootGateScreenState extends State<RootGateScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<FirebaseService>(context, listen: false).loadUserSession();
    });
  }

  @override
  Widget build(BuildContext context) {
    final fb = Provider.of<FirebaseService>(context);

    if (fb.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF16A34A)),
          ),
        ),
      );
    }

    // If user has not registered phone number, show Phone Auth Screen
    if (!fb.isRegistered) {
      return const AuthScreen();
    }

    // If 7-Day trial expired AND user is not subscribed, show the UGX 15,000 Paywall screen
    if (fb.isTrialExpired && !fb.isSubscribed) {
      return const PaywallScreen();
    }

    // Otherwise show the main 3-tab navigation
    return const MainNavigationHub();
  }
}

/// The 3 Main Bottom Tabs requested:
/// 1. Today (AI Predictions)
/// 2. Live Scores
/// 3. Profile / Subscription
class MainNavigationHub extends StatefulWidget {
  const MainNavigationHub({super.key});

  @override
  State<MainNavigationHub> createState() => _MainNavigationHubState();
}

class _MainNavigationHubState extends State<MainNavigationHub> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [
    TodayScreen(),
    VipScreen(),
    LiveScoresScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.tips_and_updates_outlined),
            activeIcon: Icon(Icons.tips_and_updates),
            label: 'Today',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.workspace_premium_outlined),
            activeIcon: Icon(Icons.workspace_premium),
            label: 'VIP Tips',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_soccer_outlined),
            activeIcon: Icon(Icons.sports_soccer),
            label: 'Live Scores',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle_outlined),
            activeIcon: Icon(Icons.account_circle),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
