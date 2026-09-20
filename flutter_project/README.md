# Zinna Tips - Flutter + Firebase Mobile App

Light (<20MB), high-accuracy AI football and basketball predictions mobile application with 7-day free trial, Uganda Mobile Money (MTN & Airtel) subscription integration, live scores, and clean green/white UI.

## Features
- **Daily Fixtures & AI Predictions**: Automatically analyzes last 5 games form, head-to-head records, home/away advantage, injuries/suspensions, and table standing.
- **Predictive Markets**:
  - Football: 1X2, Double Chance (1X, X2, 12), Over/Under 2.5 goals, BTTS (Both Teams To Score).
  - Basketball: Winner (Moneyline) and Over/Under points.
  - Accuracy %: Displayed on each card (e.g. `AI Confidence: 84%`).
  - "Why this prediction?": Clear, transparent AI reasoning text for every match.
- **User & Payment Flow**:
  - Register with phone number (e.g. +256...).
  - Automatic **7-DAY FREE TRIAL** with 100% full access.
  - After 7 days, the app locks and presents the paywall: *"Trial Ended. Subscribe for UGX 15,000 / Month to continue"*.
  - Payment options: **MTN Mobile Money Uganda** (*165#) and **Airtel Money Uganda** (*185#).
  - Status stored in **Firebase Cloud Firestore**: `trial_start_date`, `is_subscribed`, `subscription_expiry`.
- **Lightweight & Fast**:
  - <20MB APK footprint, optimized for low-end Android phones.
  - 3 clean bottom tabs: 1. Today (predictions), 2. Live Scores, 3. Profile/Subscription.
  - Dark mode support with stadium green (#16A34A) and crisp white accents.

## How to Run in Android Studio
1. Clone or open the `/flutter_project` folder in Android Studio.
2. Ensure Flutter SDK (>= 3.0.0) is installed and configured.
3. Fetch dependencies:
   ```bash
   flutter pub get
   ```
4. Connect an Android device or start an Android Emulator.
5. Run the app:
   ```bash
   flutter run
   ```

## How to Build the Lightweight APK (<20MB)
To generate the optimized release APK:
```bash
flutter build apk --release --split-per-abi
```
The resulting APK will be under 18MB, located at:
`build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk`
