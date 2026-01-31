# Google Analytics Integration Plan

## Step 1: Create a Google Analytics Property

1. Go to [analytics.google.com](https://analytics.google.com/).
2. Click **Start measuring** (or **Admin** > **Create Account** if you already have one).
3. Follow the setup steps:
   - **Account Name**: Enter your project name (e.g., "My Portfolio").
   - **Property Name**: Enter your website name.
   - **Platform**: Choose **Web**.
   - **Website URL**: Enter your deployed URL (e.g., `your-site.vercel.app`) or just `example.com` if you don't have one yet.
4. Once created, you will see a **Web Stream details** screen.
5. Copy the **Measurement ID**. It looks like `G-XXXXXXXXXX`.

## Step 2: Install Dependency

open your terminal in the project folder and run:

```bash
npm install react-ga4
```

## Step 3: Integrate with React Code

We need to initialize Google Analytics and track page views as the user navigates.

### In `src/App.jsx`

We will modify `App.jsx` to:
1. Initialize GA with your Measurement ID.
2. Listen for route changes and send page views.

```jsx
import ReactGA from "react-ga4"; // Import the library
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Initialize GA once (replace G-XXXXXXXXXX with your actual ID)
ReactGA.initialize("G-XXXXXXXXXX");

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // ... rest of your component
```

## Step 4: Verify Installation

1. Run your app locally: `npm run dev`
2. Go to your Google Analytics Dashboard.
3. Click "Reports" > "Realtime".
4. Navigate around your local website.
5. You should see "Users in last 30 minutes" count go up (it might say "1").

**Note**: Ad blockers (like uBlock Origin) often block Google Analytics. Turn them off for your localhost during testing.
