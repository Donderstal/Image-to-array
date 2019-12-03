from flask import Flask, send_from_directory
app = Flask(__name__)

# Path for our main Svelte page
@app.route("/")
def base():
    return send_from_directory('client', 'index.html')

if __name__ == "__main__":
    app.run(debug=True)