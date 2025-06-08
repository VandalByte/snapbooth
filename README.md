<p align="center">
  <img width=90% src="https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/snapbooth-banner.jpg" alt="banner" />
</p>


[Snapbooth](https://snapbooth.onrender.com) lets you capture your best or weirdest selfies, add filters, and create Instagram-ready photobooth-style pictures faster than you can say Cheese!

Contributions are always welcome! Check out the Development section to get started. If you found this project fun or useful, consider giving it a ⭐ it really helps! 🤗

## ✨ Features
- Snap a selfie or upload an image, both options supported.
- Add filters to give your photos a unique look.
- Tweak layout, add borders, and customize your photo strip.
- No signups or setup just snap, tweak, and download.

## 🔥 Snapbooth Filters
These are the currently supported filters. More exciting filters will be added in upcoming releases!

|    |    |    |
|:-------:|:-------:|:---------:|
|![Aden](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/aden.jpg)|![Black & White](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/black-white.jpg)|![Clarendon](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/clarendon.jpg)|
|**Aden**|**Black & White**|**Clarendon**|
|![Lofi](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/lofi.jpg)|![Old money](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/old-money.jpg)|![Toaster](https://raw.githubusercontent.com/VandalByte/snapbooth/main/media/filters/toaster.jpg)|
|**Lofi**|**Old Money**|**Toaster**|


## 🚀 Development
Clone the Github repository and move into it.
```sh
git clone https://github.com/VandalByte/snapbooth.git
cd snapbooth
```
Create a new virtual environment and activate it.
```sh
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```
Install the python dependencies.

```sh
pip install -r requirements.txt
```
Install the node dependencies and build Tailwind CSS.
```sh
npm install
npm run build
```
Now to update the CORS settings go to `app.py` find this  line
```
allow_origins=["https://snapbooth.onrender.com"],
```
and change it to:
```
allow_origins=["*"],
```

Next to update the frontend API URL go to `script.js` find the url
```
https://snapbooth.onrender.com/upload
```
and change it to:
```
http://127.0.0.1:8000/upload
```

Start the FastAPI backend `app.py` in development mode.
```sh
fastapi dev app.py
```
Now open your browser and go to http://127.0.0.1:8000 to see the app running locally.

## 🧪 License
This project is build with ❤️ and is licensed under the [GNU General Public License v3.0](https://github.com/VandalByte/snapbooth/blob/main/LICENSE).