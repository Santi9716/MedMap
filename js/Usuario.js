export class Usuario {
    constructor(nombre, usuario, contraseña, email, celular) {
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.email = email;
        this.celular = celular;
    }

    mostrarMenuPrincipal() {
        console.log("Mostrando menú principal para:", this.nombre);
    }

    cambiarContraseña(nuevaContraseña) {
        this.contraseña = nuevaContraseña;
        console.log("Contraseña cambiada con éxito");
    }

    cerrarSesion() {
        console.log("Sesión cerrada para:", this.usuario);
    }
}