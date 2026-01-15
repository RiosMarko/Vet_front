
var buscador = document.getElementById("buscador");
var servicios = document.querySelectorAll("#listaServicios li");

buscador.addEventListener("keyup", function () {
  var texto = buscador.value.toLowerCase();

  for (var i = 0; i < servicios.length; i++) {
    var item = servicios[i].textContent.toLowerCase();

    if (item.includes(texto)) {
      servicios[i].style.display = "list-item";
    } else {
      servicios[i].style.display = "none";
    }
  }
});

var form = document.getElementById("formCita");
var resultado = document.getElementById("resultado");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var dueno = document.getElementById("dueno").value;
  var mascota = document.getElementById("mascota").value;
  var fecha = document.getElementById("fecha").value;

  resultado.textContent = "Cita guardada: " + mascota + " (" + dueno + ") para el día " + fecha;

  alert("Listo, tu cita quedó guardada.");

  form.reset();
});

var preguntas = document.querySelectorAll(".pregunta");

for (var j = 0; j < preguntas.length; j++) {
  preguntas[j].addEventListener("click", function () {
    var resp = this.nextElementSibling;

    if (resp.style.display === "block") {
      resp.style.display = "none";
    } else {
      resp.style.display = "block";
    }
  });
}
