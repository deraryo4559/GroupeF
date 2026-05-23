#!/usr/bin/env bash
set -euo pipefail

python init_db.py
exec gunicorn "app:create_app()" --bind "0.0.0.0:${PORT:-5000}"
