require('dotenv').config();
const express = require('express');
const useragent = require('express-useragent');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

// Serve static files
app.use(express.static('public'));

// Helper functions
const isIOS = (ua) => ua.isiPhone || ua.isiPad || ua.isiPod;
const isAndroid = (ua) => ua.isAndroid;
const isMobile = (ua) => isIOS(ua) || isAndroid(ua);

// Deep linking route handler
app.get('/:path(*)', (req, res) => {
  const userAgent = req.useragent;
  const path = req.params.path || '';
  const queryParams = new URLSearchParams(req.query).toString();
  const deepLink = `${queryParams ? `${path}?${queryParams}` : path}`;

  // Detect if request is from a mobile device
  if (isMobile(userAgent)) {
    if (isIOS(userAgent)) {
      handleIOSRedirect(res, deepLink);
    } else if (isAndroid(userAgent)) {
      handleAndroidRedirect(res, deepLink);
    } else {
      // Fallback to web experience
      handleWebFallback(res);
    }
  } else {
    // Desktop experience
    handleWebFallback(res);
  }
});

// Platform-specific handlers
function handleIOSRedirect(res, deepLink) {
  const iosUniversalLink = `${process.env.IOS_APP_SCHEME}${deepLink}`;
  const appStoreURL = process.env.IOS_APP_STORE_URL;

  // Generate HTML for iOS smart banner and redirect
  const html = generateSmartBannerHTML({
    title: 'Open in App',
    appStoreURL,
    universalLink: iosUniversalLink,
    platform: 'ios',
  });

  res.send(html);
}

function handleAndroidRedirect(res, deepLink) {
  const androidIntent = `${process.env.ANDROID_APP_SCHEME}${deepLink}`;
  const playStoreURL = process.env.ANDROID_PLAY_STORE_URL;

  // Generate HTML for Android intent
  const html = generateSmartBannerHTML({
    title: 'Open in App',
    playStoreURL,
    intentURL: androidIntent,
    platform: 'android',
  });

  res.send(html);
}

function handleWebFallback(res) {
  // Redirect to web experience or show QR code
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

function generateSmartBannerHTML({
  title,
  appStoreURL,
  playStoreURL,
  universalLink,
  intentURL,
  platform,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        ${
          platform === 'ios'
            ? `<meta name="apple-itunes-app" content="app-id=${appStoreURL
                .split('/')
                .pop()}">`
            : ''
        }
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary-color: #00A2FF;
                --secondary-color: #393B3D;
                --accent-color: #F2F4F5;
                --success-color: #34C759;
                --text-color: #1B1B1B;
                --button-hover: #0089FF;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                background: linear-gradient(135deg, #F2F4F5 0%, #FFFFFF 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-color);
                line-height: 1.6;
            }
            
            .container {
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(25, 25, 25, 0.1);
                width: 100%;
                max-width: 400px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--primary-color);
            }
            
            .app-icon {
                width: 80px;
                height: 80px;
                border-radius: 20px;
                margin: 0 auto 20px;
                background: var(--accent-color);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: var(--primary-color);
            }
            
            h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: var(--secondary-color);
            }
            
            p {
                color: #666;
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }
            
            .button {
                display: block;
                width: 100%;
                padding: 16px 24px;
                background: var(--primary-color);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1.1rem;
                margin: 12px 0;
                transition: all 0.2s ease;
            }
            
            .button:hover {
                background: var(--button-hover);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 162, 255, 0.2);
            }
            
            .store-button {
                background: var(--secondary-color);
            }
            
            .store-button:hover {
                background: #2d2f31;
                box-shadow: 0 4px 12px rgba(57, 59, 61, 0.2);
            }
            
            .progress {
                margin-top: 2rem;
                text-align: center;
                color: #666;
                font-size: 0.9rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: var(--accent-color);
                border-radius: 2px;
                margin-top: 8px;
                overflow: hidden;
            }
            
            .progress-bar::after {
                content: '';
                display: block;
                width: 30%;
                height: 100%;
                background: var(--primary-color);
                animation: progress 2s ease-in-out infinite;
            }
            
            @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
            }
            
            @media (max-width: 480px) {
                .container {
                    padding: 30px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="app-icon">📱</div>
            <h1>Opening App</h1>
            <p>Redirecting you to the app...</p>
            
            ${
              platform === 'ios'
                ? `
                <a href="${universalLink}" class="button">Open in App</a>
                <a href="${appStoreURL}" class="button store-button">Get on App Store</a>
            `
                : `
                <a href="${intentURL}" class="button">Open in App</a>
                <a href="${playStoreURL}" class="button store-button">Get on Play Store</a>
            `
            }
            
            <div class="progress">
                <span>Connecting...</span>
                <div class="progress-bar"></div>
            </div>
        </div>
        
        <script>
            // Attempt to open app
            ${
              platform === 'ios'
                ? `
                setTimeout(function() {
                    window.location.href = '${universalLink}';
                    setTimeout(function() {
                        window.location.href = '${appStoreURL}';
                    }, 2500);
                }, 100);
            `
                : `
                setTimeout(function() {
                    window.location.href = '${intentURL}';
                    setTimeout(function() {
                        window.location.href = '${playStoreURL}';
                    }, 2500);
                }, 100);
            `
            }
        </script>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`Deep linking server running on port ${PORT}`);
});
