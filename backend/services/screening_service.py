# screening workflow used by the Flask route
from PIL import Image

from services.gradcam_service import generate_gradcam
from services.model_service import get_model
from utils.image_quality import image_quality

# TEMP DIAGNOSTIC checkpoints — remove once screening works end to end
def _dbg(step):
    print(f"[{step}]", flush=True)

# Same uncertainty range used by the notebook
REVIEW_PROBABILITY_BAND = (0.35,0.65)

# img acceptables format
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
}


def screen_image(image_file):
    # Run the complete screening pipeline:
    # Pipeline:
    #     uploaded file
    #     decode image using PIL
    #     quality checks
    #     model
    #     probability
    #     screening result
    #     manual-review decision
    #     gradcam
    #     base64 png

    # Validate img type
    if image_file.mimetype not in ALLOWED_MIME_TYPES:
        raise ValueError(
            "Unsupported image type "
            "Please upload JPG or PNG."
        )
        
    # fetch img from req of client
    print("creating the PIL of image")
    image = (Image.open(image_file.stream).convert("RGB"))

    # Force PIL to actually decode the image
    image.load()
    _dbg(3)  # [3] Image decoded
    print("loaded image")


    # Run notebook's quality checks
    quality = image_quality(image)
    _dbg(4)  # [4] Image quality checked
    print("check image")


    # Get the already-loaded model.
    model, device, threshold = (get_model())
    _dbg(5)  # [5] Model obtained
    print("obtain model 4 image")


    # Generate gradcam
    # performs the forward pass and give the probability 
    _dbg(6)  # [6] Grad-CAM started
    print("gradcam start")

    gradcam = generate_gradcam(image,model,device)
    _dbg(7)  # [7] Grad-CAM completed
    print("gradcam complete")


    probability = (gradcam["probability"])

    # check whether probability lies inside the notebook's uncertain/review band
    uncertain = (
        REVIEW_PROBABILITY_BAND[0]
        <= probability
        <= REVIEW_PROBABILITY_BAND[1]
    )

    # Quality problems or uncertain prediction means manual review is recommended
    needs_review = bool(quality["quality_flags"]or uncertain)

    # Applying threshold saved in the model checkpoint
    screening_result = (
        "refer_for_review"
        if probability >= threshold
        else "screen_negative"
    )
    print("sending the res")

    return {
        "prediction": {
            "dr_probability": probability,
            "screening_result":
                screening_result,
            "confidence":
                max(
                    probability,
                    1 - probability
                ),
            "needs_manual_review":
                needs_review,
        },
        "image_quality": quality,
        "gradcam": {
            "image":
                gradcam["image"]
        },
    }