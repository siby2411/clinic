// patients.js

const API_URL = "/api/patients"; // toutes les routes côté serveur commenceront par /api/patients

// 🔹 Charger la liste des patients
async function loadPatients() {
  try {
    const res = await fetch(API_URL);
    const patients = await res.json();

    const tbody = document.getElementById("patientsList");
    tbody.innerHTML = "";

    patients.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.code_patient}</td>
        <td>${p.nom}</td>
        <td>${p.date_naissance || ""}</td>
        <td>${p.profession || ""}</td>
        <td>${p.sexe || ""}</td>
        <td>${p.telephone || ""}</td>
        <td>${p.antecedents || ""}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editPatient(${p.id})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erreur chargement patients:", error);
  }
}

// 🔹 Ajouter ou modifier un patient
document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("patientId").value;
  const patient = {
    nom: document.getElementById("nom").value,
    date_naissance: document.getElementById("date_naissance").value,
    profession: document.getElementById("profession").value,
    sexe: document.getElementById("sexe").value,
    telephone: document.getElementById("telephone").value,
    antecedents: document.getElementById("antecedents").value,
  };

  try {
    let res;
    if (id) {
      // mise à jour
      res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
