export function showNotice(message, duration = 2000) {
  let notice = document.getElementById("notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "notice";
    notice.className = "notice";
    const appWrapper = document.querySelector('.app-wrapper') || document.body;
    appWrapper.appendChild(notice);
  }

  notice.textContent = message;
  notice.classList.add("show");

  setTimeout(() => {
    notice.classList.remove("show");
  }, duration);
}
