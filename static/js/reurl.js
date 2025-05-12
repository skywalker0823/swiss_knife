document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const longUrlInput = document.getElementById('longUrl');
    const resultBox = document.getElementById('result');

    shortenBtn.addEventListener('click', async () => {
        const url = longUrlInput.value.trim();
        if (!url) {
            showResult('請輸入有效網址', true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('url', url);

            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.short_url) {
                showResult(`
                    <p>您的短網址已生成：</p>
                    <a href="${data.short_url}" target="_blank">${data.short_url}</a>
                    <button onclick="copyToClipboard('${data.short_url}')">複製網址</button>
                `);
            } else {
                showResult(data.error || '發生錯誤，請稍後再試', true);
            }
        } catch (error) {
            showResult('系統錯誤，請稍後再試', true);
        }
    });

    function showResult(message, isError = false) {
        resultBox.innerHTML = message;
        resultBox.className = `result-box ${isError ? 'error' : 'success'}`;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('已複製到剪貼板！');
            })
            .catch(err => {
                console.error('複製失敗：', err);
            });
    }
});
