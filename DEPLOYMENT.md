# Deployment Guide

This document describes how to deploy **Magic Review** to free-tier platforms.

## Architecture

```
┌──────────────┐     ┌────────────────┐
│  Vercel      │     │  Render        │
│  (Frontend)  │────▶│  (Backend API) │
└──────────────┘     └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │  Supabase      │
                    │  PostgreSQL 16 │
                    └────────────────┘
```

---

## 1. Database — Supabase PostgreSQL

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Database → SQL Editor** and run the contents of `backend/src/main/resources/db/migration/V1__init_schema.sql`.
3. Copy the connection string from **Settings → Database → Connection string** (URI form).
4. Set these environment variables on the backend:

```
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=<your-db-password>
DB_SSL_MODE=require
```

> Supabase free tier includes 512 MB database, which is sufficient for MVP.

---

## 2. Backend — Render

1. Create a free **Web Service** on [render.com](https://render.com).
2. Connect the repository (or set **Build Command** and **Start Command** manually):

   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -jar backend/target/magic-review-0.1.0.jar`

3. Set the environment variables in the Render dashboard:

   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_HOST=db.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USERNAME=postgres
   DB_PASSWORD=<your-db-password>
   JWT_SECRET=<generate a 64-char random secret>
   JWT_ACCESS_EXPIRATION_MS=900000
   JWT_REFRESH_EXPIRATION_MS=604800000
   GEMINI_API_KEY=<optional>
   FRONTEND_BASE_URL=https://your-frontend.vercel.app
   ```

4. Ensure `application.yml` points `server.forward-headers-strategy=framework` so Render's load balancer works correctly.

> Render free tier includes a 750 MB memory limit and auto-deploys on git push.

---

## 3. Frontend — Vercel

1. Create a free project at [vercel.com](https://vercel.com).
2. Import the GitHub repository.
3. In **Settings → Environment Variables**, add:

   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_FRONTEND_BASE_URL=https://your-frontend.vercel.app
   ```

4. Deploy. Vercel builds and deploys the frontend in seconds on the free tier.

---

## 4. Local Development

```bash
# Start PostgreSQL + backend via Docker
docker compose up -d

# Backend
cd backend
cp src/main/resources/application.yml src/main/resources/application.yml.bak
mvn clean package -DskipTests
java -jar target/magic-review-0.1.0.jar

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## 5. Environment Variables Reference

| Variable | Required | Description |
| --- | --- | --- |
| `DB_HOST` | yes | PostgreSQL host |
| `DB_PORT` | yes | PostgreSQL port (5432) |
| `DB_NAME` | yes | Database name |
| `DB_USERNAME` | yes | DB user |
| `DB_PASSWORD` | yes | DB password |
| `JWT_SECRET` | yes | Secret key for JWT signing (≥ 32 chars) |
| `GEMINI_API_KEY` | no | Leave empty to enable Demo Mode |
| `FRONTEND_BASE_URL` | yes | Public frontend base URL (used in QR codes) |
| `BACKEND_BASE_URL` | yes | Backend base URL (used in QR codes) |