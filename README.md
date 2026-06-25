# Aptify - Sistema de Búsqueda y Publicación de Apartamentos

Este repositorio contiene el código del proyecto **Aptify**, desarrollado para el curso **ISW-521 Programación en Ambiente Web I** de la Universidad Técnica Nacional (UTN).

## Descripción del Proyecto

Aptify es una solución web interactiva diseñada para resolver la desorganización en la búsqueda y gestión de alquileres en Costa Rica. El sistema centraliza y optimiza la experiencia permitiendo a los usuarios tanto buscar inmuebles mediante filtros avanzados como publicar sus propias propiedades. 

Toda la aplicación opera de forma dinámica en el lado del cliente (Client-Side) utilizando almacenamiento local para simular la persistencia de una base de datos, garantizando una experiencia fluida y en tiempo real.

## Características Implementadas

* **Autenticación y Sesión en Tiempo Real:** Filtro de seguridad que detecta el estado de la sesión (`aptify_session`). Si el usuario inicia o cierra sesión desde el componente global, la interfaz de publicación se adapta instantáneamente (ocultando o mostrando el formulario) **sin necesidad de recargar la página**.
* **Formulario de Publicación Inteligente:** Permite a los propietarios registrar nuevos inmuebles capturando información crucial (Precio, Tipo, Provincia, Cantón, Habitaciones, Baños, Metros Cuadrados y Características de Estilo de Vida). Incluye validaciones integradas y guías de experiencia de usuario (UX) como la recomendación de dimensiones óptimas para portadas (800x600px, 4:3).
* **Buscador Avanzado y Conexión de Datos ("El Puente"):** Motor de búsqueda en `buscar.html` que unifica las propiedades estáticas base con los nuevos anuncios inyectados dinámicamente desde el formulario a través de `localStorage` (`aptify_propiedades`), previniendo duplicados tras recargas.
* **Filtros Multi-parámetro:** Capacidad de segmentación exacta por tipos de vivienda (Apartamento, Casa, Estudio), ubicación geopolítica, dimensiones físicas y un sistema de arreglos booleanos para etiquetas de *Estilo de Vida* (Mascotas, Cochera, Familias, Estudiantes, Parejas).

## Tecnologías Utilizadas

* **HTML5:** Estructuración semántica de formularios y catálogo de tarjetas.
* **CSS3:** Estilos modernos con paleta oscura y acentos dorados, organizados en módulos limpios y responsivos.
* **JavaScript:** Lógica de manipulación del DOM, temporizadores asíncronos (`setTimeout`), manejo de eventos en tiempo real y serialización JSON para persistencia local.

## Estructura de Archivos Actualizada

```text
├── index.html          # Página principal y presentación del sistema Aptify.
├── buscar.html         # Catálogo interactivo con filtros en tiempo real.
├── publicar.html       # Formulario estructurado para el registro de nuevos inmuebles.
├── css/
│   ├── base.css        # Variables globales, reset de estilos y tipografías.
│   ├── layout.css      # Estructuras de contenedores, headers, footers y grids.
│   ├── componentes.css # Estilos de botones, inputs, tarjetas y avisos.
│   ├── paginas.css     # Reglas específicas para vistas como el formulario de publicación.
│   └── responsive.css  # Media queries para tablet y móvil.
└── js/
    ├── auth.js         # Lógica para el manejo de sesiones y validación de usuarios.
    ├── index.js        # Renderizado de tarjetas recientes y control del carrusel.
    ├── buscar.js       # Motor de filtrado y renderizado dinámico del catálogo.
    ├── publicar.js     # Captura de datos, validación de UX y puente con localStorage.
    └── propiedadesData.js # Arreglo de propiedades base del sistema.

## Flujo de Datos (Persistencia Local)

1. **Validación:** `publicar.js` escucha de forma asíncrona los formularios de sesión. Al verificar un token válido, expone el formulario.
2. **Captura y Mapeo:** El propietario rellena el formulario. Las etiquetas tipo checkbox se unifican dentro de un arreglo nativo (`etiquetas: [...]`) que coincide exactamente con la matriz de búsqueda.
3. **Almacenamiento:** Se ejecuta una función que extrae el historial del navegador, añade (`push`) el nuevo objeto con un ID único (`Date.now()`) y reescribe la llave `aptify_propiedades`.
4. **Sincronización:** Al navegar a `buscar.html`, el script `buscar.js` ejecuta un puente en la fase de carga del DOM que fusiona la base estática con la memoria local, refrescando instantáneamente el catálogo disponible.

## Integrantes

* Andrey Delgado Jiménez
* Camila Rojas Soto
