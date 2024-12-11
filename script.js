var tamañoJuego = 4;
var contenedor = document.getElementById('contenedorJuego');

let juego = [];
let puntuacionActual = 0;
let mejorPuntuacion = 0;
let fichasElementos = [];

/**
 * Calcula si la puntuación actual es superior a la mejor y si es así la cambia
 */
function actualizarPuntuaciones() {
  if (puntuacionActual > mejorPuntuacion) {
    mejorPuntuacion = puntuacionActual;
  }
  document.getElementById('puntuacion').innerHTML = `Puntuación: ${puntuacionActual}`;
  document.getElementById('mejorPuntuacion').innerHTML = `Mejor Puntuación: ${mejorPuntuacion}`;
}

/**
 * Quita la pantalla de perdido, resetea la puntuación actual y crea grid del juego en función a la variable tamaño
 */
function inicializarJuego() {
  document.getElementById('contenedorJuegoPerdido').style.display = 'none';
  puntuacionActual = 0;
  actualizarPuntuaciones();
  juego = [];
  for (let i = 0; i < tamañoJuego; i++) {
    let fila = [];
    for (let j = 0; j < tamañoJuego; j++) {
      fila.push(0);
    }
    juego.push(fila);
  }
  añadirFichaAleatoria();
  añadirFichaAleatoria();
  
  renderizarJuego();
}

/**
 * Añade una ficha en un hueco vacío
 */
function añadirFichaAleatoria() {
  var fichasVacias = [];
  juego.forEach((fila, i) => {
    fila.forEach((celda, j) => {
      if (celda === 0) fichasVacias.push({ x: i, y: j });
    });
  });
  if (fichasVacias.length === 0) return;
  var fichaAleatoria = fichasVacias[Math.floor(Math.random() * fichasVacias.length)];
  var x = fichaAleatoria.x;
  var y = fichaAleatoria.y;

  juego[x][y] = Math.random() < 0.5 ? 2 : 4;
}
/**
 * Añade todas las fichas al tablero y anima el movimiento de la ficha
 */
function renderizarJuego() {
  contenedor.innerHTML = '';
  fichasElementos = [];
  juego.forEach(fila => {
    fila.forEach(valor => {
      var ficha = document.createElement('div');
      ficha.className = 'ficha';
      if (valor) {
        ficha.textContent = valor;
        ficha.setAttribute('data-value', valor);
        ficha.classList.add('animada');
        setTimeout(() => ficha.classList.remove('animada'), 200);
      }
      contenedor.appendChild(ficha);
      fichasElementos.push(ficha);
    });
  });
}

/**
 * Movimiento de todas las fichas en una dirección dependiendo del switch
 * y calcula si hay una ficha del mismo número en el trayecto, la suma.
 */
function mover(direccion) {
  let movido = false;
  let cambios = [];

  for (let i = 0; i < tamañoJuego; i++) {
    let fila = [];
    if (direccion === 'arriba' || direccion === 'abajo') {
      for (let j = 0; j < tamañoJuego; j++) {
        fila.push(juego[j][i]);
      }
    } else {
      fila = [...juego[i]]; 
    }
    var filaFiltrada = fila.filter(elemento => elemento !== 0);
    var nuevaFila = [];

    for (let j = 0; j < filaFiltrada.length; j++) {
      if (filaFiltrada[j] === filaFiltrada[j + 1]) {
        nuevaFila.push(filaFiltrada[j] * 2);
        puntuacionActual += filaFiltrada[j] * 2;
        j++;
      } else {
        nuevaFila.push(filaFiltrada[j]);
      }
    }

    while (nuevaFila.length < tamañoJuego) {
      if (direccion === 'derecha' || direccion === 'abajo') {
        nuevaFila.unshift(0);
      } else {
        nuevaFila.push(0);
      }
    }

    if (direccion === 'arriba' || direccion === 'abajo') {
      for (let j = 0; j < tamañoJuego; j++) {
        if (juego[j][i] !== nuevaFila[j]) movido = true;
        juego[j][i] = nuevaFila[j];
        if (nuevaFila[j] !== 0) cambios.push({ fila: j, columna: i, valor: nuevaFila[j] });
      }
    } else {
      if (juego[i].toString() !== nuevaFila.toString()) movido = true;
      juego[i] = nuevaFila;
      for (let j = 0; j < tamañoJuego; j++) {
        if (nuevaFila[j] !== 0) cambios.push({ fila: i, columna: j, valor: nuevaFila[j] });
      }
    }
  }

  if (movido) {
    añadirFichaAleatoria();
    renderizarJuego();
    actualizarPuntuaciones();
    for (let i = 0; i < cambios.length; i++) {
      let { fila, columna } = cambios[i];
      var ficha = fichasElementos[fila * tamañoJuego + columna];
      if (ficha) {
        ficha.classList.add('animada');
        setTimeout(() => ficha.classList.remove('animada'), 200);
      }
    }
    
    if (esFinDelJuego()) document.getElementById('contenedorJuegoPerdido').style.display = 'flex';
  }
}
/**
 * Calcula si es el fin del juego al no poder mover niguna ficha
 */
function esFinDelJuego() {
  for (let i = 0; i < tamañoJuego; i++) {
    for (let j = 0; j < tamañoJuego; j++) {
      if (juego[i][j] === 0) return false;
      if (j < tamañoJuego - 1 && juego[i][j] === juego[i][j + 1]) return false;
      if (i < tamañoJuego - 1 && juego[i][j] === juego[i + 1][j]) return false;
    }
  }
  return true;
}


/**
 * Menú para la función moer
 */
document.addEventListener('keydown', evento => {
  switch (evento.key) {
    case 'ArrowUp':
      mover('arriba');
      break;
    case 'ArrowDown':
      mover('abajo');
      break;
    case 'ArrowLeft':
      mover('izquierda');
      break;
    case 'ArrowRight':
      mover('derecha');
      break;
  }
});

inicializarJuego();
