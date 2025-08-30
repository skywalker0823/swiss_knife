document.addEventListener('DOMContentLoaded', function() {
    const loading = document.querySelector('.loading');
    const ipDetails = document.querySelector('.ip-details');

    // 定義要顯示的欄位和其對應的元素 ID
    const fields = {
        'userIp': 'ip',
        'country': 'country',
        'countryCode': 'countryCode',
        'city': 'city',
        'region': 'region',
        'timezone': 'timezone',
        'isp': 'isp',
    };

    fetch('/api/my_ip')
        .then(response => response.json())
        .then(data => {
            // console.log('收到的完整資料:', data);
            
            if (data.error) {
                throw new Error(data.error);
            }

            // 安全地更新 DOM
            Object.entries(fields).forEach(([elementId, dataKey]) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = data[dataKey] || 'N/A';
                } else {
                    console.warn(`找不到 ID 為 ${elementId} 的元素`);
                }
            });

            // 處理連線類型
            const connectionTypeElement = document.getElementById('connectionType');
            if (connectionTypeElement) {
                let connectionTypes = [];
                if (data.mobile) connectionTypes.push('行動網路');
                if (data.proxy) connectionTypes.push('代理伺服器');
                if (data.hosting) connectionTypes.push('主機服務');
                if (data.private) connectionTypes.push('區域網路');
                connectionTypeElement.textContent = connectionTypes.length ? 
                    connectionTypes.join(', ') : '一般網路';
            }

            // 隱藏載入中顯示結果
            if (loading) loading.style.display = 'none';
            if (ipDetails) ipDetails.style.display = 'block';
        })
        .catch(error => {
            console.error('處理資料時發生錯誤:', error);
            if (loading) {
                loading.textContent = '無法獲取 IP 資訊：' + error.message;
            }
        });
});