document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const charCount = document.getElementById("charCount");
    const clearBtn = document.getElementById("clearBtn");
    const generateBtn = document.getElementById("generateBtn");
    const qrContainer = document.getElementById("qrContainer");
    const qrSection = document.getElementById("qrSection");
    const skeleton = document.getElementById("qr-skeleton");
    const historyList = document.getElementById("historyList");

    let qrCodeDataUrl = "";

    const showToast = (msg) => {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };

    inputText.addEventListener("input", () => {
        charCount.textContent = inputText.value.length;
    });

    clearBtn.addEventListener("click", () => {
        inputText.value = "";
        charCount.textContent = "0";
        qrSection.style.display = "none";
        showToast("Form Reset");
    });

    generateBtn.addEventListener("click", () => {
        const text = inputText.value.trim();
        if (!text) {
            showToast("⚠️ Please enter text/URL");
            return;
        }

        const size = parseInt(document.getElementById("size").value);
        const correction = document.getElementById("correction").value;
        const dots = document.getElementById("dotColor").value;
        const bg = document.getElementById("bgColor").value;

        qrSection.style.display = "block";
        qrContainer.style.display = "none";
        skeleton.style.display = "block";
        qrContainer.innerHTML = "";
        generateBtn.disabled = true;
        generateBtn.innerText = "Processing QR";

        setTimeout(() => {
            new QRCode(qrContainer, {
                text: text,
                width: size,
                height: size,
                colorDark: dots,
                colorLight: bg,
                correctionLevel: QRCode.CorrectLevel[correction]
            });

            setTimeout(() => {
                const canvas = qrContainer.querySelector("canvas");
                if (canvas) {
                    qrCodeDataUrl = canvas.toDataURL("image/png");
                    skeleton.style.display = "none";
                    qrContainer.style.display = "inline-block";
                    generateBtn.disabled = false;
                    generateBtn.innerText = "Generate QR Code";
                    saveToHistory(text);
                    showToast("QR Ready!");
                }
            }, 300);
        }, 1000);
    });

    document.getElementById("downloadBtn").addEventListener("click", () => {
        if (!qrCodeDataUrl) return;
        const link = document.createElement("a");
        link.download = `QR_PRO_${Date.now()}.png`;
        link.href = qrCodeDataUrl;
        link.click();
        showToast("📥 Exporting PNG");
    });

    function saveToHistory(text) {
        let history = JSON.parse(localStorage.getItem("qrHistory") || "[]");
        if (!history.includes(text)) {
            history.unshift(text);
            if (history.length > 5) history.pop();
            localStorage.setItem("qrHistory", JSON.stringify(history));
            renderHistory();
        }
    }

    function renderHistory() {
        let history = JSON.parse(localStorage.getItem("qrHistory") || "[]");
        if (history.length === 0) {
            historyList.innerHTML = `<p style="font-size: 0.75rem; opacity: 0.4; text-align:center;">No recent generations.</p>`;
            return;
        }
        historyList.innerHTML = history.map(item => `
            <li class="history-item" onclick="loadHistory('${item.replace(/'/g, "\\'")}')">
                <span>${item.length > 28 ? item.substring(0, 28) + '...' : item}</span>
                <i class="fas fa-arrow-right" style="font-size: 0.6rem; opacity: 0.5;"></i>
            </li>
        `).join("");
    }

    window.loadHistory = (text) => {
        inputText.value = text;
        charCount.textContent = text.length;
        generateBtn.click();
    };

    document.getElementById("clearHistory").addEventListener("click", () => {
        if (confirm("Wipe all recent activity?")) {
            localStorage.removeItem("qrHistory");
            renderHistory();
            showToast("History cleared!");
        }
    });

    renderHistory();
});
