(function initCitas(){
  const form = $("formCita");
  const resultado = $("resultado");
  const listaCitas = $("listaCitas");
  const contadorCitas = $("contadorCitas");
  const btnBorrarTodo = $("btnBorrarTodo");

  if(!form || !listaCitas || !contadorCitas || !btnBorrarTodo) return;

  function leerCitas(){
    try{
      return JSON.parse(localStorage.getItem("citas_vet") || "[]");
    }catch{
      return [];
    }
  }

  function guardarCitas(citas){
    localStorage.setItem("citas_vet", JSON.stringify(citas));
  }

  function formatoFecha(yyyy_mm_dd){
    if(!yyyy_mm_dd) return "";
    const [y,m,d] = yyyy_mm_dd.split("-");
    return `${d}/${m}/${y}`;
  }

  function validarTextoMinimo(txt){
    return normaliza(txt).length >= 2;
  }

  function fechaEsValida(fecha){
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const f = new Date(fecha + "T00:00:00");
    return f >= hoy;
  }

  function renderCitas(){
    const citas = leerCitas();
    contadorCitas.textContent = `${citas.length} citas`;

    if(citas.length === 0){
      listaCitas.innerHTML = `<p class="muted">No hay citas guardadas todavía.</p>`;
      return;
    }

    listaCitas.innerHTML = "";
    citas.forEach((c, idx) => {
      const div = document.createElement("div");
      div.className = "appointment";

      div.innerHTML = `
        <div class="appt-left">
          <p><strong>${c.mascota}</strong> • ${c.servicio}</p>
          <p class="appt-meta">Dueño: ${c.dueno}</p>
          <p class="appt-meta">Fecha: ${formatoFecha(c.fecha)}</p>
        </div>
        <button class="small-btn" data-del="${idx}">Eliminar</button>
      `;

      listaCitas.appendChild(div);
    });

    listaCitas.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-del"));
        const citas = leerCitas();
        const borrada = citas[i];
        citas.splice(i, 1);
        guardarCitas(citas);
        renderCitas();
        toast(`Cita eliminada (${borrada?.mascota || "mascota"}).`);
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const dueno = $("dueno").value;
    const mascota = $("mascota").value;
    const fecha = $("fecha").value;
    const servicio = $("servicio").value;

    if(!validarTextoMinimo(dueno) || !validarTextoMinimo(mascota)){
      if(resultado) resultado.textContent = "Pon nombres válidos (mínimo 2 letras).";
      toast("Revisa los nombres.");
      return;
    }

    if(!fechaEsValida(fecha)){
      if(resultado) resultado.textContent = "La fecha debe ser hoy o un día futuro.";
      toast("Fecha inválida.");
      return;
    }

    const cita = { dueno: dueno.trim(), mascota: mascota.trim(), fecha, servicio };

    const citas = leerCitas();
    citas.push(cita);
    guardarCitas(citas);

    if(resultado){
      resultado.textContent = `✅ Cita guardada para ${cita.mascota} el ${formatoFecha(cita.fecha)} (${cita.servicio}).`;
    }

    toast("Cita guardada.");
    form.reset();
    renderCitas();
  });

  btnBorrarTodo.addEventListener("click", () => {
    const citas = leerCitas();
    if(citas.length === 0){
      toast("No hay citas para borrar.");
      return;
    }
    localStorage.removeItem("citas_vet");
    renderCitas();
    toast("Se borraron todas las citas.");
  });

  renderCitas();
})();
