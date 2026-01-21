(function initFAQ(){
  document.querySelectorAll("[data-faq]").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("open"));
  });
})();
