const alertMsg = document.querySelector(".thank-you-msg");
const closeIframeBtn = document.querySelector(".iframe-btn");

// Handle message in Iframe
window.addEventListener("message", function (e) {
  if (e.origin !== "http://localhost:3000") {
    console.error("Untrusted origin:", e.origin);
    return;
  }

  alertMsg.textContent = `Thank you, ${e.data.cardHolder}! We recieved your payment!`;
});

// Close Iframe
closeIframeBtn.addEventListener("click", function () {
  window.parent.postMessage({ action: "closeIframe" }, "*");
});
