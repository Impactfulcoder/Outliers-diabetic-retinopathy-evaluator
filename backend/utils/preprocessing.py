# img preprocessing before model inference
from torchvision import transforms

# Model input size from the training notebook.
IMAGE_SIZE = 224

# ImageNet normalization used with the pretrained resnet18 in notebook
NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD = [ 0.229, 0.224, 0.225]


inference_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(NORMALIZE_MEAN,NORMALIZE_STD),
])


# convert PIL image into tensor as expected by resnet18 
# with Tensor with shape: [1, 3, 224, 224]
def preprocess_image(image):
    image = image.convert("RGB")

    tensor = inference_transform(image)
    # Add batch dimension
    return tensor.unsqueeze(0)