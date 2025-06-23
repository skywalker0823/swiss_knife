document.addEventListener('DOMContentLoaded', function() {
    const loading = document.querySelector('.loading');
    const ipDetails = document.querySelector('.ip-details');

    fetch('/api/my_ip')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                loading.textContent = data.error;
                return;
            }
            
            // 基本資訊
            document.getElementById('userIp').textContent = data.ip;
            document.getElementById('country').textContent = data.country;
            document.getElementById('countryCode').textContent = data.countryCode;
            document.getElementById('city').textContent = data.city;
            document.getElementById('region').textContent = data.region;
            document.getElementById('timezone').textContent = data.timezone;
            document.getElementById('currency').textContent = data.currency;
            document.getElementById('isp').textContent = data.isp;
            document.getElementById('org').textContent = data.org;

            // 連線類型資訊
            let connectionTypes = [];
            if (data.mobile) connectionTypes.push('行動網路');
            if (data.proxy) connectionTypes.push('代理伺服器');
            if (data.hosting) connectionTypes.push('主機服務');
            document.getElementById('connectionType').textContent = 
                connectionTypes.length ? connectionTypes.join(', ') : '一般網路';

            loading.style.display = 'none';
            ipDetails.style.display = 'block';
        })
        .catch(error => {
            loading.textContent = '無法獲取 IP 資訊';
            console.error('Error:', error);
        });
});
