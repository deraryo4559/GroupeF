import os
from functools import wraps

from flask import current_app, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

TOKEN_MAX_AGE_SECONDS = int(os.environ.get("AUTH_TOKEN_MAX_AGE_SECONDS", "86400"))


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="auth-token")


def create_access_token(user):
    return _serializer().dumps({
        "user_id": user["user_id"],
        "email": user["email"],
    })


def verify_access_token(token):
    return _serializer().loads(token, max_age=TOKEN_MAX_AGE_SECONDS)


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if request.method == "OPTIONS":
            return "", 204

        auth_header = request.headers.get("Authorization", "")
        scheme, _, token = auth_header.partition(" ")
        if scheme.lower() != "bearer" or not token:
            return jsonify({"ok": False, "message": "authentication required"}), 401

        try:
            g.current_user = verify_access_token(token)
        except SignatureExpired:
            return jsonify({"ok": False, "message": "token expired"}), 401
        except BadSignature:
            return jsonify({"ok": False, "message": "invalid token"}), 401

        return view(*args, **kwargs)

    return wrapped


def current_user_id():
    user = getattr(g, "current_user", None) or {}
    return int(user.get("user_id") or 0)
