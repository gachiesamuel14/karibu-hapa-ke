# Karibu Hapa

Location-based dating demo for Kenya. Match by county, distance, and vibe.

## Live

Deployed on Netlify from this GitHub repo.

## What’s in the demo

- Landing page
- Registration / login (device-local)
- Profile setup
- Discover / swipe with county + distance + mode filters
- Matches and chat (demo messages)
- Safety / report

## What a production version needs

- Real auth (e.g. Clerk, Supabase, Firebase)
- Postgres or Mongo for profiles, likes, reports
- GPS + Haversine nearby query
- Photo storage (S3 / Cloudinary)
- Realtime chat (Supabase Realtime, Firebase, or Socket.io)
- M-Pesa via Daraja for premium
- Moderation and age verification

This frontend is static so it deploys cleanly on Netlify.
