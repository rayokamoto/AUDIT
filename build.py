#!/usr/bin/env python3

import json
from pathlib import Path
import shutil
import subprocess
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

def update_version(fp, version, msg):
    with open(fp, "r+") as f:
        config = json.load(f)
        f.seek(0)
        config["version"] = version
        json.dump(config, f, indent=2)
        f.truncate()
    if msg != "":
        print(msg)

def build_prod(version=None):
    """ Build with extra steps for production """

    if version is None:
        try:
            version = subprocess.check_output("git describe --tags --abbrev=0", shell=True, stderr=subprocess.DEVNULL)
            version = str(version)[3:-3]
        except subprocess.CalledProcessError as e:
            version = "1.0.0"
            print(f"Error while fetching version!\n{e}")
        print(f"Current version: {version}")

    update_version("package.json", version, "Updated package.json")
    update_version("src/manifests/chrome/manifest.json", version, "Updated Chrome manifest.json")
    update_version("src/manifests/firefox/manifest.json", version, "Updated Firefox manifest.json")

    build_chrome()
    build_firefox()

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

def main(argv):
    if len(argv) == 1:
        build_chrome()
        build_firefox()
    elif len(argv) >= 2:
        if argv[1] == "prod" and len(argv) == 3:
            build_prod(argv[2])
        elif argv[1] == "prod":
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
    main(argv)
