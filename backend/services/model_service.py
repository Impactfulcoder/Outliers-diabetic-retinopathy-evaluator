from pathlib import Path
import torch
from torch import nn
from torchvision import models

from utils.preprocessing import preprocess_image


# Set path relative to root backend dir
BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BACKEND_DIR/"models"/"retino_resnet18.pt"

# gpu if avl else cpu
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# global var to hold model instance along with threshold kinda of constants
MODEL = None
THRESHOLD = None


def build_model():
    # Create the same ResNet18 architecture used during training
    # predefined resnet18 built uisng imagnet dataset
    model = models.resnet18(weights=None) 

    # replacing resnet18's orig FC layer with 1 O/P logit for binary DR screening
    model.fc = nn.Linear(model.fc.in_features,1)
    return model


def initialize_model():
    # Load trained model once backend starts

    global MODEL, THRESHOLD
    # Prevent accidental 2nd initialization
    # [OPTIONAL]
    if MODEL is not None:
        return
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model checkpoint not found: {MODEL_PATH}")

    # Load the checkpoint created by the notebook
    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
        weights_only=False
        )

    # Build the architecture using compatible device
    MODEL = build_model().to(DEVICE)

    # Restore trained params
    MODEL.load_state_dict(checkpoint["model_state_dict"])

    # Evaluation mode is required for inference coz some model behave differently in the modes
    MODEL.eval()

    # threshold inside the checkpoint
    THRESHOLD = float(checkpoint["threshold"])

    # Info for backend guys
    print(f"\nModel loaded successfully from: {MODEL_PATH}")
    print(f"Inference device: {DEVICE}")
    print(f"Screening threshold: {THRESHOLD}\n")


def predict(image):
    if MODEL is None:
        raise RuntimeError("Model has not been initialized.")
    
    # preprocessing
    tensor = preprocess_image(image).to(DEVICE)

    # Normal prediction does not need gradients
    # ResNet18 working on the img n calculate the logit, sigmoid n probability
    with torch.inference_mode():
        logit = MODEL(tensor).squeeze()
        probability = float(torch.sigmoid(logit).item())
    return probability


# Return the loaded model, device, n threshold
def get_model():
    if MODEL is None:
        raise RuntimeError("Model has not been initialized.")
    return MODEL, DEVICE, THRESHOLD