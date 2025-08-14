const API_URL = "http://localhost:3000/clients";
const tableClients = document.getElementById("tableClients");
const clientForm = document.getElementById("clientForm");

// load clients
async function loadClients() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    data.forEach((c) => {
      tableClients.innerHTML += `
        <tr>
            <td>${c.id_clients}</td>
            <td>${c.fullname}</td>
            <td>${c.user_identification}</td>
            <td>${c.direction || ""}</td>
            <td>${c.email || ""}</td>
            <td>${c.telephone || ""}</td>
            <td>
                <button class="btn btn-success btn-sm btn-edit" data-id="${ c.id_clients}">Editar</button>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${c.id_clients}">Eliminar</button>
            </td>
        </tr>
    `;
    });
  } catch (err) {
    console.error("Error loading clients:", err);
  }
}

// create / update client
clientForm.addEventListener("submit", async () => {

  const id_clients = document.getElementById("id_clients").value;
  const clients = {
    fullname: document.getElementById("fullname").value,
    user_identification: document.getElementById("user_identification").value,
    direction: document.getElementById("direction").value,
    email: document.getElementById("email").value,
    telephone: document.getElementById("telephone").value,
  };

  try {
    let res;
    if (id_clients) {
      // UPDATE
      res = await fetch(`${API_URL}/${id_clients}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clients),
      });
    } else {
      // CREATE
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clients),
      });
    }

    if (!res.ok) throw new Error(await res.text());

    clientForm.reset();
    loadClients();
  } catch (err) {
    console.error("Error saving clients:", err);
    alert("The client could not be saved. Check the console.");
  }
});

// edite / delete
tableClients.addEventListener("click", async (e) => {

  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const c = await res.json();

      document.getElementById("id_clients").value = c.id_clients;
      document.getElementById("fullname").value = c.fullname;
      document.getElementById("user_identification").value =
        c.user_identification;
      document.getElementById("direction").value = c.direction;
      document.getElementById("email").value = c.email;
      document.getElementById("telephone").value = c.telephone;
    } catch (err) {
      console.error("Error editando cliente:", err);
    }
  }

  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;
    if (confirm("¿Are you sure you want to delete this client?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadClients();
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  }
});

// Inicializar
loadClients();
