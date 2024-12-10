var tamañoJuego = 4;
var contenedor = document.getElementById('contenedorJuego');

let juego = [];
let puntuacionActual = 0;
let mejorPuntuacion = 0;
let fichasElementos = [];

function actualizarPuntuaciones() {
  if (puntuacionActual > mejorPuntuacion) {
    mejorPuntuacion = puntuacionActual;
  }
  document.querySelector('.puntuacion p:nth-child(1)').textContent = `Puntuación: ${puntuacionActual}`;
  document.querySelector('.puntuacion p:nth-child(2)').textContent = `Mejor Puntuación: ${mejorPuntuacion}`;
}

function inicializarJuego() {
  document.getElementById('contenedorJuegoPerdido').style.display = 'none';
  puntuacionActual = 0;
  actualizarPuntuaciones();
  juego = Array(tamañoJuego)
    .fill(null)
    .map(() => Array(tamañoJuego).fill(0));
  añadirFichaAleatoria();
  añadirFichaAleatoria();
  renderizarJuego();
}

function añadirFichaAleatoria() {
  var fichasVacias = [];
  juego.forEach((fila, i) => {
    fila.forEach((celda, j) => {
      if (celda === 0) fichasVacias.push({ x: i, y: j });
    });
  });
  if (fichasVacias.length === 0) return;
  var { x, y } = fichasVacias[Math.floor(Math.random() * fichasVacias.length)];
  juego[x][y] = Math.random() < 0.5 ? 2 : 4;
}

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

function mover(direccion) {
  let movido = false;
  let cambios = [];

  for (let i = 0; i < tamañoJuego; i++) {
    let fila = juego[i];
    if (direccion === 'arriba' || direccion === 'abajo') {
      fila = juego.map(f => f[i]);
    }
    var filaFiltrada = fila.filter(v => v !== 0);
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
    cambios.forEach(({ fila, columna }) => {
      var ficha = fichasElementos[fila * tamañoJuego + columna];
      if (ficha) {
        ficha.classList.add('animada');
        setTimeout(() => ficha.classList.remove('animada'), 200);
      }
    });
    if (esFinDelJuego()) document.getElementById('contenedorJuegoPerdido').style.display = 'flex';
  }
}

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
