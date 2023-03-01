#!/usr/bin/python3

# NOTE: Use a JS-specific build system later.
# This script is only a temporary solution.

import subprocess
import shutil

subprocess.run("npx tsc", shell=True)
shutil.copyfile("src/manifest.json", "extension/manifest.json")
shutil.copyfile("src/index.html", "extension/index.html")
