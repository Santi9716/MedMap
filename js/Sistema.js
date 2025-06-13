import { UsuarioRegistrado } from "./UsuarioRegistrado.js";

class Sistema {
    constructor() {
        this.usuarios = this.cargarUsuarios() || [];
        this.lugares = [];
        this.usuarioActual = this.cargarUsuarioActual();

        if (window.location.pathname.includes('mapa.html')) {
            this.inicializarRecuperacion?.();
            this.inicializarInterfazLugares?.();
        }
    }

    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        if (!usuariosGuardados) return [];
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

    actualizarUsuarioActual() {
        // Actualiza el usuario en la lista de usuarios
        const index = this.usuarios.findIndex(u => u.usuario === this.usuarioActual.usuario);
        if (index !== -1) {
            this.usuarios[index] = this.usuarioActual;
            this.guardarUsuarios();
        }
        localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioActual));
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
        alert(`Bienvenido ${this.usuarioActual.nombre}!`);
        window.location.href = "mapa.html";
    }

    // Métodos para recuperación y lugares pueden ir aquí si los usas en mapa.html
    // ...
}

// Todo el código DOM y listeners dentro de DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const sistema = new Sistema();

    // Elementos del DOM
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

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        if (btnInicio) {
            btnInicio.addEventListener("click", () => {
                if (formInicio) formInicio.style.display = "block";
                if (btnsIniciales) btnsIniciales.style.display = "none";
                if (formRegistro) formRegistro.style.display = "none";
                if (inputUsuario) inputUsuario.value = "";
                if (inputContraseña) inputContraseña.value = "";
            });
        }

        if (btnRegistro) {
            btnRegistro.addEventListener("click", () => {
                if (formRegistro) formRegistro.style.display = "block";
                if (btnsIniciales) btnsIniciales.style.display = "none";
                if (formInicio) formInicio.style.display = "none";
                ["nombre", "usuario", "contraseña", "email", "celular"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = "";
                });
            });
        }

        if (btnRegresar && btnRegresar.length) {
            btnRegresar.forEach(boton => {
                boton.addEventListener("click", () => {
                    if (formInicio) formInicio.style.display = "none";
                    if (formRegistro) formRegistro.style.display = "none";
                    if (btnsIniciales) btnsIniciales.style.display = "block";
                });
            });
        }

        if (btnIngRegistro) {
            btnIngRegistro.addEventListener("click", () => {
                const nombre = document.getElementById("nombre")?.value;
                const usuario = document.getElementById("usuario")?.value;
                const contraseña = document.getElementById("contraseña")?.value;
                const email = document.getElementById("email")?.value;
                const celular = document.getElementById("celular")?.value;

                if (sistema.registrarUsuario(nombre, usuario, contraseña, email, celular)) {
                    alert("Usuario registrado con éxito!");
                    if (formRegistro) formRegistro.style.display = "none";
                    if (btnsIniciales) btnsIniciales.style.display = "block";
                }
            });
        }

        if (btnIngSesion) {
            btnIngSesion.addEventListener("click", () => {
                const usuario = inputUsuario?.value;
                const contraseña = inputContraseña?.value;

                if (sistema.login(usuario, contraseña)) {
                    sistema.mostrarMenuPrincipal();
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            });
        }
    }
});