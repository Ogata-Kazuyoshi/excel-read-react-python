from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 追加: CORSを有効にする

# エンドポイントの登録
from controller.ConvertController import convert_blueprint
app.register_blueprint(convert_blueprint, url_prefix='/api')

@app.route('/test', methods=['GET'])
def test():
    return "Pythonバックエンド"

if __name__ == '__main__':
    app.run(port=5181)