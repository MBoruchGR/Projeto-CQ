from flask import Flask, render_template, request

app = Flask(__name__, template_folder="HTML", static_folder="STATIC")

@app.route("/")
def cookie():
    return render_template("joguinho.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500)