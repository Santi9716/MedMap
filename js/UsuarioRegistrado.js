import { Usuario } from "./Usuario.js";

export class UsuarioRegistrado extends Usuario {
    constructor(nombre, usuario, contraseña, email, celular) {
        super(nombre, usuario, contraseña, email, celular);
        this.lugaresVisitados = [];
        this.lugaresPendientes = [
            "Plaza Botero", "Museo de Antioquia", "Palacio de la Cultura Rafael Uribe Uribe", 
            "Comuna 13", "Pueblito Paisa", "Museo de Arte Moderno de Medellín", 
            "Museo El Castillo", "Casa de la Memoria", "Cementerio Museo San Pedro", 
            "Parque Arví", "Jardín Botánico de Medellín", "Parque Explora", 
            "Planetario de Medellín", "Parque de los Pies Descalzos", 
            "Parque de los Deseos", "Cerro Nutibara", "Cerro El Volador", 
            "Parque Lineal La Presidenta", "Centro Comercial Santafé", 
            "Tranvía de Ayacucho", "Metrocable", "Iglesia de la Veracruz", 
            "Basílica de Nuestra Señora de la Candelaria", "Teatro Metropolitano", 
            "Teatro Pablo Tobón Uribe"
        ];
        this.fotos = [];
    }

    marcarComoVisitado(nombreLugar) {
        const index = this.lugaresPendientes.indexOf(nombreLugar);
        if (index !== -1) {
            this.lugaresPendientes.splice(index, 1);
            this.lugaresVisitados.push(nombreLugar);
            return true;
        }
        return false;
    }

    agregarLugarPendiente(lugar) {
        if (!this.lugaresPendientes.includes(lugar)) {
            this.lugaresPendientes.push(lugar);
            return true;
        }
        return false;
    }

    subirFoto(foto) {
        this.fotos.push(foto);
    }

    static fromJSON(json) {
        const usuario = new UsuarioRegistrado(
            json.nombre,
            json.usuario,
            json.contraseña,
            json.email,
            json.celular
        );
        usuario.lugaresVisitados = json.lugaresVisitados || [];
        usuario.lugaresPendientes = json.lugaresPendientes || [];
        usuario.fotos = json.fotos || [];
        return usuario;
    }
}