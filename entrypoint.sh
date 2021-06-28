#!/bin/bash
npm run --prefix frontend build
cd /app/backend && poetry run python manage.py migrate
cd /app/backend && poetry run python manage.py collectstatic --noinput
cp -R /app/backend/static/* /app/static/
cp -R /app/frontend/build/static/* /app/static/
cd /app/ && ln -sfn /app/backend/media/ media
cd /app/backend/main/templates/ && ln -sfn /app/frontend/build/index.html index.html
exec "$@"