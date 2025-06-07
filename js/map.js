
import { inicializarCamara } from './camara.js';

document.addEventListener('DOMContentLoaded', () => {
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

  // Evento para agregar un nuevo sitio al hacer clic en el mapa
map.on('click', function(e) {
  if (modoAgregarSitio) {
    currentLatLng = e.latlng;
    document.getElementById('form-container').classList.remove('hidden');
    // Si quieres desactivar el modo después de mostrar el formulario, descomenta la siguiente línea:
    // modoAgregarSitio = false;
  }
});

  // Añadir marcador al mapa
  function addMarkerToMap(place) {
    let imagesHtml = place.images.map(img => `<img src="${img}" width="100" style="margin:4px; border-radius: 5px;">`).join('');
    const marker = L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(
        `<strong>Álbum:</strong> ${place.album}<br>
         <strong>Sitio:</strong> ${place.name}<br>
         <div style="max-height: 150px; overflow-y: auto;">${imagesHtml}</div>`
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

          }, function(error) {
              mostrarMensaje('Error al obtener la ubicación: ' + error.message);
          });
      } else {
          mostrarMensaje('Tu navegador no soporta geolocalización.');
      }
  });

  // Botón "Albums"
  document.getElementById('btn-albums').addEventListener('click', function() {
      // Ocultar mapa y botones de acción
      document.getElementById('map').classList.add('hidden');
      document.getElementById('botones').classList.add('hidden');
      document.querySelector('header').classList.add('hidden'); // Ocultar header también si es necesario
      document.querySelector('footer').classList.add('hidden'); // Ocultar footer

      // Mostrar contenedor de álbumes
      const albumsContainer = document.getElementById('albums-container');
      albumsContainer.classList.remove('hidden');
      displayAlbums();
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

  // Función para mostrar la lista de álbumes
  function displayAlbums() {
      const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
      const albumListDiv = document.getElementById('album-list');
      albumListDiv.innerHTML = ''; // Limpiar lista anterior

      if (storedPlaces.length === 0) {
          albumListDiv.innerHTML = '<p>Aún no tienes álbumes guardados. ¡Crea uno nuevo!</p>';
          return;
      }

      // Agrupar lugares por álbum
      const albums = storedPlaces.reduce((acc, place) => {
          if (!acc[place.album]) {
              acc[place.album] = [];
          }
          acc[place.album].push(place);
          return acc;
      }, {});

      for (const albumName in albums) {
          const albumPlaces = albums[albumName];
          // Usa la primera imagen del primer sitio como portada del álbum
          const albumCover = albumPlaces[0].images.length > 0 ? albumPlaces[0].images[0] : '';

          const albumCard = document.createElement('div');
          albumCard.classList.add('album-card');
          albumCard.innerHTML = `
              ${albumCover ? `<img src="${albumCover}" class="album-image" alt="Portada de ${albumName}">` : ''}
              <h3>${albumName}</h3>
              <p>${albumPlaces.length} sitios</p>
          `;
          albumCard.addEventListener('click', () => showAlbumDetails(albumName, albumPlaces));
          albumListDiv.appendChild(albumCard);
      }
  }

  // Función para mostrar los detalles de un álbum específico
  function showAlbumDetails(albumName, placesInAlbum) {
      const albumsContainer = document.getElementById('albums-container');
      albumsContainer.innerHTML = `
          <h2>Álbum: ${albumName}</h2>
          <div id="album-detail-content" class="album-detail-view"></div>
          <button id="btn-back-to-albums">Volver a Álbumes</button>
      `;

      document.getElementById('btn-back-to-albums').addEventListener('click', () => {
          albumsContainer.innerHTML = `
              <h2>Mis Álbumes</h2>
              <div id="album-list"></div>
              <button id="btn-back-to-map">Volver al Mapa</button>
          `;
          document.getElementById('btn-back-to-map').addEventListener('click', () => {
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
          displayAlbums(); // Vuelve a mostrar la lista de álbumes
      });

      const albumDetailContent = document.getElementById('album-detail-content');
      placesInAlbum.forEach(place => {
          const imagesHtml = place.images.map(img => `<img src="${img}" alt="${place.name}">`).join('');
          const placeEntry = document.createElement('div');
          placeEntry.classList.add('place-entry');
          placeEntry.innerHTML = `
              <h3>${place.name}</h3>
              <p>Fecha: ${new Date(place.date).toLocaleDateString()}</p>
              <div class="place-images">${imagesHtml}</div>
          `;
          albumDetailContent.appendChild(placeEntry);
      });
  }

  // Botón "Cerrar Sesión" (ejemplo: recarga la página y limpia localStorage)
  document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
      if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
          localStorage.clear(); // Limpia todos los datos guardados (clientes, lugares, etc.)
          location.reload(); // Recarga la página
      }
  });

  // === INICIALIZACIÓN ===
  // Carga los lugares guardados cuando la página se carga
  loadSavedPlaces();

  // SOLO UNA VEZ este evento:
  document.getElementById('btn-nuevo-sitio').addEventListener('click', function() {
    if (map.hasLayer(normalLayer)) map.removeLayer(normalLayer);
    if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
    modoAgregarSitio = true;
    mostrarMensaje('Haz clic en el mapa para agregar un nuevo sitio.');
  });

  // Inicializa la cámara (importado desde camara.js)
  inicializarCamara();

  // Aquí puedes agregar el resto de tu lógica de mapa, sitios, etc.
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
  modoAgregarSitio = false;
}

document.getElementById('btn-guardar-sitio').addEventListener('click', savePlace);
document.getElementById('btn-cancelar-sitio').addEventListener('click', resetForm);

});
  modoAgregarSitio = false; // Desactiva el modo de agregar sitio


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





