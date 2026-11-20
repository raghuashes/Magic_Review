# Magic Review — AI Review Generation Multi-Tenant SaaS

India-first local business review growth platform (jewellers, restaurants, salons, clinics, shops) featuring QR code generation, category/attribute selection, AI-generated review drafts via Google Gemini, manual copy-and-paste to Google Reviews, zero fake reviews, no auto-posting, no review gating, and multi-tenant row-level isolation.

## Architecture

- **Backend**: Spring Boot 3.3.4, Java 21, Spring Data JPA, Spring Security (JWT), PostgreSQL 16, Flyway Migrations, Google Gemini 1.5 Flash API, ZXing QR Code generator.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui inspired components, Axios.
- **Database**: PostgreSQL 16 with tenant isolation via `owner_id` and `store_id`.

## Deployment Guide

### 1. Database (Supabase / Render PostgreSQL)
1. Create a new PostgreSQL database on Supabase or Render.
2. Run Flyway migrations (`backend/src/main/resources/db/migration/V1__init_schema.sql`).

### 2. Backend (Render / Railway)
1. Connect repository to Render as a Web Service.
2. Build Command: `mvn clean package -DskipTests`
3. Start Command: `java -jar backend/target/magic-review-0.1.0.jar`
4. Environment Variables:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<db>`
   - `SPRING_DATASOURCE_USERNAME=<user>`
   - `SPRING_DATASOURCE_PASSWORD=<password>`
   - `APP_JWT_SECRET=<base64-secret>`
   - `GEMINI_API_KEY=<your-gemini-key>`

### 3. Frontend (Vercel)
1. Import `frontend` directory into Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_BASE_URL=https://<your-backend-render-url>/api`

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
