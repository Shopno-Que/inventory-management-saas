# Deploy Django to Render with Neon Postgres

This project is prepared to run as a Django web service on Render while using a Neon PostgreSQL database.

## What Is Already Prepared

- `render.yaml` defines the Render web service.
- `build.sh` installs dependencies, collects static files, runs migrations, and creates store permissions.
- `gunicorn` is used as the production WSGI server.
- `whitenoise` serves static files on Render.
- `dj-database-url` reads the Neon `DATABASE_URL`.
- Supabase storage has been removed from production settings.

## Required Environment Variables

Set these in Render under:

`Web Service > Environment`

```env
PRODUCTION=True
SECRET_KEY=<generate-a-long-random-django-secret-key>
DATABASE_URL=<your-neon-pooled-connection-string>
ALLOWED_HOSTS=<your-render-service>.onrender.com
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com
SECURE_HSTS_SECONDS=0
```

For the first deploy, keep `SECURE_HSTS_SECONDS=0`. After your final domain is working with HTTPS, you may set it to:

```env
SECURE_HSTS_SECONDS=31536000
```

Only do that after you are sure the site should always be HTTPS.

## Neon Database Setup

1. Go to Neon and create a new project.
2. Create or use the default database.
3. Open the Neon connection details.
4. Select the pooled connection string if Neon shows both pooled and direct options.
5. Copy the connection string.
6. Make sure the URL includes SSL:

```text
?sslmode=require
```

Example format:

```text
postgresql://user:password@ep-example-pooler.region.aws.neon.tech/dbname?sslmode=require
```

Use that full value as Render's `DATABASE_URL`.

## Render Deployment Steps

1. Push the project to GitHub.
2. Go to Render.
3. Click `New +`.
4. Choose `Blueprint`.
5. Connect the GitHub repository.
6. Render will read `render.yaml`.
7. Add the required environment variables, especially `DATABASE_URL`.
8. Deploy.

Render will run:

```bash
bash build.sh
```

The build script runs:

```bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py create_store_permissions
```

The app starts with:

```bash
gunicorn core.wsgi:application
```

## After First Deploy

After Render gives you a URL, update these env vars with the real hostname:

```env
ALLOWED_HOSTS=your-service-name.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-service-name.onrender.com
```

Then redeploy or restart the service.

## Custom Domain

If you add a custom domain, update the env vars:

```env
ALLOWED_HOSTS=your-service-name.onrender.com,yourdomain.com
CSRF_TRUSTED_ORIGINS=https://your-service-name.onrender.com,https://yourdomain.com
```

After the custom domain is stable on HTTPS, you can enable HSTS:

```env
SECURE_HSTS_SECONDS=31536000
```

## Important Media File Note

This project now uses Django's local file storage for uploaded files.

Static files are safe because Render rebuilds them with `collectstatic`, but user-uploaded media files are different. On Render's normal web service filesystem, uploaded files may be lost after deploys, restarts, or instance changes.

This matters because the app has:

```python
feedback.models.Feedback.image
```

If feedback image uploads are important in production, use one of these options:

- Add a persistent Render Disk and mount it to the app's `media` folder.
- Use another external file storage provider later.
- Remove or avoid production image uploads.

Since you said you are not using Supabase anymore, this project is currently prepared with local media storage only.

## Local Development

For local development, keep using SQLite by setting:

```env
PRODUCTION=False
```

Or omit `PRODUCTION` entirely.

Run locally:

```bash
python manage.py migrate
python manage.py runserver
```

## Useful Render Manual Commands

If you need to run commands in Render Shell:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py create_store_permissions
python manage.py collectstatic --no-input
```

## Quick Checklist

- GitHub repo is pushed.
- Neon database is created.
- Neon pooled `DATABASE_URL` is added to Render.
- `PRODUCTION=True` is set.
- `SECRET_KEY` is set.
- `ALLOWED_HOSTS` matches the Render hostname.
- `CSRF_TRUSTED_ORIGINS` includes the Render URL with `https://`.
- First deploy finishes migrations successfully.
- A superuser is created if admin access is needed.
