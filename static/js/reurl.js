// 將必要的變數設為全域
let resultBox;

// 將 showResult 設為全域函數
window.showResult = function(message, isError = false) {
    resultBox.innerHTML = message;
    resultBox.className = `result-box ${isError ? 'error' : 'success'}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const longUrlInput = document.getElementById('longUrl');
    resultBox = document.getElementById('result');  // 指派給全域變數

    shortenBtn.addEventListener('click', async () => {
        let url = longUrlInput.value.trim();
        if (!url) {
            showResult('請輸入有效網址', true);
            return;
        }

        // 移除 http:// 或 https:// 前綴
        url = url.replace(/^https?:\/\//i, '');

        try {
            const formData = new FormData();
            formData.append('url', `https://${url}`); // 統一加上 https://

            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.short_url) {
                showResult(`
                    <p>您的短網址已生成：</p>
                    <a href="${data.short_url}" target="_blank">${data.short_url}</a>
                    <button onclick="window.copyToClipboard('${data.short_url}')">複製網址</button>
                `, false);
            } else {
                showResult(data.error || '發生錯誤，請稍後再試', true);
            }
        } catch (error) {
            showResult('系統錯誤，請稍後再試', true);
        }
    });
});

window.copyToClipboard = async function(text) {
    try {
        // 首先嘗試使用 navigator.clipboard API
        await navigator.clipboard.writeText(text);
        showSuccessCopyMessage();
    } catch (err) {
        // 如果 clipboard API 失敗，嘗試使用傳統方法
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showSuccessCopyMessage();
        } catch (fallbackErr) {
            console.error('複製失敗:', fallbackErr);
            window.showResult('複製失敗，請確認是否允許網站存取剪貼簿，或手動複製網址', true);
        }
    }
}

function showSuccessCopyMessage() {
    const originalContent = resultBox.innerHTML;
    resultBox.innerHTML += '<p class="copy-success">✓ 已成功複製到剪貼簿！</p>';
    setTimeout(() => {
        const successMessage = resultBox.querySelector('.copy-success');
        if (successMessage) {
            successMessage.remove();
        }
    }, 2000);
}
