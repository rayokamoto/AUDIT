#!/usr/bin/python3

import os
from pathlib import Path
import platform
import subprocess
import sys

platforms = {
    "darwin": ["amd64", "arm64"],
    "linux": ["386", "amd64", "arm", "arm64"],
    "windows": ["386", "amd64"]
}

def build(os_name: str, arch: str):
    version_line = 'const tcVersion = "CalSync 0.0.0 (build {0})"\n'
    try:
        version = subprocess.check_output("git describe --tags --abbrev=0", shell=True, stderr=subprocess.DEVNULL)
        version = str(version)[3:-3]
    except subprocess.CalledProcessError:
        version = "0.0.0"
    commit = subprocess.check_output("git rev-parse HEAD", shell=True, stderr=subprocess.DEVNULL)
    version_line = version_line.replace("0.0.0", str(version)).replace("{0}", str(commit)[2:-3])
    with open("src/version.go", "w") as f:
        f.write("package main\n\n" + version_line)

    ext = ""
    if os_name == "windows":
        ext = ".exe"

    cwd = Path.cwd().joinpath("src")

    output = f"../build/{os_name}-{arch}/calsync{ext}"
    source = "."
    cmd = ["go", "build", "-ldflags=-s -w", "-o", output, source]

    env = os.environ
    env["CGO_ENABLED"] = "0"
    env["GOARCH"] = arch
    env["GOOS"] = os_name

    try:
        print(f"Compiling CalSync for {os_name} on {arch}... ", end="", flush=True)
        subprocess.run(
            cmd,
            stdin=sys.stdin,
            stdout=sys.stdout,
            stderr=sys.stderr,
            check=True,
            env=env,
            cwd=cwd
        )
        print("Done")
    except subprocess.CalledProcessError as e:
        print(e)
        sys.exit(1)

def run(argv: list[str]):
    argv = argv[1:]
    if argv[0] == "all":
        for os_name, archs in platforms.items():
            for arch in archs:
                build(os_name, arch)
    else:
        for i in argv:
            # TODO: Add error handling?
            i = i.split("/")
            build(i[0], i[1])



def print_help():
    cmd = "python3 build.py"
    if platform.system().lower() == "windows":
        cmd = "py build.py"
    print(
        "--- Build help ---\n\n"
        "Supported OS and architectures:\n"
        "  - darwin  (amd64, arm64)\n"
        "  - linux   (386, amd64, arm, arm64)\n"
        "  - windows (386, amd64)\n\n"
        "Invoke the script without any arguments to automatically build for your system.\n\n"
        "USAGE:\n"
        f"    {cmd} [<<OS>/<ARCH>> ...]\n" # - Provide a valid combination of OS and architecture. Several can be built at once
        "\n"
        "COMMANDS:\n"
        "    all    Build for all platforms (this may take a while)\n"
        "    help   Shows this command\n"
    )


def main(argc: int, argv: list[str]):
    if argc == 1:
        os_name = platform.system().lower()
        arch = platform.machine().lower()
        if arch in ["i386", "x86"]:
            arch = "386"
        elif arch in ["x64", "x86_64"]:
            arch = "amd64"
        print(f"Automatically building CalSync for the host system: {os_name}/{arch}")
        print("See 'help' for more information")
        argv.append(f"{os_name}/{arch}")
        run(argv)
    elif argv[1] == "help":
        print_help()
    elif argv[1] == "all" or argc >= 1:
        run(argv)
    else:
        print("Invalid argument")



if __name__ == "__main__":
    argv = sys.argv
    argc = len(argv)
    main(argc, argv)
