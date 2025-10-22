// Variables globales
var todasLasCanciones = [];
var cancionesDelJuego = [];
var cancionesCorrectas = [];
var albumActual = null;
var juegoTerminado = false;

// Nombres de álbums
var nombres = {
    '1': "1989",
    '2': "Taylor Swift",
    '3': "Fearless",
    '4': "Speak Now",
    '5': "Red",
    '6': "Reputation",
    '7': "Lover",
    '8': "Folklore",
    '9': "Evermore",
    '10': "Midnights",
    '11': "The Tortured Poets Department"
};

// Colores de fondo
var coloresFondo = {
    '1': 'linear-gradient(135deg, #89CFF0 0%, #5DADE2 100%)',
    '2': 'linear-gradient(135deg, #7FCD91 0%, #52BE80 100%)',
    '3': 'linear-gradient(135deg, #F9E79F 0%, #F4D03F 100%)',
    '4': 'linear-gradient(135deg, #BB8FCE 0%, #785586ff 100%)',
    '5': 'linear-gradient(135deg, #EC7063 0%, #C0392B 100%)',
    '6': 'linear-gradient(135deg, #ABB2B9 0%, #273746 100%)',
    '7': 'linear-gradient(135deg, #dfaae0ff 0%, #e97ba0ff 100%)',
    '8': 'linear-gradient(135deg, #D5DBDB 0%, #AEB6BF 100%)',
    '9': 'linear-gradient(135deg, #D7BCA0 0%, #B8956A 100%)',
    '10': 'linear-gradient(135deg, #22506eff 0%, #113349ff 100%)',
    '11': 'linear-gradient(135deg, #F5E6D3 0%, #D7CCC8 100%)'
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarCanciones();
    
    document.getElementById('finishBtn').addEventListener('click', finalizarJuego);
    document.getElementById('newGameBtn').addEventListener('click', nuevoJuego);
});

// Función para cargar canciones
async function cargarCanciones() {
    try {
        var response = await fetch('https://taylor-swift-api.sarbo.workers.dev/songs');
        todasLasCanciones = await response.json();
        iniciarJuego();
    } catch (error) {
        alert('Error al cargar canciones. Por favor, recarga la página.');
        console.log(error);
    }
}

// Función para iniciar el juego
function iniciarJuego() {
    juegoTerminado = false;
    
    // Seleccionar álbum aleatorio
    var albumIds = Object.keys(nombres);
    var randomIndex = Math.floor(Math.random() * albumIds.length);
    albumActual = albumIds[randomIndex];
    
    // Obtener canciones del álbum seleccionado
    var cancionesAlbum = todasLasCanciones.filter(function(c) {
        return c.album_id == albumActual;
    });
    
    // Obtener canciones de otros álbumes
    var cancionesOtros = todasLasCanciones.filter(function(c) {
        return c.album_id != albumActual;
    });
    
    // Mezclar y seleccionar canciones
    cancionesAlbum.sort(function() { return Math.random() - 0.5; });
    cancionesOtros.sort(function() { return Math.random() - 0.5; });
    
    // Seleccionar entre 5 y 8 canciones del álbum correcto
    var numCorrectas = 5 + Math.floor(Math.random() * 4);
    var seleccionCorrectas = cancionesAlbum.slice(0, numCorrectas);
    
    // Completar hasta 15 con canciones de otros álbumes
    var numIncorrectas = 15 - numCorrectas;
    var seleccionIncorrectas = cancionesOtros.slice(0, numIncorrectas);
    
    // Combinar y mezclar
    cancionesDelJuego = seleccionCorrectas.concat(seleccionIncorrectas);
    cancionesDelJuego.sort(function() { return Math.random() - 0.5; });
    
    // Guardar IDs de canciones correctas
    cancionesCorrectas = seleccionCorrectas.map(function(c) { return c.id; });
    
    mostrarJuego();
}

// Función para mostrar el juego
function mostrarJuego() {
    // Cambiar fondo
    document.body.style.background = coloresFondo[albumActual];
    
    // Mostrar información del álbum
    var nombreAlbum = nombres[albumActual];
    document.getElementById('albumName').textContent = nombreAlbum;
    document.getElementById('albumImage').src = './imagenes/' + albumActual + '.jpeg';
    document.getElementById('albumImage').alt = nombreAlbum;
    
    // Crear tarjetas de canciones
    var songsGrid = document.getElementById('songsGrid');
    songsGrid.innerHTML = '';
    
    for (var i = 0; i < cancionesDelJuego.length; i++) {
        var cancion = cancionesDelJuego[i];
        
        var tarjeta = document.createElement('div');
        tarjeta.className = 'song-card';
        tarjeta.dataset.songId = cancion.id;
        
        var divTitulo = document.createElement('div');
        divTitulo.className = 'song-title';
        divTitulo.textContent = cancion.title || 'Sin título';
        
        var divAlbum = document.createElement('div');
        divAlbum.className = 'song-album';
        divAlbum.textContent = nombres[cancion.album_id] || 'Desconocido';
        
        tarjeta.appendChild(divTitulo);
        tarjeta.appendChild(divAlbum);
        
        tarjeta.addEventListener('click', function() {
            if (!juegoTerminado) {
                this.classList.toggle('selected');
            }
        });
        
        songsGrid.appendChild(tarjeta);
    }
    
    // Ocultar loading y mostrar juego
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('results').style.display = 'none';
}

// Función para finalizar el juego
function finalizarJuego() {
    juegoTerminado = true;
    
    var tarjetas = document.querySelectorAll('.song-card');
    var aciertos = 0;
    var errores = 0;

    tarjetas.forEach(function(tarjeta) {
        var songId = parseInt(tarjeta.dataset.songId);
        var estaSeleccionada = tarjeta.classList.contains('selected');
        var esCorrecta = cancionesCorrectas.indexOf(songId) !== -1;

        if (estaSeleccionada && esCorrecta) {
            tarjeta.classList.add('correct');
            aciertos++;
        } else if (estaSeleccionada && !esCorrecta) {
            tarjeta.classList.add('incorrect');
            errores++;
        } else if (!estaSeleccionada && esCorrecta) {
            // No seleccionada pero era correcta → error
            tarjeta.classList.add('correct');
            errores++;
        }
    });

    mostrarResultados(aciertos, errores);
}

// Función para mostrar los resultados
function mostrarResultados(aciertos, errores) {
    var puntuacion = aciertos * 10; // ✅ 10 puntos por canción correcta

    document.getElementById('correctCount').textContent = aciertos;
    document.getElementById('incorrectCount').textContent = errores;
    document.getElementById('finalScore').textContent = puntuacion + ' pts';

    var scoreElement = document.getElementById('finalScore');
    var mensaje = '';

    if (puntuacion >= 80) {
        scoreElement.className = 'score excellent';
        mensaje = '¡Increíble! Eres un verdadero Swiftie 🌟';
    } else if (puntuacion >= 50) {
        scoreElement.className = 'score good';
        mensaje = '¡Muy bien! Conoces bastante a Taylor 🎵';
    } else if (puntuacion >= 30) {
        scoreElement.className = 'score fair';
        mensaje = '¡No está mal! Sigue escuchando más 🎧';
    } else {
        scoreElement.className = 'score poor';
        mensaje = '¡Sigue intentándolo! Practica más 💪';
    }

    document.getElementById('scoreMessage').textContent = mensaje;

    setTimeout(function() {
        document.getElementById('gameSection').classList.add('hidden');
        document.getElementById('results').style.display = 'block';
    }, 2000);
}

// Función para iniciar un nuevo juego
function nuevoJuego() {
    document.getElementById('results').style.display = 'none';
    iniciarJuego();
}