import numpy as np
import torch
from PIL import Image

from utils.preprocessing import preprocess_image
from utils.image_utils import overlay_to_base64


# Same target layer selected in the notebook
TARGET_LAYER_PATH = "layer4[-1].conv2"

# create a jet like rgb heatmap
def _jet_colormap(values):

    values = np.clip(values,0.0,1.0)

    r = np.clip(1.5 - np.abs(4.0 * values - 3.0),0.0,1.0)
    g = np.clip(1.5 - np.abs(4.0 * values - 2.0),0.0,1.0)
    b = np.clip(1.5 - np.abs(4.0 * values - 1.0),0.0,1.0)

    return np.stack([r, g, b],axis=-1)


# generate a grad-cam overlay.
# resulting png is returned as base64
def generate_gradcam(image,model,device):

    activations = []
    gradients = []

    # Same target layer as notebook
    target_layer = (model.layer4[-1].conv2)

    # forward activation
    forward_handle = (target_layer.register_forward_hook(lambda _, __, output:activations.append(output)))

    # backward gradient.
    backward_handle = (target_layer.register_full_backward_hook(lambda _, grad_input, grad_output:gradients.append(grad_output[0])))

    try:
        # Clear previous gradients
        model.zero_grad(set_to_none=True)

        tensor = (preprocess_image(image).to(device))

        # Forward pass.
        logit = model(tensor).squeeze()

        logit.backward()

        if not activations or not gradients:
            raise RuntimeError("Grad-CAM did not capture activations or gradients.")

        # Average gradient across spatial dimensions
        # operation from the notebook
        weights = gradients[0].mean(dim=(2, 3),keepdim=True)

        # Weighted activation maps
        heatmap = torch.relu((weights* activations[0]).sum(dim=1))
        heatmap = (heatmap.squeeze().detach().cpu().numpy())

        # Normalize to [0, 1]
        heatmap = (heatmap - heatmap.min()) / (heatmap.max()- heatmap.min()+ 1e-8)

        # Resize heatmap to uploaded image dimensions
        heatmap_image = (Image.fromarray(np.uint8(255 * heatmap)).resize(image.size))

        heatmap_array = (np.asarray(heatmap_image).astype(np.float32)/ 255.0)

        original = (np.asarray(image.convert("RGB")).astype(np.float32)/ 255.0)

        # Convert grayscale heatmap into RGB color
        colored_heatmap = _jet_colormap(heatmap_array)

        # Same 65/35 overlay idea as notebook.
        overlay = np.clip(0.65 * original+0.35 * colored_heatmap,0,1)

        probability = float(torch.sigmoid(logit).item())

        return {
            "image": overlay_to_base64(overlay),
            "probability": probability,
            }

    finally:

        # Always remove hooks.
        forward_handle.remove()
        backward_handle.remove()