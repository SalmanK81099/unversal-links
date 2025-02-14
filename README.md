# Dynamic Deep Linking Service

A robust and secure deep linking service that handles universal links (iOS), app links (Android), and provides a seamless web fallback experience.

## Features

### Core Functionality

- ✨ Universal Links support for iOS
- 🤖 App Links support for Android
- 🌐 Smart web fallback experience
- 📱 Intelligent device detection
- 🔄 Automatic app store redirection
- 🔗 Custom URL scheme support

### Security & Performance

- 🛡️ Rate limiting protection
- 🍪 Secure cookie handling
- 🔒 Input validation and sanitization
- 📊 MongoDB indexing for performance
- 🧹 Automated cleanup of old records

### Analytics & Tracking

- 📈 Referral tracking system
- 📊 Conversion analytics
- 📱 Device and platform analytics
- 🔍 Campaign tracking
- 📉 Performance monitoring

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- SSL certificate (required for Universal Links)
- Apple Developer Account (for iOS Universal Links)
- Google Play Console Account (for Android App Links)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dynamic-linking
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:

   ```env
   # App Configuration
   PORT=3000

   # Database
   MONGODB_URI=mongodb://your-mongodb-uri

   # App Links
   IOS_APP_STORE_URL=https://apps.apple.com/YOUR_APP_ID
   ANDROID_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE
   IOS_APP_SCHEME=yourapp://
   ANDROID_APP_SCHEME=yourapp://

   # App Bundle IDs
   IOS_BUNDLE_ID=com.yourapp.ios
   ANDROID_PACKAGE_NAME=com.yourapp.android

   # Minimum App Versions
   IOS_MIN_VERSION=1.0.0
   ANDROID_MIN_VERSION=1.0.0
   ```

## Usage

### Starting the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### API Documentation

#### 1. Deep Linking

- **Base URL**: `https://your-domain.com`

##### Create Deep Link

```
GET /:path
```

Query Parameters:

- `ref` or `referral`: Referral code
- `source`: Traffic source
- `utm_campaign`: Campaign name

Example:

```
https://your-domain.com/product/123?ref=USER123&source=email&utm_campaign=summer_sale
```

#### 2. Referral API

##### Verify Referral

```http
POST /api/verify-referral
Content-Type: application/json

{
    "clickId": "uuid-of-click"
}
```

Response:

```json
{
  "success": true,
  "referralCode": "USER123",
  "source": "email",
  "campaign": "summer_sale"
}
```

##### Get Referral Statistics

```http
GET /api/referral-stats
```

Response:

```json
[
  {
    "referralCode": "USER123",
    "totalClicks": 150,
    "conversions": 45,
    "conversionRate": 30,
    "sources": ["email", "social"],
    "campaigns": ["summer_sale"]
  }
]
```

#### 3. Health Checks

##### Liveness Probe

```http
GET /health/live
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-03-21T12:00:00.000Z",
  "service": "deep-linking"
}
```

##### Readiness Probe

```http
GET /health/ready
```

Response:

```json
{
  "status": "ready",
  "timestamp": "2024-03-21T12:00:00.000Z",
  "checks": {
    "database": "connected"
  }
}
```

### React Native Integration

#### 1. Installation

```bash
npx create-expo-app your-app
cd your-app
npx expo install expo-linking expo-application @react-native-async-storage/async-storage
```

#### 2. App Configuration (app.json)

```json
{
  "expo": {
    "name": "Your App",
    "scheme": "yourapp",
    "ios": {
      "bundleIdentifier": "com.yourapp.ios",
      "associatedDomains": ["applinks:your-domain.com"]
    },
    "android": {
      "package": "com.yourapp.android",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "your-domain.com",
              "pathPrefix": "/"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

#### 3. Deep Link Handler Implementation

```javascript
// App.js
import { useEffect } from 'react';
import { Linking } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    // Handle deep links when app is not running
    const subscription = ExpoLinking.addEventListener('url', handleDeepLink);

    // Check for initial URL
    checkInitialURL();

    // Check if first launch
    checkFirstLaunch();

    return () => subscription.remove();
  }, []);

  const checkInitialURL = async () => {
    const initialUrl = await ExpoLinking.getInitialURL();
    if (initialUrl) {
      handleDeepLink({ url: initialUrl });
    }
  };

  const handleDeepLink = ({ url }) => {
    if (!url) return;

    const { path, queryParams } = ExpoLinking.parse(url);

    // Handle the deep link
    console.log('Path:', path);
    console.log('Query params:', queryParams);

    // Example: Verify referral
    if (queryParams.ref) {
      verifyReferral(queryParams.ref);
    }
  };

  const verifyReferral = async (clickId) => {
    try {
      const response = await fetch('https://your-domain.com/api/verify-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clickId }),
      });

      const data = await response.json();
      if (data.success) {
        // Handle successful referral
        console.log('Referral verified:', data);
      }
    } catch (error) {
      console.error('Error verifying referral:', error);
    }
  };

  return (
    // Your app components
  );
}
```

#### 4. Testing Deep Links

iOS Simulator:

```bash
xcrun simctl openurl booted "yourapp://path?ref=REFERRAL_CODE"
# or
xcrun simctl openurl booted "https://your-domain.com/path?ref=REFERRAL_CODE"
```

Android Emulator:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "yourapp://path?ref=REFERRAL_CODE" com.yourapp.android
# or
adb shell am start -W -a android.intent.action.VIEW -d "https://your-domain.com/path?ref=REFERRAL_CODE" com.yourapp.android
```

### Configuration Files

1. iOS Universal Links (`/.well-known/apple-app-site-association`):

   ```json
   {
     "applinks": {
       "apps": [],
       "details": [
         {
           "appID": "TEAM_ID.com.yourapp.ios",
           "paths": ["*"]
         }
       ]
     }
   }
   ```

2. Android App Links (`/.well-known/assetlinks.json`):
   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.yourapp.android",
         "sha256_cert_fingerprints": ["YOUR_APP_FINGERPRINT"]
       }
     }
   ]
   ```

## Security Considerations

1. Rate Limiting

   - 100 requests per 15 minutes per IP
   - Configurable in `config/environment.js`

2. Data Protection

   - Secure cookie settings
   - HTTPS required for production
   - Input validation on all endpoints

3. Database Security
   - Automatic cleanup of old records
   - Indexed collections for performance
   - Connection pooling and retry logic

## Monitoring

The service includes:

- Health check endpoints
- MongoDB connection monitoring
- Error tracking and logging
- Performance metrics
- Referral analytics

## Development

### Project Structure

```
project/
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # Route handlers
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.js         # Express app setup
├── public/            # Static files
└── server.js         # Entry point
```

### Adding New Features

1. Create new routes in `src/routes/`
2. Add business logic in `src/services/`
3. Create models in `src/models/`
4. Update configuration in `src/config/`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
