window.$ = (id) => document.getElementById(id);

window.toast = function(msg){
  const t = $("toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
};

window.normaliza = function(texto){
  return (texto || "").toLowerCase().trim();
};

window.money = function(n){
  return Number(n || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};
