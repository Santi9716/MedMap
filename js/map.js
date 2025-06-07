// Oculta el formulario al cargar la página
document.getElementById('form-container').classList.add('hidden');
// Oculta el contenedor de álbumes al cargar la página
document.getElementById('albums-container').classList.add('hidden');

let map = L.map('map').setView([6.2442, -75.5812], 13); // Coordenadas de Medellín

// Capas de mapa
let normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
});
let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Street',
});

normalLayer.addTo(map);

let currentLatLng = null; // Almacena la ubicación actual del clic en el mapa
let modoAgregarSitio = false; // Estado para controlar si el usuario está añadiendo un sitio

// Array para almacenar los marcadores en el mapa (para una gestión más fácil)
let mapMarkers = [];

// Función para mostrar mensajes al usuario (puedes mejorar esto con un div de mensajes)
function mostrarMensaje(msg) {
    alert(msg);
}

// === FUNCIONES PRINCIPALES ===

// Cambiar a street view y activar modo agregar sitio
document.getElementById('btn-nuevo-sitio').addEventListener('click', function() {
  if (map.hasLayer(normalLayer)) {
    map.removeLayer(normalLayer);
  }
  if (!map.hasLayer(streetLayer)) {
    streetLayer.addTo(map); // Aquí se añade streetLayer
  }
  modoAgregarSitio = true;
  mostrarMensaje('Haz clic en el mapa para agregar un nuevo sitio.');
});

// Mostrar formulario solo si está en modo agregar sitio
map.on('click', function (e) {
  if (modoAgregarSitio) {
    currentLatLng = e.latlng;
    document.getElementById('form-container').classList.remove('hidden');
    // modoAgregarSitio se desactiva en savePlace() o resetForm()
  }
});

// Guardar lugar con varias imágenes
function savePlace() {
  const album = document.getElementById('album-name').value.trim();
  const name = document.getElementById('place-name').value.trim();
  const photoInput = document.getElementById('photo-upload');

  if (!album || !name || !photoInput.files.length) {
    mostrarMensaje("Por favor ingresa el nombre del álbum, el nombre del sitio y al menos una imagen.");
    return;
  }

  let images = [];
  let files = Array.from(photoInput.files);
  let loaded = 0;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      images.push(e.target.result); // Almacena la imagen como Data URL (¡Advertencia: puede ser muy grande para localStorage!)
      loaded++;
      if (loaded === files.length) {
        const place = {
          album,
          name,
          lat: currentLatLng.lat,
          lng: currentLatLng.lng,
          images,
          date: new Date().toISOString()
        };

        // Guardar en localStorage
        const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
        storedPlaces.push(place);
        localStorage.setItem("places", JSON.stringify(storedPlaces));

        addMarkerToMap(place);
        resetForm(); // Oculta y resetea el formulario después de guardar
        modoAgregarSitio = false; // Desactiva el modo de agregar sitio
        mostrarMensaje("Sitio guardado con éxito!");
      }
    };
    reader.readAsDataURL(file);
  });
}

// Añadir marcador al mapa
function addMarkerToMap(place) {
  let imagesHtml = place.images.map(img => `<img src="${img}" width="100" style="margin:4px; border-radius: 5px;">`).join('');
  const marker = L.marker([place.lat, place.lng])
    .addTo(map)
    .bindPopup(
      `<strong>Álbum:</strong> ${place.album}<br>
       <strong>Sitio:</strong> ${place.name}<br>
       <div style="max-height: 150px; overflow-y: auto;">${imagesHtml}</div><br>
       <button onclick="mostrarCalificacion('${place.name}')">⭐ Calificar y comentar</button>`
    );
  mapMarkers.push(marker); // Guarda el marcador para futuras operaciones
}

// Cargar lugares guardados al iniciar
function loadSavedPlaces() {
  const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
  storedPlaces.forEach(addMarkerToMap);
}

// Resetear formulario
function resetForm() {
  document.getElementById('album-name').value = '';
  document.getElementById('place-name').value = '';
  document.getElementById('photo-upload').value = '';
  document.getElementById('form-container').classList.add('hidden');
  modoAgregarSitio = false; // Desactiva el modo de agregar sitio
}

// --- Funcionalidades de Botones Adicionales ---

// Botón "Seguimiento" (ejemplo simple de geolocalización)
document.getElementById('btn-seguimiento').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Eliminar marcador de seguimiento anterior si existe
            mapMarkers.forEach(marker => {
                if (marker.isUserLocation) {
                    map.removeLayer(marker);
                }
            });

            // Añadir un marcador para la ubicación actual del usuario
            const userMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup('Tu ubicación actual')
                .openPopup();
            userMarker.isUserLocation = true; // Marca este marcador como ubicación de usuario
            mapMarkers.push(userMarker);
            map.setView([lat, lng], 15); // Centra el mapa en la ubicación del usuario
            mostrarMensaje(`Ubicación actual: Lat ${lat}, Lng ${lng}`);

            // IMPORTANTE: Se eliminó el cambio de capa aquí. El mapa permanecerá en la capa actual.

        }, function(error) {
            mostrarMensaje('Error al obtener la ubicación: ' + error.message);
        });
    } else {
        mostrarMensaje('Tu navegador no soporta geolocalización.');
    }
});


// Botón "Volver al Mapa" desde la vista de álbumes
document.getElementById('btn-back-to-map').addEventListener('click', function() {
    // Ocultar contenedor de álbumes
    document.getElementById('albums-container').classList.add('hidden');

    // Mostrar mapa y botones de acción
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('botones').classList.remove('hidden');
    document.querySelector('header').classList.remove('hidden'); // Mostrar header de nuevo
    document.querySelector('footer').classList.remove('hidden'); // Mostrar footer de nuevo

    // Volver a la capa normal por defecto
    if (map.hasLayer(streetLayer)) {
        map.removeLayer(streetLayer);
    }
    if (!map.hasLayer(normalLayer)) {
        normalLayer.addTo(map);
    }
});

// === GESTIÓN DE ÁLBUMES Y CALIFICACIONES ===

// Guarda calificación y comentario en localStorage
function guardarCalificacionComentario(nombreSitio, calificacion, comentario) {
    let calificaciones = JSON.parse(localStorage.getItem("calificaciones")) || {};
    if (!calificaciones[nombreSitio]) {
        calificaciones[nombreSitio] = { calificaciones: [], comentarios: [] };
    }
    if (calificacion) calificaciones[nombreSitio].calificaciones.push(Number(calificacion));
    if (comentario) calificaciones[nombreSitio].comentarios.push(comentario);
    localStorage.setItem("calificaciones", JSON.stringify(calificaciones));
}

// Función para calificar y comentar un sitio
function mostrarCalificacion(nombreSitio) {
    const comentario = prompt(`¿Qué opinas de ${nombreSitio}?`);
    const estrellas = prompt(`¿Cuántas estrellas le das a ${nombreSitio}? (1 a 5)`);
    if (comentario || estrellas) {
        guardarCalificacionComentario(nombreSitio, estrellas, comentario);
        alert(`¡Gracias por tu opinión!\n⭐ Calificación: ${estrellas || 'N/A'} estrellas\n📝 Comentario: ${comentario || 'Ninguno'}`);
    }
}

// Mostrar lista de álbumes
function mostrarAlbums() {
    const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = '';
    // Agrupa por álbum
    const albums = storedPlaces.reduce((acc, place) => {
        if (!acc[place.album]) acc[place.album] = [];
        acc[place.album].push(place);
        return acc;
    }, {});
    Object.keys(albums).forEach(albumName => {
        const btn = document.createElement('button');
        btn.textContent = albumName;
        btn.onclick = () => mostrarDetallesAlbum(albumName, albums[albumName]);
        albumList.appendChild(btn);
    });
    document.getElementById('album-list').classList.remove('hidden');
    document.getElementById('album-details').classList.add('hidden');
}

// Mostrar detalles de un álbum
function mostrarDetallesAlbum(albumName, places) {
    document.getElementById('album-site-name').textContent = albumName;
    // Calcula promedio de calificación y muestra comentarios de todos los sitios de ese álbum
    let calificaciones = JSON.parse(localStorage.getItem("calificaciones")) || {};
    let allRatings = [];
    let allComments = [];
    places.forEach(place => {
        const cal = calificaciones[place.name];
        if (cal) {
            allRatings = allRatings.concat(cal.calificaciones);
            allComments = allComments.concat(cal.comentarios);
        }
    });
    // Promedio de calificación
    let promedio = allRatings.length ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : "Sin calificar";
    document.getElementById('album-rating').textContent = promedio;
    // Lista de comentarios
    const commentsList = document.getElementById('album-comments');
    commentsList.innerHTML = '';
    if (allComments.length) {
        allComments.forEach(com => {
            const li = document.createElement('li');
            li.textContent = com;
            commentsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "Sin comentarios aún.";
        commentsList.appendChild(li);
    }

    // Mostrar imágenes de todos los sitios del álbum
    const imagesDiv = document.getElementById('album-images');
    imagesDiv.innerHTML = '';
    places.forEach(place => {
        if (place.images && place.images.length) {
            place.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = place.name;
                img.style.maxWidth = '120px';
                img.style.margin = '5px';
                img.style.borderRadius = '5px';
                imagesDiv.appendChild(img);
            });
        }
    });

    document.getElementById('album-list').classList.add('hidden');
    document.getElementById('album-details').classList.remove('hidden');
}

// Volver a la lista de álbumes
document.getElementById('btn-back-to-albums').onclick = function() {
    document.getElementById('album-details').classList.add('hidden');
    document.getElementById('album-list').classList.remove('hidden');
};

// Mostrar albums al hacer clic en el botón
document.getElementById('btn-albums').onclick = function() {
    document.getElementById('albums-container').classList.remove('hidden');
    document.getElementById('map').classList.add('hidden');
    document.getElementById('botones').classList.add('hidden');
    document.querySelector('header').classList.add('hidden');
    document.querySelector('footer').classList.add('hidden');
    mostrarAlbums();
};

// Volver al mapa
document.getElementById('btn-back-to-map').onclick = function() {
    document.getElementById('albums-container').classList.add('hidden');
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('botones').classList.remove('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('footer').classList.remove('hidden');
};
// === FIN GESTIÓN DE ÁLBUMES Y CALIFICACIONES ===





