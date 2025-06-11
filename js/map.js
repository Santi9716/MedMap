import { inicializarCamara } from './camara.js';

document.addEventListener('DOMContentLoaded', () => {
  // Oculta el formulario y el contenedor de álbumes al cargar la página
  document.getElementById('form-container').classList.add('hidden');
  document.getElementById('albums-container').classList.add('hidden');

  let map = L.map('map').setView([6.2442, -75.5812], 13); // Medellín

  // Capas de mapa
  let normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  });
  let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Street',
  });

  normalLayer.addTo(map);

  let currentLatLng = null;
  let modoAgregarSitio = false;
  let mapMarkers = [];

  function mostrarMensaje(msg) {
    alert(msg);
  }

  // Evento para agregar un nuevo sitio al hacer clic en el mapa
  map.on('click', function (e) {
    if (modoAgregarSitio) {
      currentLatLng = e.latlng;
      document.getElementById('form-container').classList.remove('hidden');
    }
  });

  // Añadir marcador al mapa with dynamic rating button
  function addMarkerToMap(place) {
    let imagesHtml = place.images.map(img => `<img src="${img}" width="100" style="margin:4px; border-radius: 5px;">`).join('');
    const btnId = `btn-calificar-${place.lat}-${place.lng}`.replace(/\./g, '_');
    const marker = L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(
        `<strong>Álbum:</strong> ${place.album}<br>
         <strong>Sitio:</strong> ${place.name}<br>
         <div style="max-height: 150px; overflow-y: auto;">${imagesHtml}</div><br>
         <button id="${btnId}">⭐ Calificar y comentar</button>`
      );
    mapMarkers.push(marker);

    // Asigna el evento cuando se abre el popup
    marker.on('popupopen', function () {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.onclick = () => mostrarCalificacion(place.name);
      }
    });
  }

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
        images.push(e.target.result);
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
          resetForm();
          modoAgregarSitio = false;
          mostrarMensaje("Sitio guardado con éxito!");
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Resetear formulario
  function resetForm() {
    document.getElementById('album-name').value = '';
    document.getElementById('place-name').value = '';
    document.getElementById('photo-upload').value = '';
    document.getElementById('form-container').classList.add('hidden');
    modoAgregarSitio = false;
  }

  // Cargar lugares guardados al iniciar
  function loadSavedPlaces() {
    const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
    storedPlaces.forEach(addMarkerToMap);
  }

  // Botón "Guardar" y "Cancelar" del formulario
  document.getElementById('btn-guardar-sitio').addEventListener('click', savePlace);
  document.getElementById('btn-cancelar-sitio').addEventListener('click', resetForm);

  // Botón "Nuevo Sitio"
  document.getElementById('btn-nuevo-sitio').addEventListener('click', function () {
    if (map.hasLayer(normalLayer)) map.removeLayer(normalLayer);
    if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
    modoAgregarSitio = true;
    mostrarMensaje('Haz clic en el mapa para agregar un nuevo sitio.');
  });

  // Botón "Seguimiento"
  document.getElementById('btn-seguimiento').addEventListener('click', function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
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
        userMarker.isUserLocation = true;
        mapMarkers.push(userMarker);
        map.setView([lat, lng], 15);
        mostrarMensaje(`Ubicación actual: Lat ${lat}, Lng ${lng}`);
      }, function (error) {
        mostrarMensaje('Error al obtener la ubicación: ' + error.message);
      });
    } else {
      mostrarMensaje('Tu navegador no soporta geolocalización.');
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
      const albumPlaces = albums[albumName];
      const portada = (albumPlaces[0].images && albumPlaces[0].images.length) ? albumPlaces[0].images[0] : '';
      const card = document.createElement('div');
      card.className = 'album-card';
      card.innerHTML = `
        ${portada ? `<img src="${portada}" class="album-cover" alt="Portada de ${albumName}">` : ''}
        <div class="album-info">
          <h3>${albumName}</h3>
          <p>${albumPlaces.length} sitio(s)</p>
          <button class="ver-album-btn">Ver álbum</button>
        </div>
      `;
      card.querySelector('.ver-album-btn').onclick = () => mostrarDetallesAlbum(albumName, albumPlaces);
      card.onclick = (e) => {
        if (!e.target.classList.contains('ver-album-btn')) {
          mostrarDetallesAlbum(albumName, albumPlaces);
        }
      };
      albumList.appendChild(card);
    });
    document.getElementById('album-list').classList.remove('hidden');
    document.getElementById('album-details').classList.add('hidden');
    // Muestra el botón "Volver al Mapa"
    document.getElementById('btn-back-to-map-list').style.display = '';
  }

  // Mostrar detalles de un álbum
  function mostrarDetallesAlbum(albumName, places) {
    // Limpia el contenido antes de agregar nuevo
    const albumDetailsDiv = document.getElementById('album-details');
    albumDetailsDiv.innerHTML = `
      <h3 id="album-site-name"></h3>
      <div id="album-images"></div>
      <p><strong>Calificación:</strong> <span id="album-rating"></span></p>
      <p><strong>Comentarios:</strong></p>
      <ul id="album-comments"></ul>
    `;

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
    let promedio = allRatings.length ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : "Sin calificar";
    document.getElementById('album-rating').textContent = promedio;
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
          img.style.cursor = 'pointer';
          img.onclick = () => mostrarImagenGrande(imgSrc);
          imagesDiv.appendChild(img);
        });
      }
    });

    // Botones de navegación
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'album-detail-buttons';

    const btnBackAlbums = document.createElement('button');
    btnBackAlbums.textContent = 'Volver a Álbumes';

    const btnBackMap = document.createElement('button');
    btnBackMap.textContent = 'Volver al Mapa';

    buttonsDiv.appendChild(btnBackAlbums);
    buttonsDiv.appendChild(btnBackMap);

    albumDetailsDiv.appendChild(buttonsDiv);

    // Oculta el botón "Volver al Mapa" de la lista de álbumes
    document.getElementById('btn-back-to-map-list').style.display = 'none';

    btnBackAlbums.onclick = function () {
      albumDetailsDiv.classList.add('hidden');
      document.getElementById('album-list').classList.remove('hidden');
      // Muestra el botón "Volver al Mapa" de la lista de álbumes
      document.getElementById('btn-back-to-map-list').style.display = '';
    };
    btnBackMap.onclick = function () {
      document.getElementById('albums-container').classList.add('hidden');
      document.getElementById('map').classList.remove('hidden');
      document.getElementById('botones').classList.remove('hidden');
      document.querySelector('header').classList.remove('hidden');
      document.querySelector('footer').classList.remove('hidden');
    };

    document.getElementById('album-list').classList.add('hidden');
    albumDetailsDiv.classList.remove('hidden');
  }

  // Volver a la lista de álbumes
  document.getElementById('btn-back-to-albums').onclick = function () {
    document.getElementById('album-details').classList.add('hidden');
    document.getElementById('album-list').classList.remove('hidden');
  };

  // Mostrar albums al hacer clic en el botón principal
  document.getElementById('btn-albums').onclick = function () {
    document.getElementById('albums-container').classList.remove('hidden');
    document.getElementById('map').classList.add('hidden');
    document.getElementById('botones').classList.add('hidden');
    document.querySelector('header').classList.add('hidden');
    document.querySelector('footer').classList.add('hidden');
    mostrarAlbums();
    // Muestra el botón "Volver al Mapa"
    document.getElementById('btn-back-to-map-list').style.display = '';
  };

  // Listener para el botón "Volver al Mapa" de la lista de álbumes
  document.getElementById('btn-back-to-map-list').onclick = function () {
    document.getElementById('albums-container').classList.add('hidden');
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('botones').classList.remove('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('footer').classList.remove('hidden');
    // Asegúrate de ocultar detalles y mostrar lista
    document.getElementById('album-details').classList.add('hidden');
    document.getElementById('album-list').classList.remove('hidden');
    // Oculta el botón hasta que se vuelva a mostrar la lista de álbumes
    document.getElementById('btn-back-to-map-list').style.display = 'none';
  };

  // Función para mostrar imagen en grande (overlay)
  function mostrarImagenGrande(src) {
    // Crea el overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    // Imagen grande
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
    img.alt = 'Vista ampliada';

    // Cierra al hacer clic fuera de la imagen
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };

    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }

  // Cargar lugares guardados al iniciar
  loadSavedPlaces();
}); 