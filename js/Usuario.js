export class Usuario {
    constructor(nombre, usuario, contraseña, email, celular) {
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.email = email;
        this.celular = celular;
    }

    // Métodos comunes a todos los usuarios
    mostrarMenuPrincipal() {
        // Implementación base del menú principal
        console.log("Mostrando menú principal para:", this.nombre);
    }

    recuperarContraseña() {
        // Lógica para recuperar contraseña
        console.log("Solicitud de recuperación de contraseña para:", this.email);
    }

    cambiarContraseña(nuevaContraseña) {
        this.contraseña = nuevaContraseña;
        console.log("Contraseña cambiada con éxito");
    }

    cerrarSesion() {
        console.log("Sesión cerrada para:", this.usuario);
    }
}