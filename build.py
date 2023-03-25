#!/usr/bin/python3

import subprocess
import shutil
import os

subprocess.run("npm run build-chrome", shell=True)
subprocess.run("npm run build-firefox", shell=True)
subprocess.run("npx tsc ./src/firefox/background/background.ts --outDir ./extension/firefox/background", shell=True)

shutil.copyfile("src/manifests/chrome/manifest.json", "extension/chrome/manifest.json")
shutil.copyfile("src/manifests/firefox/manifest.json", "extension/firefox/manifest.json")

shutil.copyfile("src/popup.html", "extension/chrome/popup.html")
shutil.copyfile("src/popup.html", "extension/firefox/popup.html")

shutil.copytree("src/css", "extension/chrome/css", dirs_exist_ok=True)
shutil.copytree("src/css", "extension/firefox/css", dirs_exist_ok=True)

os.mkdir("extension/firefox/icons")
os.mkdir("extension/chrome/icons")
shutil.copyfile("src/icon.png", "extension/firefox/icons/icon.png")
shutil.copyfile("src/icon.png", "extension/chrome/icons/icon.png") 

shutil.make_archive("firefox", 'zip', "extension/firefox/")
os.remove("extension/firefox.zip")
shutil.move('./firefox.zip', "extension/")
