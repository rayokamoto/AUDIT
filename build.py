#!/usr/bin/python3

import subprocess
import shutil
from pathlib import Path
import sys

def build_chrome():
    subprocess.run("npm run build-chrome", shell=True)
    shutil.copyfile("src/manifests/chrome/manifest.json", "extension/chrome/manifest.json")
    
    shutil.copyfile("src/popup.html", "extension/chrome/popup.html")
    shutil.copytree("src/css", "extension/chrome/css", dirs_exist_ok=True)

    Path("extension/chrome/icons").mkdir(exist_ok=True)
    shutil.copyfile("src/icon.png", "extension/chrome/icons/icon.png")

def build_firefox():
    subprocess.run("npm run build-firefox", shell=True)
    subprocess.run("npx tsc ./src/firefox/background/background.ts --outDir ./extension/firefox/background", shell=True)

    shutil.copyfile("src/manifests/firefox/manifest.json", "extension/firefox/manifest.json")
    shutil.copyfile("src/popup.html", "extension/firefox/popup.html")
    shutil.copytree("src/css", "extension/firefox/css", dirs_exist_ok=True)

    Path("extension/firefox/icons").mkdir(exist_ok=True)
    shutil.copyfile("src/icon.png", "extension/firefox/icons/icon.png")

def build_prod():
    """ Extra build step for production """
    shutil.make_archive("firefox", "zip", "extension/firefox/")
    shutil.make_archive("chrome", "zip", "extension/chrome/")
    ff_zip = Path("extension/firefox.zip")
    if ff_zip.exists():
        ff_zip.unlink()
    ch_zip = Path("extension/chrome.zip")
    if ch_zip.exists():
        ch_zip.unlink()
    shutil.move("./firefox.zip", "extension/")
    shutil.move("./chrome.zip", "extension/")

def main(argc, argv):
    if argc == 1:
        build_chrome()
        build_firefox()
    elif argc == 2:
        if argv[1] == "prod":
            build_chrome()
            build_firefox()
            build_prod()
        elif argv[1] == "chrome":
            build_chrome()
        elif argv[1] == "firefox":
            build_firefox()
        else:
            print("Not a valid option")
    else:
        print("Not a valid option")

if __name__ == "__main__":
    argv = sys.argv
    argc = len(argv)
    main(argc, argv)
