import { Usuario } from "./Usuario.js";

export class UsuarioRegistrado extends Usuario {
    constructor(nombre, usuario, contraseña, email, celular) {
        super(nombre, usuario, contraseña, email, celular);
        this.lugaresVisitados = [];
        this.lugaresPendientes = [];
        this.fotos = [];
    }

    agregarLugarVisitado(lugar) {
        this.lugaresVisitados.push(lugar);
    }

    agregarLugarPendiente(lugar) {
        this.lugaresPendientes.push(lugar);
    }

    subirFoto(foto) {
        this.fotos.push(foto);
    }
}