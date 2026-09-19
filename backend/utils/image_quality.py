# img quality checks before screening 
import numpy as np

def image_quality(image):
    # Returns: ,brightness ,contrast ,coverage ,quality_flags
    
    image_array = (np.asarray(image.convert("RGB")).astype(np.float32) / 255.0)

    # Convert rgb into  grayscale  for blur 
    gray = image_array.mean(axis=2)

    # copied blur proxy from notebook
    laplacian_proxy = (np.abs(np.diff(gray, axis=0)).mean()+np.abs(np.diff(gray, axis=1)).mean())
    brightness = float(gray.mean())
    contrast = float(gray.std())
    coverage = float((gray > 0.03).mean())
    flags = []

    # Possible blur
    if laplacian_proxy < 0.025:
        flags.append("possible_blur")

    # Poor brightness
    if brightness < 0.10 or brightness > 0.85:
        flags.append("poor_brightness")

    # Low contrast
    if contrast < 0.07:
        flags.append("low_contrast")

    # Limited fundus coverage
    if coverage < 0.35:
        flags.append("limited_fundus_coverage")

    return {
        "brightness": brightness,
        "contrast": contrast,
        "coverage": coverage,
        "quality_flags": flags,
    }