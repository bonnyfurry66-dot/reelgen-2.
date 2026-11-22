# ReelGen 2.0

A mobile-first AI video studio starter for Vercel. It includes a clean browser UI and two serverless API routes that submit and poll text-to-video jobs through fal.ai.

## Included now

- Responsive ReelGen 2.0 dashboard
- Text-to-video prompt form
- Aspect ratio, duration and resolution controls
- Secure server-side fal.ai API calls
- Queue status polling and video preview/download
- Input validation and basic error handling

## Not included yet

This is the first working foundation, not the entire roadmap. Supabase authentication, database-backed video history, permanent cloud storage, image-to-video, AI script writing, voice generation, subtitles, credits, payments, rate limiting and admin tools still need to be implemented before a public commercial launch.

## Deploy on Vercel

1. Upload the contents of this folder to a GitHub repository. Keep the `api` folder at the project root.
2. Import that repository into Vercel and deploy.
3. In Vercel, open Project Settings → Environment Variables.
4. Add `FAL_KEY` with your fal.ai API key. Do not put the key in `index.html`, GitHub, or any `NEXT_PUBLIC_` variable.
5. Redeploy after adding the environment variable.
6. Open the deployed website and test with a short prompt. Generation uses your fal.ai account and may incur charges.

## Local development

Install the Vercel CLI, add `FAL_KEY` to a local `.env.local` file, then run `npm run dev`.

## Model configuration

The initial integration uses `minimax/h3-max/text-to-video` through fal's queue API. The model, accepted duration values, aspect ratios and resolution options can change; check the current model schema and pricing before enabling generation for customers.

## Before accepting public users

- Add Supabase Auth and require a valid session for generation.
- Add server-side per-user quotas, rate limits and abuse prevention.
- Persist jobs and results in Supabase; store video files in durable storage if you need them retained.
- Add explicit cost estimates and consent before submitting paid generation jobs.
- Add provider webhook verification or robust polling/reconciliation for production reliability.
- Add terms, privacy policy, content moderation and support contact details.
