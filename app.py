import io
import json

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image

from models.image_utils import (
    add_image_border,
    add_image_filter,
    make_image_strip,
    pil_to_base64,
)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def serve_index():
    return FileResponse("static/index.html")


@app.post("/upload")
async def upload_images(images: list[UploadFile] = File(...), tweaks: str = Form(...)):
    try:
        # Load the tweaks
        tweaks_data = json.loads(tweaks)

        image_data = []

        for image in images:
            contents = await image.read()
            img = Image.open(io.BytesIO(contents))
            # Convert to RGB if needed (for JPEG compatibility)
            if img.mode != "RGB":
                img = img.convert("RGB")
            image_data.append(img)

        filter_style = tweaks_data["filter_style"]
        processed_images = []

        if not tweaks_data["want_single_strip"]:
            for image in image_data:
                processed_img = image.copy()

                # Apply filter
                if filter_style and filter_style != "none":
                    processed_img = add_image_filter(
                        image=processed_img, filter_name=filter_style
                    )

                # Add border
                if tweaks_data["want_border"]:
                    processed_img = add_image_border(image=processed_img)

                processed_images.append(pil_to_base64(processed_img))
        else:
            # Create strip image
            strip_image = make_image_strip(
                images=image_data,
                filter_name=filter_style if filter_style != "none" else None,
            )
            processed_images.append(pil_to_base64(strip_image))

        return JSONResponse(
            {
                "status": "success",
                "processed_images": processed_images,
                "is_strip": tweaks_data["want_single_strip"],
                "tweaks_applied": tweaks_data,
            }
        )

    except Exception as e:
        print(e)
        import traceback

        traceback.print_exc()
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
