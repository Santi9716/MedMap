import { Usuario } from "./Usuario.js";

export class UsuarioRegistrado extends Usuario {
    constructor(nombre, usuario, contraseña, email, celular) {
        super(nombre, usuario, contraseña, email, celular);
        this.lugaresVisitados = [];
        this.lugaresPendientes = ["Plaza Botero", "Museo de Antioquia", "Palacio de la Cultura Rafael Uribe Uribe", "Comuna 13", "Pueblito Paisa", "Museo de Arte Moderno de Medellín", "Museo El Castillo", "Casa de la Memoria", "Cementerio Museo San Pedro", "Parque Arví", "Jardín Botánico de Medellín", "Parque Explora", "Planetario de Medellín", "Parque de los Pies Descalzos", "Parque de los Deseos", "Cerro Nutibara", "Cerro El Volador", "Parque Lineal La Presidenta", "Centro Comercial Santafé", "Tranvía de Ayacucho", "Metrocable", "Iglesia de la Veracruz", "Basílica de Nuestra Señora de la Candelaria", "Teatro Metropolitano", "Teatro Pablo Tobón Uribe"
];
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