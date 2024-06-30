- pythonの依存関係を入れる方法

1. 仮想環境を作る（よくわかんない）
```zh
python3 -m venv venv
source venv/bin/activate
```
2. 依存関係をインストール
```zh
pip install -r backend/requirements.txt
```

- Pushする際に、ライブラリの依存関係をrequirements.txtに反映する方法
```zh
pip freeze > requirements.txt
```