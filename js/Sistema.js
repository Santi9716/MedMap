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
        
        // Inicializar recuperación de contraseña si estamos en mapa.html
        if (window.location.pathname.includes('mapa.html')) {
            this.inicializarRecuperacion();
        }
    }
    
    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        return usuariosGuardados ? JSON.parse(usuariosGuardados) : null;
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
    
    inicializarRecuperacion() {
        const olvidoBtn = document.getElementById("olvidoContraseña");
        const modal = document.getElementById("modalRecuperacion");
        const closeBtn = document.querySelector(".cerrar-modal");
        const confirmarBtn = document.getElementById("btnConfirmarRecuperacion");
        
        if (olvidoBtn) {
            olvidoBtn.addEventListener("click", () => {
                modal.style.display = "block";
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
                document.getElementById("mensajeRecuperacion").textContent = "";
            });
        }
        
        if (confirmarBtn) {
            confirmarBtn.addEventListener("click", () => {
                const email = document.getElementById("emailRecuperacion").value;
                const nuevaPass = document.getElementById("nuevaContraseñaRec").value;
                const confirmarPass = document.getElementById("confirmarContraseñaRec").value;
                
                // Buscar usuario por email
                const usuario = this.usuarios.find(u => u.email === email);
                
                if (!usuario) {
                    document.getElementById("mensajeRecuperacion").textContent = "No existe un usuario con ese correo";
                    return;
                }
                
                if (nuevaPass !== confirmarPass) {
                    document.getElementById("mensajeRecuperacion").textContent = "Las contraseñas no coinciden";
                    return;
                }
                
                // Cambiar la contraseña
                usuario.contraseña = nuevaPass;
                this.guardarUsuarios();
                
                document.getElementById("mensajeRecuperacion").textContent = "Contraseña cambiada con éxito!";
                document.getElementById("emailRecuperacion").value = "";
                document.getElementById("nuevaContraseñaRec").value = "";
                document.getElementById("confirmarContraseñaRec").value = "";
                
                setTimeout(() => {
                    modal.style.display = "none";
                    document.getElementById("mensajeRecuperacion").textContent = "";
                }, 2000);
            });
        }
    }
}

// Crear instancia del sistema
const sistema = new Sistema();

// Event Listeners (solo para index.html)
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

        if (!nombre || !usuario || !contraseña || !email || !celular) {
            alert("Por favor complete todos los campos");
            return;
        }

        if (sistema.registrarUsuario(nombre, usuario, contraseña, email, celular)) {
            alert("Usuario registrado con éxito!");
            formRegistro.style.display = "none";
            btnsIniciales.style.display = "block";
            document.getElementById("nombre").value = "";
            document.getElementById("usuario").value = "";
            document.getElementById("contraseña").value = "";
            document.getElementById("email").value = "";
            document.getElementById("celular").value = "";
        }
    });

    btnIngSesion.addEventListener("click", () => {
        const usuario = inputUsuario.value;
        const contraseña = inputContraseña.value;

        if (!usuario || !contraseña) {
            alert("Por favor ingrese usuario y contraseña");
            return;
        }

        if (sistema.login(usuario, contraseña)) {
            sistema.mostrarMenuPrincipal();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}