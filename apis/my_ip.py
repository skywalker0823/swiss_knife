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
    
    # if user ip starts with 192.168. or 10. or 172.16. to 172.31., return fake data
    if user_ip.startswith('192.168.') or user_ip.startswith('10.') or \
       (user_ip.startswith('172.') and 16 <= int(user_ip.split('.')[1]) <= 31):
        print("Private IP detected, returning fake data.")
        return jsonify({
            'ip': user_ip,
            'continent': 'Private Network',
            'country': 'Private Network',
            'countryCode': 'PN',
            'region': 'Private Network',
            'city': 'Private Network',
            'timezone': 'Private Network',
            'currency': 'N/A',
            'isp': 'N/A',
            'org': 'N/A',
            'lat': 'N/A',
            'lon': 'N/A',
            'mobile': False,
            'proxy': False,
            'hosting': False,
            'private': True
        }), 200, {'Content-Type': 'application/json; charset=utf-8'}

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