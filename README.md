# Universal Deep Linking Solution

This server handles universal links, app links, and proper fallback behavior for both platforms.

## Features

- Universal Links support for iOS
- App Links support for Android
- Smart app banner for iOS
- Automatic app store redirection
- Fallback web experience
- QR code support for easy sharing
- Configurable for multiple environments

## Prerequisites

- Node.js (v14 or higher)
- SSL certificate (required for Universal Links)
- Apple Developer Account (for iOS Universal Links)
- Google Play Console Account (for Android App Links)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `IOS_APP_STORE_URL`: Your App Store URL
     - `ANDROID_PLAY_STORE_URL`: Your Play Store URL
     - `IOS_APP_SCHEME`: Your iOS app scheme
     - `ANDROID_APP_SCHEME`: Your Android app scheme
     - `IOS_BUNDLE_ID`: Your iOS bundle ID
     - `ANDROID_PACKAGE_NAME`: Your Android package name

3. Configure Universal Links:

   - Update the `apple-app-site-association` file with your Team ID and bundle ID
   - Host the file at `/.well-known/apple-app-site-association`
   - Ensure it's served with `Content-Type: application/json`

4. Configure Android App Links:
   - Generate Digital Asset Links file
   - Host at `/.well-known/assetlinks.json`

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Access your deep links:
   ```
   https://yourdomain.com/[path]?[parameters]
   ```

## Deep Link Structure

- Format: `yourdomain.com/[path]?[parameters]`
- Example: `yourdomain.com/profile/123?ref=share`

The server will:

1. Detect the user's device
2. Attempt to open the app if installed
3. Redirect to appropriate store if not installed
4. Show web fallback if on desktop

## iOS Setup

1. Enable Associated Domains in your app
2. Add capability in Xcode
3. Add domain to Associated Domains:
   ```
   applinks:yourdomain.com
   ```

## Android Setup

1. Add App Links verification in Android Manifest
2. Implement intent filters
3. Verify domain ownership in Play Console

## Security

- Always use HTTPS
- Validate deep link parameters
- Implement rate limiting
- Consider authentication for sensitive deep links

## Testing

Test your deep links using:

- iOS Universal Links Validator
- Android App Links Assistant
- Various devices and OS versions
- Different browsers and apps

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
