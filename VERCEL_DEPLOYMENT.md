# Vercel Deployment Guide

## 1. Security Warning ⚠️
Since this is a **frontend-only** application, your OpenRouter API Key will be visible to tech-savvy users who inspect the network traffic.

**To protect yourself:**
1.  **Set Usage Limits**: Go to [OpenRouter Settings](https://openrouter.ai/settings) and set a strict credit limit (e.g., $1-5/month).
2.  **Domain Restriction**: If OpenRouter supports it, restrict your API key to only work from `your-domain.vercel.app`.

## 2. Environment Variables on Vercel
Your `.env` file is ignored by Git (for security), so Vercel won't see it automatically. You must add the key manually.

1.  Go to your project in the **Vercel Dashboard**.
2.  Click **Settings** > **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `VITE_OPENROUTER_API_KEY`
    *   **Value**: `your_actual_key_starting_with_sk-or-whatever`
4.  **Save** and **Redeploy** (if you already deployed).

## 3. Resume File
Your resume is located at `src/assets/resume/my_resume-zain.pdf`. Vercel will bundle this correctly.
