(() => {
  "use strict";

  const prompt = document.querySelector(".install-prompt");
  const installed = navigator.standalone || matchMedia("(display-mode: standalone)").matches;
  if (!prompt || installed || !/iPhone|iPod/.test(navigator.userAgent)) return;

  const sawPrompt = "joybinya:home-screen-tip:v1";
  try {
    if (localStorage.getItem(sawPrompt)) return;
  } catch { /* The prompt can still be used in this session. */ }

  const instructions = prompt.querySelector("[data-install-instructions]");
  const show = prompt.querySelector("[data-install-open]");
  const close = prompt.querySelector("[data-install-close]");
  show.addEventListener("click", () => {
    instructions.hidden = false;
    show.hidden = true;
    instructions.focus({ preventScroll: true });
  });
  close.addEventListener("click", () => {
    prompt.hidden = true;
  });

  setTimeout(() => {
    prompt.hidden = false;
    try { localStorage.setItem(sawPrompt, "1"); } catch {}
  }, 1200);
})();
