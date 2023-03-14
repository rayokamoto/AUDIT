#!/usr/bin/python3

# NOTE: Use a JS-specific build system later.
# This script is only a temporary solution.

import subprocess
import shutil

# TODO: Copy across dependencies as well

subprocess.run("npx tsc", shell=True)
shutil.copyfile("src/manifest.json", "extension/manifest.json")
shutil.copyfile("src/index.html", "extension/index.html")
shutil.copytree("src/css", "extension/css", dirs_exist_ok=True)
