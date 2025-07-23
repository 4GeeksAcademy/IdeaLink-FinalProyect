#!/usr/bin/env bash
# exit on error
set -o errexit

# Frontend
npm install
npm run build

# Backend
pipenv install

PYTHONPATH=$PYTHONPATH:$(pwd)/src pipenv run alembic -c migrations/alembic.ini stamp head

