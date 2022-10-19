const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const divPaginacion = document.querySelector("#paginacion")
const registrosPorPagina = 40;
let totalPaginas,paginador,paginaActual=1;


eventlisteners();
function eventlisteners() {
  formulario.addEventListener("submit", validarInput);
}

function validarInput(e) {
  e.preventDefault();
  const input = document.querySelector("#busqueda").value;
  if (input === "") {
    imprimirAlerta("El campo es obligatorio", "error");
    return;
  }
  
  consumirApi(input);
}

function imprimirAlerta(msj, tipo) {
  if (document.querySelector(".alerta")) {
    return;
  }

  const alerta = document.createElement("div");
  alerta.classList.add("alerta", tipo); // se le agrega la clase de alerta y del tipo de alerta que sea
  alerta.textContent = msj; // se le agrega el msj

  const body = document.querySelector("body"); // seleccionamos el header
  body.appendChild(alerta); // insertamos la alerta

  setTimeout(() => {
    alerta.classList.add("visible"); // se pone visible la alerta
    setTimeout(() => {
      alerta.classList.remove("visible"); // le sacamos el visible
      setTimeout(() => {
        alerta.remove(); // y lo removemos del html
      }, 300);
    }, 2000);
  }, 100);
}

function consumirApi() {
    const imagen = document.querySelector("#busqueda").value;

  const key = "24639782-13abf62e2bd1867eee64e5028";
  const url = `https://pixabay.com/api/?key=${key}&q=${imagen}&image_type=photo&per_page=${totalPaginas}&page=${paginaActual}`;

  fetch(url)
    .then((res) => res.json())
    .then(({ hits,totalHits }) => {
        
        if (hits.length === 0) {
            imprimirAlerta('Imagenes no encontradas','error');
            return;
        }
        totalPaginas = calcularPaginas( totalHits );
        mostrarImagenes(hits);
    
    })
    .catch((error) => console.log(error));
}

function mostrarImagenes(hits) {
  while (resultado.firstChild) {
    // limpia el HTML previo
    resultado.removeChild(resultado.firstChild);
  }
  hits.forEach((hit) => {
    const { previewURL, likes, views,comments, largeImageURL } = hit;
    resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-3 p-3 rounded-md">
                <div class="bg-white rounded-md">
                    <img class="w-full rounded-t-md" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text font-bold"><i class="fas fa-thumbs-up icon"></i> ${likes.toLocaleString('es-ES')} </p>
                        <p class="card-text font-bold"><i class="fas fa-comment-alt icon"></i> ${comments.toLocaleString('es-ES')}</p>
                        <p class="card-text font-bold"><i class="fas fa-eye icon"></i> ${views.toLocaleString('es-ES')}</p>
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="btn w-full p-1 block mt-5 rounded text-center">Ver Imágen</a>
                    </div>
                </div>
            </div>
            `;
  });
  if (paginaActual === 1) {
    imprimirAlerta("Busqueda de fotos correcta", "exito");    
  }
  
  imprimirPaginador()
 
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total/registrosPorPagina));
    
}

function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
       yield i; // registar los valores en el generador
        
    }
}

function imprimirPaginador() {

    while(divPaginacion.firstChild) {
        divPaginacion.removeChild(divPaginacion.firstChild);
    }
    paginador = crearPaginador(totalPaginas);
    while (true) {
    
        const {value,done} = paginador.next();
        if (done) return;
        const btn = document.createElement('a');
        btn.href = '#';
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.classList.add('siguiente','px-5','py-3','mr-2','mt-5','font-bold','mb-3','rounded','pag');

        btn.onclick = (e) =>{
            e.preventDefault();
            paginaActual = value;

            consumirApi();
        }
        divPaginacion.appendChild(btn)
    }
}
