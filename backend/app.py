from flask import Flask, jsonify, request
from flask_cors import CORS

from services.model_service import initialize_model
from services.screening_service import screen_image


app = Flask(__name__)
CORS(app)

# Match the 15 MB client-side limit.
# Client-side validation can be bypassed, so the backend must enforce it too.
app.config["MAX_CONTENT_LENGTH"] = 15 * 1024 * 1024


# ROUTE 1: return only if backend is running
@app.get("/api/health")
def health():
    return jsonify({"status": "ok"}), 200

# ROUTE 2: receive img and perform operations(screening) api endpoint for frontend
@app.post("/api/screen")
def screen():
    print("\nMethod:", request.method)
    print("Content-Type:", request.content_type)
    print("Files received:", list(request.files.keys()))
    print("hi")
    try:
        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image was provided."
            }), 400

        image_file = request.files["image"]
        if not image_file.filename:
            return jsonify({
                "success": False,
                "error": "No image file was selected."
            }), 400
        
        # Real operation and predictions performed here
        print("its is valid img way to screening")
        result = screen_image(image_file)
        return jsonify({
            "success": True,
            **result
        }), 200
    
    # Totally optional 
    except Exception as exc:
        print(f"Screening error: {exc}")

        return jsonify({
            "success": False,
            "error": "Unable to process the image."
        }), 500


# Load the trained model once once backend starts, not loaded for every request.
initialize_model()


if __name__ == "__main__":
    app.run(debug=False)
    # app.run(host="0.0.0.0", port=5000, debug=False)
    # app.run(host="127.0.0.1",port=5000,debug=True)
