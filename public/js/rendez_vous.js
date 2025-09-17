// rendez_vous.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rendezVousForm");
    const listContainer = document.getElementById("rendezVousList");

    // Charger tous les rendez-vous
    async function loadRendezVous() {
        const res = await fetch("/api/rendez_vous");
        const rv = await res.json();
        listContainer.innerHTML = "";
        rv.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.nom_patient}</td>
                <td>${r.nom_medecin}</td>
                <td>${r.date}</td>
                <td>${r.heure}</td>
                <td>
                    <button data-id="${r.id}" class="editBtn">Modifier</button>
                    <button data-id="${r.id}" class="deleteBtn">Supprimer</button>
                </td>
            `;
            listContainer.appendChild(tr);
        });
    }

    loadRendezVous();

    // Ajouter / Modifier un rendez-vous
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = {
            patient_id: form.patient_id.value,
            medecin_id: form.medecin_id.value,
            date: form.date.value,
            heure: form.heure.value
        };

        const id = form.dataset.id;
        const url = id ? `/api/rendez_vous/${id}` : "/api/rendez_vous";
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if(res.ok) {
            form.reset();
            form.removeAttribute("data-id");
            loadRendezVous();
        } else {
            alert("Erreur lors de l'enregistrement.");
        }
    });

    // Supprimer / Modifier via delegation
    listContainer.addEventListener("click", async e => {
        if(e.target.classList.contains("deleteBtn")) {
            const id = e.target.dataset.id;
            if(confirm("Confirmer la suppression ?")) {
                await fetch(`/api/rendez_vous/${id}`, { method: "DELETE" });
                loadRendezVous();
            }
        } else if(e.target.classList.contains("editBtn")) {
            const id = e.target.dataset.id;
            const res = await fetch(`/api/rendez_vous/${id}`);
            const r = await res.json();
            form.patient_id.value = r.patient_id;
            form.medecin_id.value = r.medecin_id;
            form.date.value = r.date;
            form.heure.value = r.heure;
            form.dataset.id = id;
        }
    });
});
