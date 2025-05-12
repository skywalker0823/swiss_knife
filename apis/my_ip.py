from flask import Blueprint


my_ip_api = Blueprint('my_ip', __name__, url_prefix='/api/my_ip')

@my_ip_api.route('/', methods=['GET'])
def get_my_ip():
    return "my_ip"