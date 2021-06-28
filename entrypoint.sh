#!/bin/bash
npm run --prefix frontend build
cd backend && poetry run python manage.py migrate
cd backend && poetry run python manage.py collectstatic --noinput
cp -R /app/backend/static/ /app/static/
cp -R /app/frontend/build/static /app/static/
cd /app/ && ln -s media /app/backend/media/
exec "$@"