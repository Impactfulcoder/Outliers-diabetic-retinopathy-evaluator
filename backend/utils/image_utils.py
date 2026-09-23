# Utilities for converting generated images into API-friendly data
# will be used for gradcam img response to the client

import base64
import io

import numpy as np
from PIL import Image


def overlay_to_base64(overlay):
    # Convert a np rgb img into a base64 png data url  

    overlay = np.clip(overlay * 255.0,0,255).astype(np.uint8)

    image = Image.fromarray(overlay,mode="RGB")

    # in-memory byte buffer
    buffer = io.BytesIO()

    image.save(buffer,format="PNG")

    buffer.seek(0)
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return (
        "data:image/png;base64,"
        + encoded
    )