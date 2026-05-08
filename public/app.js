const API_URL = 'http://localhost:4000/api/locales';
const grid = document.getElementById('localesGrid');
const form = document.getElementById('uploadForm');

// 1. Cargar locales al iniciar
async function cargarLocales() {
    try {
        const res = await fetch(API_URL);
        const locales = await res.json();
        
        grid.innerHTML = ''; // Limpiar antes de cargar
        
        locales.forEach(local => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${local.fotoUrl}" alt="${local.nombre}">
                <h3>${local.nombre}</h3>
                <p>📍 ${local.localidad}</p>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Error cargando locales:", err);
    }
}

// 2. Enviar nuevo local
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('localidad', document.getElementById('localidad').value);
    formData.append('foto', document.getElementById('foto').files[0]);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            form.reset();
            cargarLocales(); // Recargar la lista
        } else {
            alert("Error al guardar el local");
        }
    } catch (err) {
        console.error("Error en el envío:", err);
    }
});

// Llamada inicial
cargarLocales();