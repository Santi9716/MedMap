class LugarTuristico {
    constructor(nombreLugar, ubicacion, calificacion) {
        this.nombreLugar = nombreLugar;
        this.ubicacion = ubicacion;
        this.calificacion = calificacion;
    }

    calificar(calificacion) {
        this.calificacion = calificacion;
    }
}