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

### Health Checks

- Liveness probe: `GET /health/live`
- Readiness probe: `GET /health/ready`

### API Endpoints

#### Deep Linking

- `GET /:path(*)`
  - Handles deep linking requests
  - Supports referral parameters
  - Performs device detection
  - Returns appropriate redirect

#### Referral API

- `POST /api/verify-referral`

  ```json
  {
    "clickId": "uuid-of-click"
  }
  ```

- `GET /api/referral-stats`
  - Returns referral performance metrics

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
