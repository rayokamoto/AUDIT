#!/usr/bin/python3

import subprocess
import shutil

# TODO: Copy across dependencies as well

subprocess.run("npm run build && npx tsc ./src/background/background.ts --outDir ./extension/background ", shell=True)
shutil.copyfile("src/manifest.json", "extension/manifest.json")
shutil.copyfile("src/popup.html", "extension/popup.html")
shutil.copytree("src/css", "extension/css", dirs_exist_ok=True)
