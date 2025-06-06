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

import { UsuarioRegistrado } from "./UsuarioRegistrado.js";

class Sistema {
    constructor() {
        this.usuarios = this.cargarUsuarios() || [];
        this.lugares = [];
        this.usuarioActual = null;
    }

    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
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
            return true;
        }
        return false;
    }

    mostrarMenuPrincipal() {
        alert(`Bienvenido ${this.usuarioActual.nombre}!`);
        window.location.href = "mapa.html";
    }
}

// Crear instancia del sistema
const sistema = new Sistema();

// Mostrar formulario de inicio de sesión
if (btnInicio) {
    btnInicio.addEventListener("click", () => {
        formInicio.style.display = "block";
        btnsIniciales.style.display = "none";
        formRegistro.style.display = "none";
        // Limpiar campos
        if (inputUsuario) inputUsuario.value = "";
        if (inputContraseña) inputContraseña.value = "";
    });
}

// Mostrar formulario de registro
if (btnRegistro) {
    btnRegistro.addEventListener("click", () => {
        formRegistro.style.display = "block";
        btnsIniciales.style.display = "none";
        formInicio.style.display = "none";
        // Limpiar campos
        ["nombre", "usuario", "contraseña", "email", "celular"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    });
}

// Botones de regresar
if (btnRegresar) {
    btnRegresar.forEach(boton => {
        boton.addEventListener("click", () => {
            formInicio.style.display = "none";
            formRegistro.style.display = "none";
            btnsIniciales.style.display = "block";
        });
    });
}

// Registrar nuevo usuario
if (btnIngRegistro) {
    btnIngRegistro.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value;
        const usuario = document.getElementById("usuario").value;
        const contraseña = document.getElementById("contraseña").value;
        const email = document.getElementById("email").value;
        const celular = document.getElementById("celular").value;

        if (!nombre || !usuario || !contraseña || !email || !celular) {
            alert("Por favor complete todos los campos");
            return;
        }

        if (sistema.registrarUsuario(nombre, usuario, contraseña, email, celular)) {
            alert("Usuario registrado con éxito!");
            formRegistro.style.display = "none";
            btnsIniciales.style.display = "block";
            // Limpiar formulario
            ["nombre", "usuario", "contraseña", "email", "celular"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });
        }
    });
}


// Iniciar sesión
if (btnIngSesion) {
    btnIngSesion.addEventListener("click", () => {
        const usuario = inputUsuario.value;
        const contraseña = inputContraseña.value;

        if (!usuario || !contraseña) {
            alert("Por favor ingrese usuario y contraseña");
            return;
        }

        if (sistema.login(usuario, contraseña)) {
            // Redirige al map.html al iniciar sesión exitosamente
            window.location.href = "map.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });

}

if (sistema.login(usuario, contraseña)) {
    localStorage.setItem('usuarioLogueado', usuario);
    window.location.href = "map.html";
}