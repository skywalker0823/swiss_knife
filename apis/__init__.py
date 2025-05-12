from flask import Flask, Blueprint, jsonify, request, render_template, redirect
from pathlib import Path


def create_app():
    app = Flask(__name__, static_url_path='/',
                static_folder=Path(__file__).parent.parent / 'static',
                template_folder=Path(__file__).parent.parent / 'templates')
    
    import redis
    import string, random, os

    try:
        r = redis.Redis(host='redis', port=6379, db=0)
        r.ping()  # 測試連線
    except redis.ConnectionError:
        print("Host 非 redis 使用localhost")
        r = redis.Redis(host='0.0.0.0', port=6379, db=0)

    from apis.my_ip import my_ip_api

    app.register_blueprint(my_ip_api)

    def generate_short_id(length=6) -> str:
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(length))
    
    @app.route('/', methods=['GET'])
    def index():
        if r.ping:
            #回覆redis狀態
            return render_template('index.html', redis_status='Redis is running') if r.ping() else render_template('index.html', redis_status='Redis is not running')
    
    @app.route('/<short_id>', methods=['GET'])
    def get_re_url(short_id):
        long_url = r.get(short_id)
        if long_url:
            return redirect(long_url.decode('utf-8'))
        return jsonify({'error': '網址不存在'}), 404

    @app.route('/', methods=['POST'])
    def post_re_url():
        long_url = request.form.get('url')
        if not long_url:
            return jsonify({'error': '無 URL'})

        short_id = generate_short_id()
        r.set(short_id, long_url)
        domain = os.getenv('DOMAIN_NAME', 'localhost:5000')
        return jsonify({'short_url': f'http://{domain}/{short_id}'})



    return app
    