// Variables globales
var todasLasCanciones = [];
var albumActual = null;

// Nombres de albums
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

// Colores de tarjetas
var coloresTarjeta = {
    '1': 'linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%)',
    '2': 'linear-gradient(135deg, #A5D6A7 0%, #81C784 100%)',
    '3': 'linear-gradient(135deg, #FFF59D 0%, #FFF176 100%)',
    '4': 'linear-gradient(135deg, #CE93D8 0%, #BA68C8 100%)',
    '5': 'linear-gradient(135deg, #EF5350 0%, #E57373 100%)',
    '6': 'linear-gradient(135deg, #546E7A 0%, #455A64 100%)',
    '7': 'linear-gradient(135deg, #F48FB1 0%, #F06292 100%)',
    '8': 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
    '9': 'linear-gradient(135deg, #BCAAA4 0%, #A1887F 100%)',
    '10': 'linear-gradient(135deg, #22506eff 0%, #113349ff 100%)',
    '11': 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 100%)'
};

// Cargar canciones cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCanciones();
    
    var albumSelect = document.getElementById('albumSelect');
    albumSelect.addEventListener('change', function() {
        cambiarAlbum();
    });
});

// Función para cargar canciones
async function cargarCanciones() {
    try {
        var response = await fetch('https://taylor-swift-api.sarbo.workers.dev/songs');
        todasLasCanciones = await response.json();
    } catch (error) {
        alert('Error al cargar canciones');
        console.log(error);
    }
}

// Función cuando cambia el select
function cambiarAlbum() {
    var albumSelect = document.getElementById('albumSelect');
    var valor = albumSelect.value;
    
    if (valor == '') {
        // Ocultar todo
        document.getElementById('loading').style.display = 'none';
        document.getElementById('songsContainer').style.display = 'none';
        document.getElementById('noSelection').style.display = 'block';
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        albumActual = null;
        return;
    }

    albumActual = valor;
    
    // Ocultar todo primero
    document.getElementById('loading').style.display = 'block';
    document.getElementById('songsContainer').style.display = 'none';
    document.getElementById('noSelection').style.display = 'none';
    
    // Cambiar color de fondo
    var colorFondo = coloresFondo[valor];
    if (colorFondo) {
        document.body.style.background = colorFondo;
    }

    // Esperar un poco y mostrar canciones
    setTimeout(function() {
        mostrarCanciones(valor);
    }, 300);
}

// Función para mostrar las canciones
function mostrarCanciones(id) {
    var cancionesDelAlbum = [];
    
    // Buscar canciones del album
    for (var i = 0; i < todasLasCanciones.length; i++) {
        if (todasLasCanciones[i].album_id == id) {
            cancionesDelAlbum.push(todasLasCanciones[i]);
        }
    }
    
    // Poner el nombre del album
    var nombreAlbum = nombres[id];
    document.getElementById('albumName').textContent = nombreAlbum;
    document.getElementById('songCount').textContent = cancionesDelAlbum.length + ' canciones';
    
    // Mostrar imagen del album
    var albumImage = document.getElementById('albumImage');
    albumImage.src = './imagenes/' + id + '.jpeg';
    albumImage.alt = nombreAlbum;
    
    // Limpiar el grid
    var songsGrid = document.getElementById('songsGrid');
    songsGrid.innerHTML = '';
    
    // Crear tarjetas para cada cancion
    var colorTarjeta = coloresTarjeta[id];
    
    for (var j = 0; j < cancionesDelAlbum.length; j++) {
        var cancion = cancionesDelAlbum[j];
        
        // Crear div de tarjeta
        var tarjeta = document.createElement('div');
        tarjeta.className = 'song-card';
        if (colorTarjeta) {
            tarjeta.style.background = colorTarjeta;
        }
        
        // Crear titulo
        var divTitulo = document.createElement('div');
        divTitulo.className = 'song-title';
        if (cancion.title) {
            divTitulo.textContent = cancion.title;
        } else {
            divTitulo.textContent = 'Sin título';
        }
        
        // Crear album
        var divAlbum = document.createElement('div');
        divAlbum.className = 'song-album';
        divAlbum.textContent = nombreAlbum;
        
        // Agregar al tarjeta
        tarjeta.appendChild(divTitulo);
        tarjeta.appendChild(divAlbum);
        
        // Agregar al grid
        songsGrid.appendChild(tarjeta);
    }
    
    // Ocultar cargando y mostrar contenedor
    document.getElementById('loading').style.display = 'none';
    document.getElementById('songsContainer').style.display = 'block';
}