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
