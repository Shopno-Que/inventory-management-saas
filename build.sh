#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input --ignore tailwind/input.css
python manage.py migrate
python manage.py create_store_permissions
