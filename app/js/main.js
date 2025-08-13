const API_URL = "http://localhost:3000/clients";
const tableClients = document.getElementById("tableClients");
const clientForm = document.getElementById("clientForm");

// load list
async function loadClients() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tableClients.innerHTML = "";
    data.forEach(p => {
        tableClients.innerHTML += `
            <tr>
                <td>${p.id_clients}</td>
                <td>${p.fullname}</td>
                <td>${p.identification}</td>
                <td>${p.direction}</td>
                <td>${p.email}</td>
                <td>${p.telephone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPrestamo(${p.id_clients})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPrestamo(${p.id_clients})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// save / update
prestamoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const clients = {
        id_clients: document.getElementById("id_clients").value,
        fullname: document.getElementById("fullname").value,
        identification: document.getElementById("identification").value,
        direction: document.getElementById("direction").value,
        email: document.getElementById("email").value,
        telephone: document.getElementById("telephone").value,
    };

    const id_clients = document.getElementById("id_clients").value;

    if (id_prestamo) {
        // UPDATE
        await fetch(`${API_URL}/${id_prestamo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prestamo)
        });
    } else {
        // CREATE
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prestamo)
        });
    }

    prestamoForm.reset();
    cargarPrestamos();
});

// Editar
window.editarPrestamo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    document.getElementById("id_prestamo").value = p.id_prestamo;
    document.getElementById("id_usuario").value = p.id_usuario;
    document.getElementById("isbn").value = p.isbn;
    document.getElementById("fecha_prestamo").value = p.fecha_prestamo.split("T")[0];
    document.getElementById("fecha_devolucion").value = p.fecha_devolucion.split("T")[0];
    document.getElementById("estado").value = p.estado;
};

// Eliminar
window.eliminarPrestamo = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este préstamo?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        cargarPrestamos();
    }
};

// Inicializar
cargarPrestamos();