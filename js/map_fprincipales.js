
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