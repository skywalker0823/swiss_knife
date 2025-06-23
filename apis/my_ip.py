from flask import Blueprint, request, jsonify
import requests

my_ip_api = Blueprint('my_ip', __name__, url_prefix='/api/my_ip')

@my_ip_api.route('/', methods=['GET'])
def get_my_ip():
    # 獲取用戶的真實 IP
    if request.headers.getlist("X-Forwarded-For"):
        user_ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        user_ip = request.remote_addr
    
    try:
        # 使用 ip-api.com 獲取位置資訊
        response = requests.get(f'http://ip-api.com/json/{user_ip}')
        location_data = response.json()
        
        if location_data['status'] == 'success':
            return jsonify({
                'ip': user_ip,
                'continent': location_data.get('continent', 'Unknown'),
                'country': location_data.get('country', 'Unknown'),
                'countryCode': location_data.get('countryCode', 'Unknown'),
                'region': location_data.get('regionName', 'Unknown'),
                'city': location_data.get('city', 'Unknown'),
                'timezone': location_data.get('timezone', 'Unknown'),
                'currency': location_data.get('currency', 'Unknown'),
                'isp': location_data.get('isp', 'Unknown'),
                'org': location_data.get('org', 'Unknown'),
                'lat': location_data.get('lat', 'Unknown'),
                'lon': location_data.get('lon', 'Unknown'),
                'mobile': location_data.get('mobile', False),
                'proxy': location_data.get('proxy', False),
                'hosting': location_data.get('hosting', False)
            })
        else:
            return jsonify({
                'ip': user_ip,
                'error': '無法獲取位置資訊'
            }), 200, {'Content-Type': 'application/json; charset=utf-8'}
    
    except Exception as e:
        return jsonify({
            'ip': user_ip,
            'error': f'發生錯誤: {str(e)}'
        }), 200, {'Content-Type': 'application/json; charset=utf-8'}