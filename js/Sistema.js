const btnInicio = document.getElementById("btnInicio");
const formInicio = document.getElementById("formInicio");
const btnsIniciales = document.getElementById("btnsIniciales");
const btnRegistro = document.getElementById("btnRegistro");
const formRegistro = document.getElementById("formRegistro");
const btnRegresar = document.querySelectorAll(".btnRegInicio");
const btnIngRegistro = document.getElementById("btnIngRegistro");
const btnIngSesion = document.getElementById("btnIngSesion");
const inputUsuario = document.getElementById("inputUsuario");
const inputContraseña = document.getElementById("inputContraseña");

import { UsuarioRegistrado } from "./UsuarioRegistrado.js";

class Sistema {
    constructor() {
        this.usuarios = this.cargarUsuarios() || [];
        this.lugares = [];
        this.usuarioActual = this.cargarUsuarioActual();
        
        if (window.location.pathname.includes('mapa.html')) {
            this.inicializarRecuperacion();
            this.inicializarInterfazLugares();
        }
    }
    
    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        if (!usuariosGuardados) return null;
        
        const usuariosJSON = JSON.parse(usuariosGuardados);
        return usuariosJSON.map(usuario => UsuarioRegistrado.fromJSON(usuario));
    }

    cargarUsuarioActual() {
        const usuarioGuardado = localStorage.getItem('usuarioActual');
        if (!usuarioGuardado) return null;
        
        return UsuarioRegistrado.fromJSON(JSON.parse(usuarioGuardado));
    }

    guardarUsuarios() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }

    registrarUsuario(nombre, usuario, contraseña, email, celular) {
        const usuarioExistente = this.usuarios.find(u => u.usuario === usuario);
        if (usuarioExistente) {
            alert("El nombre de usuario ya está en uso");
            return false;
        }

        const nuevoUsuario = new UsuarioRegistrado(nombre, usuario, contraseña, email, celular);
        this.usuarios.push(nuevoUsuario);
        this.guardarUsuarios();
        return true;
    }

    login(usuario, contraseña) {
        const usuarioEncontrado = this.usuarios.find(u => 
            u.usuario === usuario && u.contraseña === contraseña
        );

        if (usuarioEncontrado) {
            this.usuarioActual = usuarioEncontrado;
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
            localStorage.setItem('nombreUsuario', usuarioEncontrado.nombre);
            return true;
        }
        return false;
    }

    mostrarMenuPrincipal() {
        window.location.href = "mapa.html";
    }
    
    inicializarRecuperacion() {
        const olvidoBtn = document.getElementById("olvidoContraseña");
        const modal = document.getElementById("modalRecuperacion");
        const closeBtn = document.querySelector(".cerrar-modal");
        const confirmarBtn = document.getElementById("btnConfirmarRecuperacion");
        
        if (olvidoBtn) olvidoBtn.addEventListener("click", () => modal.style.display = "block");
        if (closeBtn) closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.getElementById("mensajeRecuperacion").textContent = "";
        });
        
        if (confirmarBtn) confirmarBtn.addEventListener("click", () => {
            const email = document.getElementById("emailRecuperacion").value;
            const nuevaPass = document.getElementById("nuevaContraseñaRec").value;
            const confirmarPass = document.getElementById("confirmarContraseñaRec").value;
            
            const usuario = this.usuarios.find(u => u.email === email);
            
            if (!usuario) {
                document.getElementById("mensajeRecuperacion").textContent = "No existe un usuario con ese correo";
                return;
            }
            
            if (nuevaPass !== confirmarPass) {
                document.getElementById("mensajeRecuperacion").textContent = "Las contraseñas no coinciden";
                return;
            }
            
            usuario.contraseña = nuevaPass;
            this.guardarUsuarios();
            
            document.getElementById("mensajeRecuperacion").textContent = "Contraseña cambiada con éxito!";
            setTimeout(() => {
                modal.style.display = "none";
                document.getElementById("mensajeRecuperacion").textContent = "";
            }, 2000);
        });
    }

    inicializarInterfazLugares() {
        document.addEventListener("DOMContentLoaded", () => {
            const nombre = localStorage.getItem('nombreUsuario');
            const mensaje = document.getElementById("mensajeMapa");
            if (nombre && mensaje) mensaje.textContent = `¡Bienvenido ${nombre}!`;

            const agregarLugarBtn = document.getElementById("agregarLugar");
            const seguimientoLugaresBtn = document.getElementById("seguimientoLugares");
            const agregarLugarInterfaz = document.getElementById("agregarLugarInterfaz");
            const seguimientoLugaresInterfaz = document.getElementById("seguimientoLugaresInterfaz");
            const menuPrincipal = document.getElementById("menuPrincipal");
            const guardarLugarBtn = document.getElementById("guardarLugar");
            const listadoLugares = document.getElementById("listadoLugares");
            const btnRegresar = document.querySelectorAll(".btnRegresar");

            agregarLugarBtn.addEventListener("click", () => this.mostrarInterfazAgregarLugar());
            seguimientoLugaresBtn.addEventListener("click", () => this.mostrarInterfazSeguimiento());
            guardarLugarBtn.addEventListener("click", () => this.marcarLugarVisitado());
            
            btnRegresar.forEach(boton => {
                boton.addEventListener("click", () => {
                    agregarLugarInterfaz.style.display = "none";
                    seguimientoLugaresInterfaz.style.display = "none";
                    menuPrincipal.style.display = "block";
                });
            });

            // Mostrar todos los lugares en el seguimiento
            this.mostrarTodosLugaresEnSeguimiento();
        });
    }

    mostrarInterfazAgregarLugar() {
        if (!this.usuarioActual) {
            alert("No hay usuario logueado");
            return;
        }

        document.getElementById("menuPrincipal").style.display = "none";
        document.getElementById("agregarLugarInterfaz").style.display = "block";
        
        const listaPendientes = document.getElementById("listaPendientes");
        listaPendientes.innerHTML = "";
        
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecciona un lugar";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        listaPendientes.appendChild(defaultOption);

        if (this.usuarioActual.lugaresPendientes?.length > 0) {
            this.usuarioActual.lugaresPendientes.forEach(lugar => {
                const option = document.createElement("option");
                option.value = lugar;
                option.textContent = lugar;
                listaPendientes.appendChild(option);
            });
            document.getElementById("guardarLugar").disabled = false;
        } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay lugares pendientes";
            option.disabled = true;
            listaPendientes.appendChild(option);
            document.getElementById("guardarLugar").disabled = true;
        }
    }

    marcarLugarVisitado() {
        const lugarSeleccionado = document.getElementById("listaPendientes").value;
        if (!lugarSeleccionado) return;
        
        if (this.usuarioActual.marcarComoVisitado(lugarSeleccionado)) {
            this.guardarUsuarios();
            localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioActual));
            alert(`Lugar ${lugarSeleccionado} marcado como visitado!`);
            this.mostrarInterfazAgregarLugar(); // Refresh the list
            this.mostrarTodosLugaresEnSeguimiento(); // Actualizar seguimiento
        }
    }

    mostrarInterfazSeguimiento() {
        if (!this.usuarioActual) {
            alert("No hay usuario logueado");
            return;
        }

        document.getElementById("menuPrincipal").style.display = "none";
        document.getElementById("seguimientoLugaresInterfaz").style.display = "block";
        this.mostrarTodosLugaresEnSeguimiento();
    }

    mostrarTodosLugaresEnSeguimiento() {
        const listadoLugares = document.getElementById("listadoLugares");
        if (!listadoLugares) return;
        
        listadoLugares.innerHTML = "";
        
        // Mostrar lugares visitados
        if (this.usuarioActual.lugaresVisitados?.length > 0) {
            const tituloVisitados = document.createElement("h3");
            tituloVisitados.textContent = "Lugares Visitados:";
            listadoLugares.appendChild(tituloVisitados);
            
            this.usuarioActual.lugaresVisitados.forEach(lugar => {
                const div = document.createElement("div");
                div.innerHTML = `<span style="color: green;">✓</span> ${lugar}`;
                listadoLugares.appendChild(div);
            });
        }
        
        // Mostrar lugares pendientes
        if (this.usuarioActual.lugaresPendientes?.length > 0) {
            const tituloPendientes = document.createElement("h3");
            tituloPendientes.textContent = "Lugares Pendientes:";
            listadoLugares.appendChild(tituloPendientes);
            
            this.usuarioActual.lugaresPendientes.forEach(lugar => {
                const div = document.createElement("div");
                div.innerHTML = `<span style="color: red;">✗</span> ${lugar}`;
                listadoLugares.appendChild(div);
            });
        }
    }
}

const sistema = new Sistema();

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    btnInicio.addEventListener("click", () => {
        formInicio.style.display = "block";
        btnsIniciales.style.display = "none";
    });

    btnRegistro.addEventListener("click", () => {
        formRegistro.style.display = "block";
        btnsIniciales.style.display = "none";
    });

    btnRegresar.forEach(boton => {
        boton.addEventListener("click", () => {
            formInicio.style.display = "none";
            formRegistro.style.display = "none";
            btnsIniciales.style.display = "block";
        });
    });

    btnIngRegistro.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value;
        const usuario = document.getElementById("usuario").value;
        const contraseña = document.getElementById("contraseña").value;
        const email = document.getElementById("email").value;
        const celular = document.getElementById("celular").value;

        if (sistema.registrarUsuario(nombre, usuario, contraseña, email, celular)) {
            alert("Usuario registrado con éxito!");
            formRegistro.style.display = "none";
            btnsIniciales.style.display = "block";
        }
    });

    btnIngSesion.addEventListener("click", () => {
        const usuario = inputUsuario.value;
        const contraseña = inputContraseña.value;

        if (sistema.login(usuario, contraseña)) {
            sistema.mostrarMenuPrincipal();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}