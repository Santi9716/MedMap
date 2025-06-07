export function inicializarCamara() {
  // Conectar el botón "Tomar foto" con el input de la cámara
  const btnTomarFoto = document.getElementById('btn-tomar-foto');
  const inputCamara = document.getElementById('input-camara');
  const photoUpload = document.getElementById('photo-upload');

  if (!btnTomarFoto || !inputCamara || !photoUpload) return;

  btnTomarFoto.addEventListener('click', function() {
    inputCamara.click();
  });

  inputCamara.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      const dataTransfer = new DataTransfer();
      // Agregar archivos existentes del input principal
      for (let i = 0; i < photoUpload.files.length; i++) {
        dataTransfer.items.add(photoUpload.files[i]);
      }
      // Agregar la nueva foto tomada
      dataTransfer.items.add(files[0]);
      photoUpload.files = dataTransfer.files;
      alert('¡Foto tomada y agregada!');
    }
  });
}