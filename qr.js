const textInput = document.getElementById("textInput");
const textForm = document.getElementById("textForm");
const resetBtn = document.getElementById("resetBtn");
const emptyState = document.getElementById("emptyState");
const resultState = document.getElementById("resultState");
const generatedImage = document.getElementById("generatedImage");
const pageUrl = document.getElementById("pageUrl");
const resultTitle = document.getElementById("resultTitle");
const qrCanvas = document.getElementById("qrCanvas");
const qrCtx = qrCanvas.getContext("2d");

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function makeImageDataUrl(text) {
  const safeText = escapeHtml(text || "Your text here");
  const lines = safeText.match(/.{1,24}(\s|$)|.{1,24}/g) || [safeText];

  const tspans = lines
    .slice(0, 5)
    .map((line, index) => {
      return `<tspan x="50%" dy="${index === 0 ? 0 : 32}">${line.trim()}</tspan>`;
    })
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" rx="32"/>
      <circle cx="1040" cy="120" r="120" fill="rgba(255,255,255,0.08)"/>
      <circle cx="150" cy="520" r="180" fill="rgba(255,255,255,0.06)"/>
      <text x="50%" y="46%" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">${tspans}</text>
      <text x="50%" y="560" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="Arial, Helvetica, sans-serif" font-size="28">Generated from page input</text>
    </svg>
  `.trim();

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function drawRealQrCode(text) {
  QRCode.toCanvas(
    qrCanvas,
    text,
    {
      width: 280,
      margin: 2
    },
    function (error) {
      if (error) {
        qrCtx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
        qrCtx.fillStyle = "#64748b";
        qrCtx.font = "16px Arial";
        qrCtx.textAlign = "center";
        qrCtx.fillText("Could not generate QR code", qrCanvas.width / 2, qrCanvas.height / 2);
      }
    }
  );
}

function render(text) {
  const trimmed = text.trim();
  textInput.value = trimmed;

  if (!trimmed) {
    emptyState.style.display = "flex";
    resultState.style.display = "none";
    resultTitle.textContent = "Preview";
    pageUrl.textContent = window.location.href;
    qrCtx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    return;
  }

  emptyState.style.display = "none";
  resultState.style.display = "grid";
  resultTitle.textContent = "Result";

  const currentUrl = window.location.href;
  generatedImage.src = makeImageDataUrl(trimmed);
  pageUrl.textContent = currentUrl;
  drawRealQrCode(currentUrl);
}

textForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const trimmed = textInput.value.trim();
  if (!trimmed) return;

  const url = new URL(window.location.href);
  url.searchParams.set("text", trimmed);
  window.history.pushState({}, "", url.toString());
  render(trimmed);
});

resetBtn.addEventListener("click", function () {
  const url = new URL(window.location.href);
  url.searchParams.delete("text");
  window.history.pushState({}, "", url.toString());
  textInput.value = "";
  render("");
});

window.addEventListener("popstate", function () {
  const params = new URLSearchParams(window.location.search);
  render(params.get("text") || "");
});

const params = new URLSearchParams(window.location.search);
render(params.get("text") || "");