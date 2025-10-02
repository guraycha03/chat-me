export function showNotice(message, duration = 2000) {
  let notice = document.getElementById("notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "notice";
    notice.className = "notice";
    document.body.appendChild(notice);
  }

  notice.textContent = message;
  notice.classList.add("show");

  setTimeout(() => {
    notice.classList.remove("show");
  }, duration);
}
