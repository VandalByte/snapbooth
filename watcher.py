# Since I'm using the Tailwind CLI, the CSS needs to be recompiled every time 
# changes are made to the .html files for the styles to take effect.
# That's what this is for.

import os
import subprocess
import time

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer


class HTMLChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_run = 0
        self.cooldown = 3  # seconds

    def on_any_event(self, event):
        if (
            not event.is_directory
            and event.src_path.endswith(".html")
            and time.time() - self.last_run > self.cooldown
        ):
            print(f"[{event.event_type.upper()}] {event.src_path}")
            self.run_build_css()
            self.last_run = time.time()

    def run_build_css(self):
        try:
            print("[RUNNING] npm run build:css")
            result = subprocess.run(
                "npm run build:css",
                shell=True,
                check=True,
                capture_output=True,
                text=True,
            )
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print("[ERROR] Failed to run 'npm run build:css'")
            print(e.stderr)


if __name__ == "__main__":
    path = "./static"

    if not os.path.exists(path):
        print(f"Directory '{path}' doesn't exist...")
        exit(1)

    event_handler = HTMLChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)

    print(f"Watching HTML files in: {path}")
    observer.start()

    try:
        while True:
            time.sleep(3)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
