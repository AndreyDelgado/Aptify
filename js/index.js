/* =========================
   Renderiza las tarjetas recientes en la página de inicio
   a partir del arreglo de propiedades definido en propiedadesData.js.
   ========================= */

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

/* Construye el HTML de una tarjeta de propiedad */
function crearTarjetaPropiedad(propiedad) {
    /* Construye las etiquetas de características */
    const tagsHTML = propiedad.etiquetas.map(function(etiqueta) {
        const icono = iconosEtiqueta[etiqueta] || "&#127968;";
        return '<span class="tag tag-sm">' + icono + ' ' + etiqueta + '</span>';
    }).join("");

    return (
        '<article class="property-card">' +
            '<figure>' +
                '<img src="' + propiedad.imagen + '" alt="' + propiedad.nombre + '">' +
                '<figcaption>' + propiedad.provincia + ', ' + propiedad.canton + '</figcaption>' +
            '</figure>' +
            '<span class="card-label">' + propiedad.tipo + '</span>' +
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
                    '<a href="#" class="btn-card">Ver más</a>' +
                '</div>' +
            '</div>' +
        '</article>'
    );
}

/* Renderiza las primeras 4 propiedades activas en el grid del index */
function renderizarPropiedadesRecientes() {
    const contenedor = document.getElementById("contenedorRecientes");

    /* Filtra solo las activas y toma las primeras 4 */
    const recientes = propiedades.filter(function(p) {
        return p.activa;
    }).slice(0, 4);

    if (recientes.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No hay propiedades disponibles por el momento.</p>';
        return;
    }

    /* Inserta cada tarjeta en el contenedor */
    contenedor.innerHTML = recientes.map(crearTarjetaPropiedad).join("");
}

/* Ejecuta el renderizado cuando el DOM esté listo */
document.addEventListener("DOMContentLoaded", function() {
    renderizarPropiedadesRecientes();
});