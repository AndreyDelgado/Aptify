document.addEventListener("DOMContentLoaded", () => {
    const publishForm = document.getElementById("publish-form");
    const authWarning = document.getElementById("auth-warning");
    
    // ==========================================
    // 1. VERIFICACIÓN DE SESIÓN EN TIEMPO REAL
    // ==========================================
    function verificarAcceso() {
        const activeUser = JSON.parse(localStorage.getItem("aptify_session"));
        
        if (activeUser) {
            if (publishForm) publishForm.style.display = "block";
            if (authWarning) authWarning.style.display = "none";
        } else {
            if (publishForm) publishForm.style.display = "none";
            if (authWarning) authWarning.style.display = "block";
        }
    }

    // Ejecutar inmediatamente al cargar la página
    verificarAcceso();

    // Conectar con los formularios de sesión para actualizar sin recargar
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const btnLogout = document.getElementById("btn-logout");

    if (loginForm) {
        loginForm.addEventListener("submit", () => {
            setTimeout(verificarAcceso, 100); 
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener("submit", () => {
            setTimeout(verificarAcceso, 100);
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            setTimeout(verificarAcceso, 100);
        });
    }

    // ==========================================
    // 2. LÓGICA DE PUBLICACIÓN DE PROPIEDAD
    // ==========================================
    if (publishForm) {
        publishForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const activeUser = JSON.parse(localStorage.getItem("aptify_session"));
            
            // Seguridad extra por si intentan forzar el envío sin sesión
            if (!activeUser) {
                alert("Debes iniciar sesión para publicar.");
                return; 
            }

            // Construir el arreglo de etiquetas seleccionadas
            const etiquetasSeleccionadas = [];
            const tagMascotas = document.getElementById("tag-mascotas");
            const tagCochera = document.getElementById("tag-cochera");
            const tagFamilias = document.getElementById("tag-familias");
            const tagEstudiantes = document.getElementById("tag-estudiantes");
            const tagParejas = document.getElementById("tag-parejas");

            if (tagMascotas && tagMascotas.checked) etiquetasSeleccionadas.push("Mascotas");
            if (tagCochera && tagCochera.checked) etiquetasSeleccionadas.push("Cochera");
            if (tagFamilias && tagFamilias.checked) etiquetasSeleccionadas.push("Familias");
            if (tagEstudiantes && tagEstudiantes.checked) etiquetasSeleccionadas.push("Estudiantes");
            if (tagParejas && tagParejas.checked) etiquetasSeleccionadas.push("Parejas");

            // Recopilar todos los datos estructurados exactamente como los necesita buscar.js
            const nuevaPropiedad = {
                id: Date.now(),
                nombre: document.getElementById("prop-title").value.trim(),
                precio: Number(document.getElementById("prop-price").value),
                tipo: document.getElementById("prop-tipo").value,
                provincia: document.getElementById("prop-provincia").value,
                canton: document.getElementById("prop-canton").value.trim(),
                habitaciones: Number(document.getElementById("prop-rooms").value),
                banos: Number(document.getElementById("prop-baths").value),
                metros: Number(document.getElementById("prop-metros").value),
                etiquetas: etiquetasSeleccionadas,
                imagen: document.getElementById("prop-image").value.trim(),
                activa: true,
                descripcion: document.getElementById("prop-desc").value.trim(),
                propietario: activeUser.nombre,
                correoPropietario: activeUser.correo,
                fechaPublicacion: new Date().toLocaleDateString()
            };

            // Traer las propiedades publicadas anteriormente (o un arreglo vacío)
            let propiedades = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];
            
            // Añadir la nueva propiedad a la lista local
            propiedades.push(nuevaPropiedad);
            
            // Guardar nuevamente en el almacenamiento del navegador
            localStorage.setItem("aptify_propiedades", JSON.stringify(propiedades));

            // Notificar al usuario, limpiar el formulario y redirigir
            alert("¡Éxito! Tu propiedad ha sido publicada en Aptify.");
            publishForm.reset();
            
            // Redirigimos a la página de buscar para que vea su anuncio
            window.location.href = "buscar.html";
        });
    }
});