# Abdullah Asger Ali — Portfolio

Standalone Next.js portfolio with a scroll-led Three.js phone scene.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact email

The contact form posts to a server-side Next.js route. It sends mail through Resend; the API key is never exposed in the browser.

1. Create a Resend API key and configure a sender address accepted by your Resend account. The Resend test sender is limited to the account owner's verified address; a custom sender requires a verified sending domain.
2. Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO`, and (if using a verified domain) `CONTACT_FROM`.
3. Add the same variables in the Vercel project's Environment Variables before deploying.

The form uses the provider's free tier for low-volume personal use. Free-tier limits and terms can change; submissions will fail visibly rather than claim success if email is not configured or delivery fails. The form does not store a separate database copy.

## Deploy

Deploy this folder as a Next.js project with Vercel. Vercel project addresses use the `vercel.app` domain (for example, `abdullahasgerali.vercel.app`); `vercel.com` is not a project deployment domain.
