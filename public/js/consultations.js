// consultations.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("consultationForm");
    const listContainer = document.getElementById("consultationList");

    // Charger toutes les consultations
    async function loadConsultations() {
        const res = await fetch("/api/consultations");
        const consultations = await res.json();
        listContainer.innerHTML = "";
        consultations.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.id}</td>
                <td>${c.nom_patient}</td>
                <td>${c.nom_medecin}</td>
                <td>${c.date}</td>
                <td>${c.motif}</td>
                <td>
                    <button data-id="${c.id}" class="editBtn">Modifier</button>
                    <button data-id="${c.id}" class="deleteBtn">Supprimer</button>
                </td>
            `;
            listContainer.appendChild(tr);
        });
    }

    loadConsultations();

    // Ajouter ou modifier une consultation
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = {
            patient_id: form.patient_id.value,
            medecin_id: form.medecin_id.value,
            date: form.date.value,
            motif: form.motif.value
        };

        const id = form.dataset.id;
        const url = id ? `/api/consultations/${id}` : "/api/consultations";
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if(res.ok) {
            form.reset();
            form.removeAttribute("data-id");
            loadConsultations();
        } else {
            alert("Erreur lors de l'enregistrement.");
        }
    });

    // Supprimer / Modifier via delegation
    listContainer.addEventListener("click", async e => {
        if(e.target.classList.contains("deleteBtn")) {
            const id = e.target.dataset.id;
            if(confirm("Confirmer la suppression ?")) {
                await fetch(`/api/consultations/${id}`, { method: "DELETE" });
                loadConsultations();
            }
        } else if(e.target.classList.contains("editBtn")) {
            const id = e.target.dataset.id;
            const res = await fetch(`/api/consultations/${id}`);
            const c = await res.json();
            form.patient_id.value = c.patient_id;
            form.medecin_id.value = c.medecin_id;
            form.date.value = c.date;
            form.motif.value = c.motif;
            form.dataset.id = id;
        }
    });
});
