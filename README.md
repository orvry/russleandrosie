# R & R Wedding Journey — RSVP MVP

Next.js App Router + TypeScript + Tailwind CSS + Framer Motion + Supabase PostgreSQL. Designed for deployment to Azure App Service using the included Dockerfile.

## 1. Prerequisites

- Node.js 20+
- A Supabase project
- An Azure App Service plan that supports a custom Linux container
- Git and GitHub (recommended for source control)

## 2. Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Open **Project Settings → API**.
5. Copy the Project URL and `service_role` key. The service-role key is secret and must never be placed in client-side code.

## 3. Local setup

```bash
npm install
cp .env.example .env.local
```

Set values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
APP_ORIGIN=http://localhost:3000
```

Run:

```bash
npm run dev
```

Open http://localhost:3000.

## 4. Production build check

```bash
npm run build
npm run start
```

Test the complete RSVP flow on a phone-sized viewport and submit test accept/decline responses. Confirm records appear in Supabase Table Editor.

## 5. Deploy to Azure App Service (container)

1. Push this project to a private GitHub repository.
2. Build the Docker image from the included `Dockerfile`.
3. Push the image to Azure Container Registry (ACR).
4. Create an Azure Linux Web App for Containers and point it to the ACR image.
5. In **App Service → Configuration → Application settings**, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_ORIGIN` (your final HTTPS site URL)
   - `WEBSITES_PORT=8080`
6. Save settings and restart the App Service.
7. Enable HTTPS-only in App Service.
8. Test the deployed site and confirm a test RSVP is saved.

Example commands (replace placeholders):

```bash
az login
az group create --name rg-rr-wedding --location japaneast
az acr create --resource-group rg-rr-wedding --name YOUR_UNIQUE_ACR_NAME --sku Basic
az acr login --name YOUR_UNIQUE_ACR_NAME
docker build -t YOUR_UNIQUE_ACR_NAME.azurecr.io/rr-wedding-rsvp:1.0.0 .
docker push YOUR_UNIQUE_ACR_NAME.azurecr.io/rr-wedding-rsvp:1.0.0
```

Create the Web App in Azure Portal using the pushed image, or use Azure CLI after creating the App Service plan. Configure the Web App's managed identity / ACR pull permissions as appropriate.

## 6. RSVP data

Each submission creates one row in `public.rsvps`:

- `created_at`
- `guest_name`
- `email`
- `phone`
- `attendance`
- `message`
- `allergies`
- `dietary_requirements`

Submissions are append-only in this MVP. A guest submitting twice creates two records; review the latest response by email and timestamp.

## 7. Before sharing the invitation publicly

- Use a strong Supabase database password and keep all secrets out of Git.
- Verify the service-role key exists only in Azure server-side application settings.
- Test valid, invalid, accept, decline, allergy, and repeat submissions.
- Confirm the app works over HTTPS on iPhone and Android.
- Add a rate limiter / CAPTCHA before broad public exposure if the URL may be targeted by bots.
- Add a privacy notice explaining what guest information is collected and who can access it.
- Decide how long RSVP data will be retained and who is authorized to export it.

## Notes

- The garden chapter experience, guest photo uploads, invite codes, and admin dashboard are intentionally out of scope for this deadline.
- Decorative botanical marks are CSS placeholders. Replace them with the approved watercolor PNG/SVG assets when available.
- `APP_ORIGIN` is optional locally. In production, set it to the exact public HTTPS origin.
