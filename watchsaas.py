import subprocess

command = [
    "sass",
    "src/scss/main.scss",
    "static/css/main.css",
    "--style=expanded",
    "--source-map"
]

try:
    subprocess.run(command, check=True)
    print("Sass compiled successfully.")
except subprocess.CalledProcessError as e:
    print("Sass compilation failed.")
    print(e)