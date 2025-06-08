import base64
import io

import pilgram
from PIL import Image, ImageOps


def pil_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 string"""
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# NOTE: For images whose height and weight seems to differ,
# the border width also differs, so prefer to use 1:1 image
def add_image_border(
    image: Image.Image,
    border_ratio: float = 0.05,
    bottom_border_extra: float = 0.15,
) -> Image.Image:
    """Applies photobooth style border to the given image"""

    width, height = image.size

    # Calculate border sizes
    border_top = int(height * border_ratio)
    border_side = int(width * border_ratio)
    border_bottom = int(height * (border_ratio + bottom_border_extra))

    border = (border_side, border_top, border_side, border_bottom)

    # Bordered image
    bordered_img = ImageOps.expand(image, border=border, fill="white")

    return bordered_img


def add_image_filter(image: Image.Image, filter_name: str = None) -> Image.Image:
    """
    Applies a specified filter to the input image.
    If the filter is not found returns the original image.
    """
    if not filter_name:
        return image

    filters = {
        "sepia": pilgram.css.sepia,
        "moon": pilgram.moon,
        "lofi": pilgram.lofi,
        "aden": pilgram.aden,
        "clarendon": pilgram.clarendon,
        "toaster": pilgram.toaster,
    }

    filter_func = filters.get(filter_name)
    return filter_func(image) if filter_func else image


# NOTE: Check the height of uploaded images, may differ so handle it properly later
def make_image_strip(images: list[Image.Image], filter_name: str = None):
    if not images:
        raise ValueError("No images provided.")

    processed_images = []
    for image in images:
        filtered = add_image_filter(image=image, filter_name=filter_name)
        bordered = add_image_border(image=filtered, bottom_border_extra=0)
        processed_images.append(bordered)

    width, height = processed_images[0].size
    total_height = height * len(processed_images)

    combined_image = Image.new("RGB", (width, total_height))
    for idx, img in enumerate(processed_images):
        combined_image.paste(img, (0, height * idx))

    extra_margin = int(height * 0.15)
    final_image = ImageOps.expand(
        combined_image, border=(0, 0, 0, extra_margin), fill="white"
    )
    return final_image
