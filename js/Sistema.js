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
        return usuariosGuardados ? JSON.parse(usuariosGuardados) : null;
    }

    // Guardar usuarios en LocalStorage
    guardarUsuarios() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }

    // Registrar un nuevo usuario
    registrarUsuario(nombre, usuario, contraseña, email, celular) {
        // Verificar si el usuario ya existe
        const usuarioExistente = this.usuarios.find(u => u.usuario === usuario);
        if (usuarioExistente) {
            alert("El nombre de usuario ya está en uso");
            return false;
        }

        // Crear nuevo usuario
        const nuevoUsuario = new UsuarioRegistrado(nombre, usuario, contraseña, email, celular);
        this.usuarios.push(nuevoUsuario);
        this.guardarUsuarios();
        return true;
    }

    // Iniciar sesión
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

    // Mostrar menú principal (simulado)
    mostrarMenuPrincipal() {
        alert(`Bienvenido ${this.usuarioActual.nombre}!`);
        // Aquí iría la lógica para mostrar el menú real
    }
}

// Crear instancia del sistema
const sistema = new Sistema();

// Event Listeners
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

// Registrar nuevo usuario
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
        document.getElementById("nombre").value = "";
        document.getElementById("usuario").value = "";
        document.getElementById("contraseña").value = "";
        document.getElementById("email").value = "";
        document.getElementById("celular").value = "";
    }
});

// Iniciar sesión
btnIngSesion.addEventListener("click", () => {
    const usuario = inputUsuario.value;
    const contraseña = inputContraseña.value;

    if (!usuario || !contraseña) {
        alert("Por favor ingrese usuario y contraseña");
        return;
    }

    if (sistema.login(usuario, contraseña)) {
        sistema.mostrarMenuPrincipal();
        // Aquí iría la navegación al menú principal
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});