const criptoSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");

const objBusq = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCripto = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

window.onload = () => {
  consultarCripto();
  form.addEventListener("submit", enviarFormulario);
  monedaSelect.addEventListener("change", leerValor);
  criptoSelect.addEventListener("change", leerValor);
};
//Funciones

//Consultar las criptomonedas mas populares
const consultarCripto = () => {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((r) => r.json())
    .then((r) => obtenerCripto(r.Data))
    .then((criptomonedas) => construirSelect(criptomonedas));
};

const construirSelect = (criptomonedas) => {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;

    criptoSelect.appendChild(option);
  });
};

const leerValor = (e) => (objBusq[e.target.name] = e.target.value);

function enviarFormulario(e) {
  e.preventDefault();

  //Validar
  const { moneda, criptomoneda } = objBusq;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //Consultar API
  consultarApi();
}

function mostrarAlerta(msj) {
  if (!document.querySelector(".error")) {
    const mensaje = document.createElement("p");
    mensaje.textContent = msj;
    mensaje.classList.add("error");

    form.appendChild(mensaje);

    setTimeout(() => mensaje.remove(), 3000);
  }
}

function consultarApi() {
  const { moneda, criptomoneda } = objBusq;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((r) => r.json())
    .then((r) => {
      mostrarCotizacion(r.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacion(cotizacion) {

  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
  const precio = document.createElement("p");

  precio.classList.add("precio");
  precio.innerHTML = `El precio es de: <span>${PRICE}</span>`;

  const precioAlt = document.createElement("p");
  precioAlt.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;

  const precioBaj = document.createElement("p");
  precioBaj.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;

  const cambio24hrs = document.createElement("p");
  cambio24hrs.innerHTML = `Variación ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultAct = document.createElement("p");
  ultAct.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

  result.appendChild(precio);
  result.appendChild(precioAlt);
  result.appendChild(precioBaj);
  result.appendChild(cambio24hrs);
  result.appendChild(ultAct);
}

function limpiarHTML(){
  while(result.firstChild)
    result.removeChild(result.firstChild);
}

function mostrarSpinner(){
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add('spinner');

  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>`

  result.appendChild(spinner);
}
