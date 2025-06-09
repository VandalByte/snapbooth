# Contributing to Snapbooth

Hey there! 👋

I'm really glad you're interested in contributing to Snapbooth, that means a lot. I don't have much experience with frontend development, so I kept things pretty simple for this project as of now, using:

- Plain JavaScript (no frameworks)
- Node.js
- Tailwind CSS

I'd love to eventually update the project with something more modern, like **React** and **Vite**, if I get a chance to learn it. Totally open to ideas and improvements in the meantime!

---
## 🚀 Getting Started

Clone the GitHub repository and move into the project directory.
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

---

## 🛠️ Contributing Guidelines

- Please make sure your contributions are focused, and describe what you're fixing or improving.
- If you’re proposing a feature or enhancement, feel free to open a discussion or issue first.
- For bigger changes, open a PR early to get feedback.


#### Sign Your Commits (DCO)

This project uses the [Developer Certificate of Origin (DCO)](https://developercertificate.org/). It’s a simple way to confirm that you have the rights to submit your code.

You can **sign your commits** using:

```bash
git commit -s -m "your message here"
```

This will add a `Signed-off-by:` line to your commit message.

By signing, you confirm the contribution is your own work or you have permission to submit it. This helps us keep the project legally safe for everyone.

---

## 🎨 Code Style

Nothing too fancy just try to keep the style consistent with existing code. If you use Prettier or a linter, feel free to share your setup!

For **Python**, we use [black formatter](https://black.readthedocs.io/en/stable/) for formatting and [isort](https://pycqa.github.io/isort/) for sorting the imports. Please run your code through them before opening a pull request.

For everything else (JavaScript, HTML, CSS, etc.), we use [Prettier](https://prettier.io/).

---

## 🎉 Thank You!

Thanks again for your interest and support. Let’s make Snapbooth better together! 
