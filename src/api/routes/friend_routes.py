from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from api.models import db, User, FriendRequest
from stream_chat import StreamChat
import os, logging

friend_bp = Blueprint("friend_bp", __name__, url_prefix="/api")

# ──────────────── Config Stream ────────────────
STREAM_API_KEY    = os.getenv("STREAM_API_KEY", "2pks7t76xeqd")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")            # export STREAM_API_SECRET=...
if not STREAM_API_SECRET:
    logging.warning("STREAM_API_SECRET no definido; las rutas de Stream pueden fallar")

stream_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# ───────────────────── 1. Enviar solicitud ─────────────────────
@friend_bp.route("/friend-request", methods=["POST"])
@jwt_required()
def send_request():
    me = get_jwt_identity()
    data = request.get_json() or {}
    receiver_id = data.get("receiver_id")

    if not receiver_id:
        return jsonify({"error": "receiver_id requerido"}), 400
    if receiver_id == me:
        return jsonify({"error": "No puedes enviarte solicitud"}), 400

    exists = FriendRequest.query.filter(
        or_(
            (FriendRequest.sender_id == me) & (FriendRequest.receiver_id == receiver_id),
            (FriendRequest.sender_id == receiver_id) & (FriendRequest.receiver_id == me),
        )
    ).first()
    if exists:
        return jsonify({"error": "Ya existe solicitud o amistad"}), 400

    fr = FriendRequest(sender_id=me, receiver_id=receiver_id)
    db.session.add(fr)
    db.session.commit()
    return jsonify({"message": "Solicitud enviada", "request_id": fr.id}), 201

# ───────────────────── 2. Aceptar / rechazar ─────────────────────
@friend_bp.route("/friend-request/<int:req_id>", methods=["POST"])
@jwt_required()
def respond_request(req_id):
    me = get_jwt_identity()
    data = request.get_json() or {}
    action = data.get("action")

    fr = FriendRequest.query.filter_by(id=req_id, receiver_id=me).first()
    if not fr or fr.status != "pending":
        return jsonify({"error": "Solicitud no válida"}), 404

    if action == "accept":
        fr.status = "accepted"
    elif action == "reject":
        fr.status = "rejected"
    else:
        return jsonify({"error": "Acción inválida"}), 400

    db.session.commit()
    return jsonify({"message": f"Solicitud {action}ed"}), 200

# ───────────────────── 3. Solicitudes pendientes ─────────────────────
@friend_bp.route("/friend-requests", methods=["GET"])
@jwt_required()
def pending_requests():
    me = get_jwt_identity()
    pendings = FriendRequest.query.filter_by(receiver_id=me, status="pending").all()
    return jsonify([
        {
            "id": fr.id,
            "sender": fr.sender.serialize(),
            "created_at": fr.created_at.isoformat(),
        } for fr in pendings
    ]), 200

# ───────────────────── 4. Lista de amigos ─────────────────────
@friend_bp.route("/friends", methods=["GET"])
@jwt_required()
def list_friends():
    me = get_jwt_identity()
    user = User.query.get(me)
    return jsonify([u.serialize() for u in user.friends]), 200

# ───────────────────── 5. Token + alta de usuarios en Stream ─────────────────────
@friend_bp.route("/stream-token", methods=["POST"])
@jwt_required()
def stream_token():
    me_id = str(get_jwt_identity())
    data = request.get_json()
    
    if not isinstance(data, dict):
        return jsonify({"error": "JSON inválido"}), 400

    me_payload = data.get("me") or {}
    friends_payload = data.get("friends") or []

    if not isinstance(me_payload, dict) or not isinstance(friends_payload, list):
        return jsonify({"error": "`me` debe ser objeto y `friends` lista"}), 400

    me_name = me_payload.get("name")
    me_image = me_payload.get("image", "")

    if not me_name:
        return jsonify({"error": "Falta nombre del usuario"}), 422

    try:
        stream_client.upsert_user({
            "id": me_id,
            "name": me_name,
            "image": me_image,
            "role": "user",
        })

        users_to_upsert = []
        for friend in friends_payload:
            if not isinstance(friend, dict):
                continue
            friend_id = str(friend.get("id"))
            if not friend_id:
                continue
            users_to_upsert.append({
                "id": friend_id,
                "name": friend.get("name", ""),
                "image": friend.get("image", ""),
                "role": "user",
            })

        if users_to_upsert:
            stream_client.upsert_users(users_to_upsert)

        token = stream_client.create_token(me_id)
        return jsonify({"user_id": me_id, "token": token}), 200

    except Exception as e:
        logging.exception("Error al conectar con Stream")
        print("EXCEPCION en /stream-token:", e)
        return jsonify({"error": "Error al conectar con Stream", "detail": str(e)}), 500
