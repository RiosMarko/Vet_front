(function initServicios(){
  const buscador = $("buscador");
  const listaServicios = $("listaServicios");
  const estadoServicios = $("estadoServicios");
  const contadorServicios = $("contadorServicios");
  const btnLimpiar = $("btnLimpiar");

  if(!buscador || !listaServicios || !contadorServicios || !btnLimpiar) return;

  const itemsServicios = Array.from(listaServicios.querySelectorAll("li"));
  contadorServicios.textContent = `${itemsServicios.length} servicios`;

  function filtrarServicios(){
    const q = normaliza(buscador.value);
    let visibles = 0;

    itemsServicios.forEach(li => {
      const txt = normaliza(li.textContent);
      const match = q === "" ? true : txt.includes(q);

      li.style.display = match ? "block" : "none";
      li.classList.toggle("match", q !== "" && match);

      if(match) visibles++;
    });

    if(!estadoServicios) return;

    if(q === ""){
      estadoServicios.textContent = "";
    }else{
      estadoServicios.textContent = visibles
        ? `Encontré ${visibles} resultado(s).`
        : "No encontré servicios con ese nombre.";
    }
  }

  buscador.addEventListener("input", filtrarServicios);
  btnLimpiar.addEventListener("click", () => {
    buscador.value = "";
    filtrarServicios();
    buscador.focus();
  });

  filtrarServicios();
})();
