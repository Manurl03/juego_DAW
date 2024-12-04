const tamañoJuego = 4;
const contenedor = document.getElementById('contenedorJuego');
let juego = [];

function inicializarJuego() {
  juego = Array(tamañoJuego)
    .fill(null)
    .map(() => Array(tamañoJuego).fill(0));
  añadirFichaAleatoria();
  añadirFichaAleatoria();
  renderizarJuego();
}

function añadirFichaAleatoria() {
  const fichasVacias = [];
  juego.forEach((fila, i) => {
    fila.forEach((celda, j) => {
      if (celda === 0) fichasVacias.push({ x: i, y: j });
    });
  });

  if (fichasVacias.length === 0) return;

  const { x, y } = fichasVacias[Math.floor(Math.random() * fichasVacias.length)];
  juego[x][y] = Math.random() < 0.5 ? 2 : 4;
}

function renderizarJuego() {
  contenedor.innerHTML = '';
  juego.forEach(fila => {
    fila.forEach(valor => {
      const ficha = document.createElement('div');
      ficha.className = 'ficha';
      if (valor) {
        ficha.textContent = valor;
        ficha.setAttribute('data-value', valor);
      }
      contenedor.appendChild(ficha);
    });
  });
}

function mover(direccion) {
  let movido = false;

  for (let i = 0; i < tamañoJuego; i++) {
    let fila = juego[i];
    if (direccion === 'arriba' || direccion === 'abajo') {
      fila = juego.map(f => f[i]);
    }

    const filaFiltrada = fila.filter(v => v !== 0);
    const nuevaFila = [];

    for (let j = 0; j < filaFiltrada.length; j++) {
      if (filaFiltrada[j] === filaFiltrada[j + 1]) {
        nuevaFila.push(filaFiltrada[j] * 2);
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
      }
    } else {
      if (juego[i].toString() !== nuevaFila.toString()) movido = true;
      juego[i] = nuevaFila;
    }
  }

  if (movido) {
    añadirFichaAleatoria();
    renderizarJuego();
    if (esFinDelJuego()) alert('¡Juego terminado!');
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