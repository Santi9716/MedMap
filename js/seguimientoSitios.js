document.addEventListener('DOMContentLoaded', () => {
    // Lista fija de 15 sitios de la ciudad
    const lugaresCiudad = [
        { nombre: "Plaza Botero" },
        { nombre: "Museo de Antioquia" },
        { nombre: "Metrocable" },
        { nombre: "Jardín Botánico" },
        { nombre: "Parque Arví" },
        { nombre: "Cerro Nutibara / Pueblito Paisa" },
        { nombre: "Parque Explora" },
        { nombre: "Planetario de Medellín" },
        { nombre: "Parque de los Deseos" },
        { nombre: "Comuna 13" },
        { nombre: "Catedral Metropolitana" },
        { nombre: "Palacio de la Cultura" },
        { nombre: "Teatro Metropolitano" },
        { nombre: "Parque Lleras" },
        { nombre: "Mirador Las Palmas" }
    ];

    // Carga los visitados del usuario desde localStorage
    let lugaresVisitados = JSON.parse(localStorage.getItem('lugaresVisitados')) || [];

    const seguimientoInterfaz = document.getElementById('seguimientoLugaresInterfaz');
    const listadoLugares = document.getElementById('listadoLugares');
    const btnRegresar = document.querySelector('.btnRegresar');
    const map = document.getElementById('map');
    const botones = document.getElementById('botones');
    const menuSeguimiento = document.getElementById('menu-seguimiento');

    // Mostrar listado de lugares pendientes y visitados
    function mostrarSeguimiento() {
        listadoLugares.innerHTML = "";

        // Lugares pendientes
        const pendientes = lugaresCiudad.filter(lugar => !lugaresVisitados.some(v => v.nombre === lugar.nombre));
        if (pendientes.length > 0) {
            const tituloPendientes = document.createElement("h3");
            tituloPendientes.textContent = "Lugares Pendientes:";
            tituloPendientes.className = "titulo-pendientes";
            listadoLugares.appendChild(tituloPendientes);

            const gridPendientes = document.createElement("div");
            gridPendientes.className = "sitios-grid";

            pendientes.forEach(lugar => {
                const card = document.createElement("div");
                card.className = "sitio-card";
                card.innerHTML = `
                    <div class="estado" style="color: #e74c3c;">&#10006;</div>
                    <h4>${lugar.nombre}</h4>
                    <button class="ver-en-mapa" data-nombre="${lugar.nombre}">Ver en mapa</button>
                    <button class="marcar-visitado" data-nombre="${lugar.nombre}">Guardar foto y marcar visitado</button>
                `;
                gridPendientes.appendChild(card);
            });
            listadoLugares.appendChild(gridPendientes);
        } else {
            listadoLugares.innerHTML += "<p>¡No tienes lugares pendientes!</p>";
        }

        // Lugares visitados
        if (lugaresVisitados.length > 0) {
            const tituloVisitados = document.createElement("h3");
            tituloVisitados.textContent = "Lugares Visitados:";
            listadoLugares.appendChild(tituloVisitados);

            const gridVisitados = document.createElement("div");
            gridVisitados.className = "sitios-grid";

            lugaresVisitados.forEach(lugar => {
                const card = document.createElement("div");
                card.className = "sitio-card";
                card.innerHTML = `
                    <div class="estado" style="color: #27ae60;">&#10004;</div>
                    <h4>${lugar.nombre}</h4>
                `;
                gridVisitados.appendChild(card);
            });
            listadoLugares.appendChild(gridVisitados);
        }

        // Listeners para botones
        listadoLugares.querySelectorAll('.ver-en-mapa').forEach(btn => {
            btn.addEventListener('click', () => {
                const nombre = btn.dataset.nombre;
                // Aquí tu función para centrar el mapa en el sitio (puedes implementar según tu lógica de mapa)
                alert(`Centrar mapa en: ${nombre}`);
            });
        });

        listadoLugares.querySelectorAll('.marcar-visitado').forEach(btn => {
            btn.addEventListener('click', () => {
                const nombre = btn.dataset.nombre;
                // Aquí puedes abrir un modal para subir foto, por ahora solo marcar como visitado
                const lugar = lugaresCiudad.find(l => l.nombre === nombre);
                if (lugar && !lugaresVisitados.some(v => v.nombre === nombre)) {
                    lugaresVisitados.push(lugar);
                    localStorage.setItem('lugaresVisitados', JSON.stringify(lugaresVisitados));
                    mostrarSeguimiento();
                }
            });
        });
    }

    // Mostrar interfaz de seguimiento desde el menú de usuario
    if (menuSeguimiento) {
        menuSeguimiento.addEventListener('click', () => {
            mostrarSeguimiento();
            if (map) map.classList.add('hidden');
            if (botones) botones.classList.add('hidden');
            seguimientoInterfaz.classList.remove('hidden');
        });
    }

    // Regresar al mapa
    if (btnRegresar) {
        btnRegresar.addEventListener('click', () => {
            seguimientoInterfaz.classList.add('hidden');
            if (map) map.classList.remove('hidden');
            if (botones) botones.classList.remove('hidden');
        });
    }

    const btnVolverMapa = document.getElementById('btnVolverMapa');

    if (btnVolverMapa) {
        btnVolverMapa.addEventListener('click', () => {
            seguimientoInterfaz.classList.add('hidden');
            if (map) map.classList.remove('hidden');
            if (botones) botones.classList.remove('hidden');
        });
    }
});