export function createBackButton(container, onBack) {
  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.innerHTML = "&larr; Back";
  backBtn.addEventListener("click", onBack);
  container.appendChild(backBtn);
  return backBtn;
}
