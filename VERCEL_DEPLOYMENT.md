# Vercel Deployment Guide (Full Stack)

Your project is now a **Full Stack Application** running on Vercel.
- **Frontend**: React (Vite)
- **Backend**: Node.js Express (Serverless Functions in `api/` folder)
- **Database**: MongoDB Atlas (Cloud)

---

## 1. Environment Variables (Required)
You **MUST** add these variables in your Vercel Project Settings for the backend to work.

1.  Go to your project in the **Vercel Dashboard**.
2.  Click **Settings** > **Environment Variables**.
3.  Add the following:

### A. Database Connection
*   **Key**: `MONGODB_URI`
*   **Value**: `mongodb+srv://<username>:<password>@cluster0.exmaple.mongodb.net/myportfolio?retryWrites=true&w=majority`
    *   *Note: You must get this connection string from your MongoDB Atlas account. Make sure to whitelist IP `0.0.0.0/0` in Atlas Network Access so Vercel can connect.*

### B. AI API Key
*   **Key**: `VITE_OPENROUTER_API_KEY`
*   **Value**: `sk-or-v1-......` (Your OpenRouter Key)

---

## 2. API Configuration (How it works)
*   **Local Development**: 
    *   Frontend runs on port `5173`.
    *   Backend runs on port `5000`.
    *   `vite.config.js` proxies `/api` calls to `localhost:5000`.
*   **Vercel Production**: 
    *   Vercel treats the `api/index.js` file as a Serverless Function.
    *   The `vercel.json` file automatically routes any request to `/api/*` to that function.
    *   **You do NOT need to deploy the backend separately.** Deploying the regular repo does both.

---

## 3. How to Deploy
1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Added backend and blog system"
    git push origin main
    ```
2.  **Vercel Auto-Deploy**:
    *   If you have linked your GitHub repo to Vercel, it will auto-deploy.
    *   **IMPORTANT**: If the build fails, check logs. Since we use `vite build`, it should be fine.

3.  **Manual Deploy (Command Line)**:
    If you have the Vercel CLI installed:
    ```bash
    vercel
    ```
    *   Follow the prompts. It will detect `vite` and `api/`.

## 4. Troubleshooting
*   **Blogs not loading?** Check the Network tab in Chrome DevTools. 
    *   If `/api/blogs` returns 500, check `MONGODB_URI` in Vercel.
    *   If it returns 404, check if `vercel.json` is in the root folders.
