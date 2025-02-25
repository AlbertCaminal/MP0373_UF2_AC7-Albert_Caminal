window.onload = function () {
  descargarDatosPaises();
}

async function descargarDatosPaises() {
  let respuesta = await fetch("https://countriesnow.space/api/v0.1/countries/capital");
  let datos = await respuesta.json();

  let tableBody = document.getElementById("tableBody");
  
  for (let pais of datos.data) {
    let tr = document.createElement("tr");
    
    let tdPais = document.createElement("td");
    tdPais.textContent = pais.name;
    
    let tdCapital = document.createElement("td");
    tdCapital.textContent = pais.capital;
    
    tr.appendChild(tdPais);
    tr.appendChild(tdCapital);
    
    tableBody.appendChild(tr);
  }
}
