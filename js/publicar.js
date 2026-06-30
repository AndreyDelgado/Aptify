document.addEventListener("DOMContentLoaded", () => {
    const publishForm = document.getElementById("publish-form");
    const authWarning = document.getElementById("auth-warning");
    let idEdicion = null; // Variable para saber si estamos creando o editando

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

            // BLOQUEO DE ENVÍO SI HAY ERRORES MATEMÁTICOS O DE LONGITUD
            const tituloValido = document.getElementById("prop-title").value.trim().length >= 10;
            const precioValido = Number(document.getElementById("prop-price").value) >= 50000;
            const metrosValido = Number(document.getElementById("prop-metros").value) >= 10;
            const cantonValido = document.getElementById("prop-canton").value.trim().length >= 3;
            const roomsValido = Number(document.getElementById("prop-rooms").value) >= 1;
            const bathsValido = Number(document.getElementById("prop-baths").value) >= 1;
            const depositoValido = Number(document.getElementById("prop-deposito").value) > 0;

            if (!tituloValido || !precioValido || !metrosValido || !cantonValido || !roomsValido || !bathsValido || !depositoValido) {
                alert("Por favor, corrige los campos marcados en rojo antes de publicar.");
                return; 
            }
            
            // Construir el arreglo de etiquetas seleccionadas
            const etiquetasSeleccionadas = [];
            const tagMascotas = document.getElementById("tag-mascotas");
            const tagCochera = document.getElementById("tag-cochera");
            const tagFamilias = document.getElementById("tag-familias");
            const tagEstudiantes = document.getElementById("tag-estudiantes");
            const tagParejas = document.getElementById("tag-parejas");
            const estadoSelect = document.getElementById("prop-estado");
            const estaActiva = estadoSelect ? estadoSelect.value === "true" : true;

            if (tagMascotas && tagMascotas.checked) etiquetasSeleccionadas.push("Mascotas");
            if (tagCochera && tagCochera.checked) etiquetasSeleccionadas.push("Cochera");
            if (tagFamilias && tagFamilias.checked) etiquetasSeleccionadas.push("Familias");
            if (tagEstudiantes && tagEstudiantes.checked) etiquetasSeleccionadas.push("Estudiantes");
            if (tagParejas && tagParejas.checked) etiquetasSeleccionadas.push("Parejas");

            // Recopilar todos los datos estructurados exactamente como los necesita buscar.js
            const nuevaPropiedad = {
                id: idEdicion ? idEdicion : Date.now(), // Si estamos editando, mantenemos el ID original
                nombre: document.getElementById("prop-title").value.trim(),
                precio: Number(document.getElementById("prop-price").value),
                deposito: Number(document.getElementById("prop-deposito").value),
                tipo: document.getElementById("prop-tipo").value,
                provincia: document.getElementById("prop-provincia").value,
                canton: document.getElementById("prop-canton").value.trim(),
                habitaciones: Number(document.getElementById("prop-rooms").value),
                banos: Number(document.getElementById("prop-baths").value),
                metros: Number(document.getElementById("prop-metros").value),
                etiquetas: etiquetasSeleccionadas,
                imagen: document.getElementById("prop-image").value.trim(),
                activa: estaActiva, // Aplicamos el estado seleccionado
                descripcion: document.getElementById("prop-desc").value.trim(),
                propietario: activeUser.nombre,
                correoPropietario: activeUser.correo,
                // La fecha la definimos más abajo dependiendo si es nueva o editada
            };

            // Traer las propiedades publicadas anteriormente (o un arreglo vacío)
            let propiedades = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];
            
            if (idEdicion) {
                // MODO EDICIÓN: Actualizamos la propiedad existente
                const index = propiedades.findIndex(p => p.id === idEdicion);
                if (index !== -1) {
                    nuevaPropiedad.fechaPublicacion = propiedades[index].fechaPublicacion; // Mantiene fecha original
                    propiedades[index] = nuevaPropiedad;
                }
                alert("¡Los cambios se han guardado con éxito!");
            } else {
                // MODO CREACIÓN: Añadimos una nueva
                nuevaPropiedad.fechaPublicacion = new Date().toLocaleDateString();
                propiedades.push(nuevaPropiedad);
                alert("¡Éxito! Tu propiedad ha sido publicada en Aptify.");
            }
            
            // Guardar nuevamente en el almacenamiento
            localStorage.setItem("aptify_propiedades", JSON.stringify(propiedades));

            // Limpiar formulario y reiniciar modo
            publishForm.reset();
            idEdicion = null;
            document.querySelector("#publish-form button[type='submit']").textContent = "Publicar Propiedad";
            
            // Actualizar la lista de abajo para que el usuario vea los cambios inmediatamente
            renderizarMisPropiedades();
            
        });
    }

    // ==========================================
    // 3. LIMPIEZA CONTROLADA (Rúbrica)
    // ==========================================
    const btnLimpiar = document.getElementById("btn-limpiar");
    if (btnLimpiar && publishForm) {
        btnLimpiar.addEventListener("click", () => {
            // Confirmación visual antes de limpiar
            if (confirm("¿Estás seguro de que deseas borrar todos los datos ingresados en el formulario?")) {
                publishForm.reset();
                
                idEdicion = null;
                document.querySelector("#publish-form button[type='submit']").textContent = "Publicar Propiedad";
                
                // Mensaje de éxito al limpiar
                alert("El formulario ha sido limpiado.");
            }
        });
    }

    // ==========================================
    // 4. GESTIÓN Y ELIMINACIÓN DE REGISTROS (Rúbrica)
    // ==========================================
    const gestionSection = document.getElementById("gestion-propiedades");
    const listaMisPropiedades = document.getElementById("lista-mis-propiedades");

    function renderizarMisPropiedades() {
        const activeUser = JSON.parse(localStorage.getItem("aptify_session"));
        if (!activeUser || !gestionSection || !listaMisPropiedades) return;

        // Mostrar la sección si hay sesión
        gestionSection.style.display = "block";

        const propiedades = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];
        
        // Filtrar solo las propiedades que pertenecen a este usuario
        const misPropiedades = propiedades.filter(p => p.correoPropietario === activeUser.correo);

        if (misPropiedades.length === 0) {
            listaMisPropiedades.innerHTML = '<p style="color: var(--color-texto-suave); font-size: 0.9rem;">Aún no has publicado ninguna propiedad.</p>';
            return;
        }

        // Renderizar cada propiedad con sus botones de editar y eliminar
        listaMisPropiedades.innerHTML = misPropiedades.map(prop => `
            <div style="background-color: var(--color-superficie-2); border: 1px solid var(--color-borde); padding: 16px; border-radius: var(--radio-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h4 style="color: var(--color-dorado); margin-bottom: 4px; font-size: 1rem;">
                        ${prop.nombre} 
                        <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: ${prop.activa ? '#3bba6c20' : '#dc262620'}; color: ${prop.activa ? '#3bba6c' : '#fca5a5'}; margin-left: 8px;">
                            ${prop.activa ? 'Disponible' : 'Alquilada'}
                        </span>
                    </h4>
                    <p style="color: var(--color-texto-suave); margin-bottom: 0; font-size: 0.85rem;">
                        ${prop.provincia}, ${prop.canton} — Mensualidad: ₡${prop.precio.toLocaleString("es-CR")}
                    </p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="editarPropiedad(${prop.id})" style="background-color: transparent; border: 1px solid var(--color-dorado); color: var(--color-dorado); padding: 8px 16px; border-radius: var(--radio-sm); cursor: pointer; font-size: 0.85rem; font-family: var(--fuente-cuerpo); transition: 0.2s;">
                        Editar
                    </button>
                    <button onclick="eliminarPropiedad(${prop.id})" style="background-color: transparent; border: 1px solid #dc2626; color: #fca5a5; padding: 8px 16px; border-radius: var(--radio-sm); cursor: pointer; font-size: 0.85rem; font-family: var(--fuente-cuerpo); transition: 0.2s;">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join("");
    }

    // Función global para eliminar desde el HTML
    window.eliminarPropiedad = function(idAEliminar) {
        if (confirm("¿Estás seguro de que deseas eliminar permanentemente esta publicación?")) {
            let propiedades = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];
            
            // Filtrar quitando el ID que queremos eliminar
            propiedades = propiedades.filter(p => p.id !== idAEliminar);
            
            // Guardar el nuevo arreglo en el navegador
            localStorage.setItem("aptify_propiedades", JSON.stringify(propiedades));
            
            // Actualizar la vista inmediatamente
            renderizarMisPropiedades();
            alert("La propiedad ha sido eliminada con éxito.");
        }
    };

    // Agregar la llamada a renderizarMisPropiedades dentro de la verificación de sesión
    // Modificamos la función existente de verificarAcceso para que cargue la lista
    const originalVerificarAcceso = verificarAcceso;
    verificarAcceso = function() {
        originalVerificarAcceso();
        renderizarMisPropiedades();
    };
    
    // Forzamos un renderizado inicial si ya hay sesión
    renderizarMisPropiedades();

    // ==========================================
    // 5. VALIDACIÓN EN TIEMPO REAL (Rúbrica)
    // ==========================================
    
    // Selección de elementos
    const inputTitle = document.getElementById("prop-title");
    const errorTitle = document.getElementById("error-title");

    const inputPrice = document.getElementById("prop-price");
    const errorPrice = document.getElementById("error-price");

    const inputMetros = document.getElementById("prop-metros");
    const errorMetros = document.getElementById("error-metros");

    const inputCanton = document.getElementById("prop-canton");
    const errorCanton = document.getElementById("error-canton");

    const inputRooms = document.getElementById("prop-rooms");
    const errorRooms = document.getElementById("error-rooms");

    const inputBaths = document.getElementById("prop-baths");
    const errorBaths = document.getElementById("error-baths");
    
    const inputDeposito = document.getElementById("prop-deposito");
    const errorDeposito = document.getElementById("error-deposito");

    // Función auxiliar para aplicar estilos de error/éxito
    function aplicarEstiloValidacion(input, errorElement, esInvalido) {
        if (esInvalido) {
            errorElement.style.display = "block";
            input.style.borderColor = "#dc2626"; // Rojo error
            input.style.backgroundColor = "rgba(220, 38, 38, 0.05)";
        } else {
            errorElement.style.display = "none";
            input.style.borderColor = "#3bba6c"; // Verde éxito
            input.style.backgroundColor = "var(--color-superficie-2)";
        }
        
        // Si el campo está vacío, lo regresamos a su estado original
        if (input.value.trim() === "") {
            errorElement.style.display = "none";
            input.style.borderColor = "var(--color-borde)";
            input.style.backgroundColor = "var(--color-superficie-2)";
        }
    }

    // Validar Título (Mínimo 10 caracteres)
    if (inputTitle) {
        inputTitle.addEventListener("input", (e) => {
            const texto = e.target.value.trim();
            const esInvalido = texto.length > 0 && texto.length < 10;
            aplicarEstiloValidacion(e.target, errorTitle, esInvalido);
        });
    }

    // Validar Precio (Mínimo 50,000)
    if (inputPrice) {
        inputPrice.addEventListener("input", (e) => {
            const valor = Number(e.target.value);
            const esInvalido = e.target.value !== "" && valor < 50000;
            aplicarEstiloValidacion(e.target, errorPrice, esInvalido);
        });
    }

    // Validar Metros (Mínimo 10m2)
    if (inputMetros) {
        inputMetros.addEventListener("input", (e) => {
            const valor = Number(e.target.value);
            const esInvalido = e.target.value !== "" && valor < 10;
            aplicarEstiloValidacion(e.target, errorMetros, esInvalido);
        });
    }

    // Validar Cantón (Mínimo 3 caracteres)
    if (inputCanton) {
        inputCanton.addEventListener("input", (e) => {
            const texto = e.target.value.trim();
            const esInvalido = texto.length > 0 && texto.length < 3;
            aplicarEstiloValidacion(e.target, errorCanton, esInvalido);
        });
    }

    // Validar Habitaciones (No puede ser 0 o negativo)
    if (inputRooms) {
        inputRooms.addEventListener("input", (e) => {
            const valor = Number(e.target.value);
            const esInvalido = e.target.value !== "" && valor < 1;
            aplicarEstiloValidacion(e.target, errorRooms, esInvalido);
        });
    }

    // Validar Baños (No puede ser 0 o negativo)
    if (inputBaths) {
        inputBaths.addEventListener("input", (e) => {
            const valor = Number(e.target.value);
            const esInvalido = e.target.value !== "" && valor < 1;
            aplicarEstiloValidacion(e.target, errorBaths, esInvalido);
        });
    }

    if (inputDeposito) {
    inputDeposito.addEventListener("input", (e) => {
        const valor = Number(e.target.value);
        const esInvalido = e.target.value !== "" && valor <= 0;
        aplicarEstiloValidacion(e.target, errorDeposito, esInvalido);
    });
}

    // ==========================================
    // 6. CAMPO AUTOCALCULADO (Depósito Sugerido)
    // ==========================================
    
    // El inputPrice e inputMetros ya los seleccionamos en la sección 5
    const inputTipo = document.getElementById("prop-tipo");
    const calcDeposito = document.getElementById("calc-deposito");

    function calcularDepositoSugerido() {
        const precio = Number(inputPrice.value) || 0;
        const metros = Number(inputMetros.value) || 0;
        const tipo = inputTipo ? inputTipo.value : "";

        if (precio > 0) {
            let multiplicador = 1.0; // Representa el 100% del mes base

            // 1. Condicional por Tipo de Propiedad
            if (tipo === "Estudio") {
                multiplicador -= 0.10; // -10% para estudios
            } else if (tipo === "Casa") {
                multiplicador += 0.15; // +15% para casas
            }

            // 2. Condicional por Tamaño (Más de 200m2 = +10%)
            if (metros >= 200) {
                multiplicador += 0.10; 
            }

            // Calculamos el total y lo redondeamos para que no den decimales feos
            const depositoFinal = Math.round(precio * multiplicador);
            
            calcDeposito.textContent = "₡" + depositoFinal.toLocaleString("es-CR");
        } else {
            // Si no han puesto precio válido, vuelve a 0
            calcDeposito.textContent = "₡0";
        }
    }

    // Escuchamos los eventos en los 3 campos involucrados para que reaccione al instante
    if (inputPrice) inputPrice.addEventListener("input", calcularDepositoSugerido);
    if (inputMetros) inputMetros.addEventListener("input", calcularDepositoSugerido);
    
    // Para el select de "Tipo" usamos 'change' en lugar de 'input'
    if (inputTipo) inputTipo.addEventListener("change", calcularDepositoSugerido);

    // ==========================================
    // 7. FUNCIÓN PARA EDITAR PROPIEDAD (Rúbrica)
    // ==========================================
    window.editarPropiedad = function(id) {
        const propiedades = JSON.parse(localStorage.getItem("aptify_propiedades")) || [];
        const prop = propiedades.find(p => p.id === id);
        if (!prop) return;

        // Llenamos todos los campos con los datos guardados
        document.getElementById("prop-title").value = prop.nombre;
        document.getElementById("prop-price").value = prop.precio;
        if(document.getElementById("prop-deposito")) document.getElementById("prop-deposito").value = prop.deposito || prop.precio;
        document.getElementById("prop-tipo").value = prop.tipo;
        if(document.getElementById("prop-estado")) document.getElementById("prop-estado").value = prop.activa ? "true" : "false";
        document.getElementById("prop-provincia").value = prop.provincia;
        document.getElementById("prop-canton").value = prop.canton;
        document.getElementById("prop-rooms").value = prop.habitaciones;
        document.getElementById("prop-baths").value = prop.banos;
        document.getElementById("prop-metros").value = prop.metros;
        document.getElementById("prop-image").value = prop.imagen;
        document.getElementById("prop-desc").value = prop.descripcion;

        // Llenamos los checkboxes de estilo de vida
        document.getElementById("tag-mascotas").checked = prop.etiquetas.includes("Mascotas");
        document.getElementById("tag-cochera").checked = prop.etiquetas.includes("Cochera");
        document.getElementById("tag-familias").checked = prop.etiquetas.includes("Familias");
        document.getElementById("tag-estudiantes").checked = prop.etiquetas.includes("Estudiantes");
        document.getElementById("tag-parejas").checked = prop.etiquetas.includes("Parejas");

        // Cambiamos el modo a "Edición"
        idEdicion = prop.id;
        
        // Cambiamos el texto del botón
        const btnSubmit = document.querySelector("#publish-form button[type='submit']");
        if (btnSubmit) btnSubmit.textContent = "Guardar Cambios";

        // Llevamos al usuario de vuelta arriba al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});