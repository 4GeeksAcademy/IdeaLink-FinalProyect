from flask import Blueprint, request, jsonify
from api.models import db, Project
from flask_jwt_extended import jwt_required, get_jwt_identity
project_api = Blueprint('project_api', __name__)

@project_api.route('/projects', methods=['GET'])
def get_all_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([p.serialize() for p in projects]), 200


@project_api.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = Project.query.get_or_404(id)
    return jsonify(project.serialize()), 200

@project_api.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    from flask import current_app
    import os  

    user_id = get_jwt_identity()
    title = request.form.get('title')
    description = request.form.get('description')
    hashtags = request.form.get('hashtags')
    stackblitz_url = request.form.get('stackblitz_url')
    image = request.files.get('image_file')

    image_url = None
    if image:
        filename = image.filename
        save_path = os.path.join("src", "static", "uploads", filename)
        image.save(save_path)
        image_url = f"/static/uploads/{filename}"

    project = Project(
        title=title,
        description=description,
        hashtags=hashtags,
        stackblitz_url=stackblitz_url,
        image_url=image_url,
        is_accepting_applications=True,
        owner_id=user_id,
        code_files=None
    )

    db.session.add(project)
    db.session.commit()

    return jsonify(project.serialize()), 200




@project_api.route('/projects/<int:id>', methods=['PUT'])
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    
    project.title = data.get('title',project.title)
    project.description = data.get('description', project.description)
    project.image_url = data.get('image_url', project.image_url)
    project.hashtags = data.get('hashtags', project.hashtags)
    project.is_accepting_applications = data.get('is_accepting_applications', project.is_accepting_applications)
    project.stackblitz_url = data.get('stackblitz_url', project.stackblitz_url)
    project.code_files = data.get('code_files', project.code_files), 
    db.session.commit()
    return jsonify(project.serialize()), 200

@project_api.route('/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return '', 204



@project_api.route('/my-projects', methods=['GET'])
@jwt_required()
def get_my_projects():
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(owner_id=user_id).all()
    return jsonify([p.serialize() for p in projects]), 200


@project_api.route('/my-collaborations', methods=['GET'])
@jwt_required()
def get_my_collaborations():
    user_id = get_jwt_identity()
    projects = Project.query.filter(
        (Project.collaborators.any(id=user_id)) | (Project.owner_id == user_id)
    ).all()
    return jsonify([p.serialize() for p in projects]), 200
