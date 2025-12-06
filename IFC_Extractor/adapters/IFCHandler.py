import io
from flask import Blueprint, request, jsonify, send_file

def create_ifc_blueprint(ifc_service):
    bp = Blueprint('ifc', __name__, url_prefix='/ifc')

    @bp.route("/upload", methods=["POST"])
    def upload_ifc():
        if 'file' not in request.files:
            return jsonify({"error": "File not found in request"}), 400
            # Validasi ekstensi .ifc
    
        file = request.files["file"]
        result = ifc_service.upload_ifc(file.filename, file)
        print(result)
        return jsonify({"message": "File Uploaded", "file_name": result})

    @bp.route("/download", methods=["GET"])
    def download_ifc():
        file_name = request.args.get("file")
        file_bytes = ifc_service.download_ifc(file_name)  # ini sudah bytes
        return send_file(
            io.BytesIO(file_bytes),
            download_name=file_name,
            as_attachment=True,
            mimetype="application/octet-stream"
        )
    
    @bp.route("/delete", methods=["DELETE"])
    def delete_ifc():
        file_name = request.args.get("file")
        result = ifc_service.delete_ifc(file_name)
        return jsonify({"message": "File Deleted", "file_name": result})

    @bp.route("/test", methods=["GET"])
    def hello_world():
        return "hello world!"

    return bp
