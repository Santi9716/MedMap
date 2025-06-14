document.addEventListener('DOMContentLoaded', () => {
    // Lista fija de 15 sitios de la ciudad
    const lugaresCiudad = [
        {
          nombre: "Plaza Botero",
          localizacion: { lat: 6.25184, lng: -75.56359 },
          imagen: "../images/parque botero.jpeg",
          descripcion: "Plaza en el centro con 23 esculturas monumentales al aire libre de Fernando Botero, frente al Museo de Antioquia." 
        },
        {
          nombre: "Museo de Antioquia",
          localizacion: { lat: 6.2388846, lng: -75.5723775 },
          imagen: "../images/museo-antioquia.jpg",
          descripcion: "Museo de arte moderno y contemporáneo en un edificio Art Déco, con más de 5.000 obras, incluyendo muchos Botero." 
        },
        {
          nombre: "Metrocable (Línea K)",
          localizacion: { lat: 6.2816977, lng: -75.5029386 },
          imagen: "../images/metrocable.webp",
          descripcion: "Góndola que conecta la ciudad con barrios elevados desde 2004, facilitando acceso a zonas periféricas." 
        },
        {
          nombre: "Jardín Botánico Joaquín Antonio Uribe",
          localizacion: { lat: 6.27083, lng: -75.56361 },
          imagen: "../images/jardin botanico.webp",
          descripcion: "Jardín de 14 años con orquideorama, mariposario y más de 4.500 especies de flora." 
        },
        {
          nombre: "Parque Arví",
          localizacion: { lat: 6.2781712, lng: -75.4975627 },
          imagen: "../images/arvi.jpeg",
          descripcion: "Reserva natural de 16.000 ha en Santa Elena con senderos ecológicos, patrimonio prehispánico y acceso vía Metrocable."
        },
        {
          nombre: "Cerro Nutibara / Pueblito Paisa",
          localizacion: { lat: 6.2499, lng: -75.5735 },
          imagen: "../images/cerroNutivara.jpg",
          descripcion: "Cerro artificial con réplica de un pueblo típico antioqueño, mirador y espacio cultural." 
        },
        {
          nombre: "Parque Explora",
          localizacion: { lat: 6.2675, lng: -75.5731 },
          imagen: "../images/parqueExplora.jpg",
          descripcion: "Museo interactivo de ciencia y tecnología, con acuario, vivario y salas educativas." 
        },
        {
          nombre: "Planetario de Medellín",
          localizacion: { lat: 6.2660, lng: -75.5720 },
          imagen: "../images/Planetario.jpg",
          descripcion: "Planetario con teatro astronómico, exposiciones sobre astronomía y ciencia." 
        },
        {
          nombre: "Parque de los Deseos",
          localizacion: { lat: 6.2672, lng: -75.5715 },
          imagen: "../images/parqueDeseos.jpg",
          descripcion: "Espacio público para eventos culturales y cine al aire libre, junto al Planetario." 
        },
        {
          nombre: "Comuna 13",
          localizacion: { lat: 6.2562742, lng: -75.6215434 },
          imagen: "../images/comuna13.jpg",
          descripcion: "Barrio transformado, famoso por su Graffitour, escaleras eléctricas y arte urbano comunitario." 
        },
        {
          nombre: "Catedral Metropolitana",
          localizacion: { lat: 6.2474, lng: -75.5653 },
          imagen: "../images/catedralM.jpg",
          descripcion: "También conocida como Catedral Basílica Metropolitana, de ladrillo cocido, una de las más grandes del mundo." 
        },
        {
          nombre: "Palacio de la Cultura Rafael Uribe Uribe",
          localizacion: { lat: 6.2470, lng: -75.5658 },
          imagen: "../images/palacioRafaelU.jpg",
          descripcion: "Edificio de estilo neogótico donde funciona la Biblioteca Pública y espacios culturales." 
        },
        {
          nombre: "Teatro Metropolitano",
          localizacion: { lat: 6.2512, lng: -75.5720 },
          imagen: "../images/teatroMetropolitano.jpg",
          descripcion: "Principal sala de conciertos y teatro de la ciudad, con programación de música, danza y artes escénicas." 
        },
        {
          nombre: "Parque Lleras",
          localizacion: { lat: 6.2088, lng: -75.5676 },
          imagen: "../images/lleras.jpg",
          descripcion: "Zona de vida nocturna en El Poblado, con restaurantes, bares y ambiente cosmopolita." 
        },
        {
          nombre: "Mirador Las Palmas",
          localizacion: { lat: 6.2173, lng: -75.5586 },
          imagen: "../images/palmas.jpg",
          descripcion: "Mirador panorámico desde vía Las Palmas, ideal para ver Medellín de noche." 
        }
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
                    <div class="imagen-container">
                        <img src="${lugar.imagen}" alt="${lugar.nombre}" class="imagen-lugar">
                    </div>
                    <h4>${lugar.nombre}</h4>
                    <p class="descripcion-lugar">${lugar.descripcion}</p>
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
            tituloVisitados.className = "titulo-pendientes";
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