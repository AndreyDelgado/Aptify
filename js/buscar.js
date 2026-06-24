/* =========================
   Maneja los filtros y el renderizado dinámico
   de propiedades en la página de Buscar
   ========================= */

/* NUEVO: Recupera las propiedades publicadas por el usuario y las combina con las de propiedadesData.js */
function combinarPropiedadesConLocalStorage() {
    const propiedadesLocales = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];

    propiedadesLocales.forEach(function(propLocal) {
        // Evitamos duplicar la propiedad si el usuario recarga la página varias veces
        const yaExiste = propiedades.some(function(p) {
            return p.id === propLocal.id;
        });

        if (!yaExiste) {
            propiedades.push(propLocal);
        }
    });
}

/* Íconos de etiqueta para cada característica */
const iconosEtiqueta = {
    "Mascotas":     "&#128062;",
    "Cochera":      "&#128663;",
    "Familias":     "&#128106;",
    "Estudiantes":  "&#127891;",
    "Parejas":      "&#128145;"
};

/* Formatea un número como precio en colones con separador de miles */
function formatearPrecio(precio) {
    return "₡" + precio.toLocaleString("es-CR");
}

/* Determina el estado de disponibilidad de la propiedad */
function obtenerEstado(propiedad) {
    if (!propiedad.activa) {
        return { texto: "No disponible", clase: "estado-inactivo" };
    }
    return { texto: "Disponible", clase: "estado-disponible" };
}

/* Construye el HTML de una tarjeta de búsqueda */
function crearTarjetaBusqueda(propiedad) {
    const estado = obtenerEstado(propiedad);

    const tagsHTML = propiedad.etiquetas.map(function(etiqueta) {
        const icono = iconosEtiqueta[etiqueta] || "&#127968;";
        return '<span class="tag tag-sm">' + icono + ' ' + etiqueta + '</span>';
    }).join("");

    return (
        '<article class="property-card' + (!propiedad.activa ? ' card-inactiva' : '') + '">' +
            '<figure>' +
                '<img src="' + propiedad.imagen + '" alt="' + propiedad.nombre + '">' +
                '<figcaption>' + propiedad.provincia + ', ' + propiedad.canton + '</figcaption>' +
            '</figure>' +
            '<span class="card-label">' + propiedad.tipo + '</span>' +
            '<span class="card-estado ' + estado.clase + '">' + estado.texto + '</span>' +
            '<div class="property-card-content">' +
                '<h3>' + propiedad.nombre + '</h3>' +
                '<p class="property-location">&#128205; ' + propiedad.provincia + ', ' + propiedad.canton + '</p>' +
                '<div class="property-features">' +
                    '<span>' + propiedad.habitaciones + ' hab.</span>' +
                    '<span>' + propiedad.banos + ' baño' + (propiedad.banos > 1 ? 's' : '') + '</span>' +
                    '<span>' + propiedad.metros + ' m²</span>' +
                '</div>' +
                '<div class="property-tags">' + tagsHTML + '</div>' +
                '<div class="property-footer">' +
                    '<span class="property-price">' + formatearPrecio(propiedad.precio) + ' <small>/mes</small></span>' +
                    '<a href="#" class="btn-card' + (!propiedad.activa ? ' btn-card-disabled' : '') + '">Ver más</a>' +
                '</div>' +
            '</div>' +
        '</article>'
    );
}

/* Aplica los filtros seleccionados y re-renderiza los resultados */
function aplicarFiltros() {
    /* Lee los valores actuales de cada filtro */
    const filtroProvincia  = document.getElementById("filtroProvincia").value;
    const filtroTipo       = document.getElementById("filtroTipo").value;
    const filtroPrecio     = document.getElementById("filtroPrecio").value;
    const filtroEtiqueta   = document.getElementById("filtroEtiqueta").value;
    const filtroHabitacion = document.getElementById("filtroHabitacion").value;

    /* Filtra el arreglo de propiedades según los criterios */
    const resultado = propiedades.filter(function(p) {
        /* Filtro por provincia */
        if (filtroProvincia && p.provincia !== filtroProvincia) return false;

        /* Filtro por tipo de propiedad */
        if (filtroTipo && p.tipo !== filtroTipo) return false;

        /* Filtro por precio máximo */
        if (filtroPrecio && p.precio > Number(filtroPrecio)) return false;

        /* Filtro por etiqueta de estilo de vida */
        if (filtroEtiqueta && !p.etiquetas.includes(filtroEtiqueta)) return false;

        /* Filtro por mínimo de habitaciones */
        if (filtroHabitacion && p.habitaciones < Number(filtroHabitacion)) return false;

        return true;
    });

    renderizarResultados(resultado);
}

/* Inserta las tarjetas filtradas en el contenedor y actualiza el contador */
function renderizarResultados(lista) {
    const contenedor = document.getElementById("contenedorPropiedades");
    const mensaje    = document.getElementById("mensajePropiedades");

    /* Actualiza el texto del contador de resultados */
    mensaje.textContent = "Mostrando " + lista.length + " propiedad(es).";

    if (lista.length === 0) {
        /* Muestra el estado vacío cuando no hay coincidencias */
        contenedor.innerHTML =
            '<div class="empty-state">' +
                '<h3>Sin resultados</h3>' +
                '<p>Ninguna propiedad coincide con los filtros seleccionados. Intentá con otras opciones.</p>' +
            '</div>';
        return;
    }

    contenedor.innerHTML = lista.map(crearTarjetaBusqueda).join("");
}

/* Limpia todos los filtros y muestra todas las propiedades de nuevo */
function limpiarFiltros() {
    document.getElementById("filtroProvincia").value  = "";
    document.getElementById("filtroTipo").value       = "";
    document.getElementById("filtroPrecio").value     = "";
    document.getElementById("filtroEtiqueta").value   = "";
    document.getElementById("filtroHabitacion").value = "";

    aplicarFiltros();
}

/* Inicializa la página cuando el DOM esté listo */
document.addEventListener("DOMContentLoaded", function() {

    combinarPropiedadesConLocalStorage();
    /* Renderizado inicial con todas las propiedades */
    aplicarFiltros();
    document.getElementById("filtroProvincia").addEventListener("change",  aplicarFiltros);

    /* Asigna el evento de cambio a cada filtro para actualizar en tiempo real */
    document.getElementById("filtroProvincia").addEventListener("change",  aplicarFiltros);
    document.getElementById("filtroTipo").addEventListener("change",       aplicarFiltros);
    document.getElementById("filtroPrecio").addEventListener("change",     aplicarFiltros);
    document.getElementById("filtroEtiqueta").addEventListener("change",   aplicarFiltros);
    document.getElementById("filtroHabitacion").addEventListener("change", aplicarFiltros);

    /* Botón para limpiar todos los filtros */
    document.getElementById("btnLimpiarFiltros").addEventListener("click", limpiarFiltros);
});