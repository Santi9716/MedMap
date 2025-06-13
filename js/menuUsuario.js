document.addEventListener('DOMContentLoaded', () => {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && e.target !== userMenuBtn) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    const seguimientoBtn = document.getElementById('menu-seguimiento');
    if (seguimientoBtn) {
        seguimientoBtn.addEventListener('click', () => {
            document.getElementById('seguimiento-container').classList.remove('hidden');
            document.getElementById('map').classList.add('hidden');
            userDropdown.classList.add('hidden');
        });
    }

    const cerrarSesionBtn = document.getElementById('menu-cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioActual');
            localStorage.removeItem('nombreUsuario');
            window.location.href = "index.html";
        });
    }
});