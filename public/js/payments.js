/o
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("paymentForm");
  const patientSelect = document.getElementById("code_patient");
  const tableBody = document.querySelector("#paymentsTable tbody");

  // Charger patients
  async function loadPatients() {
    const res = await fetch("/api/patients");
    const patients = await res.json();
    patientSelect.innerHTML = "";
    patients.forEach(p => {
      const option = document.createElement("option");
      option.value = p.code_patient;
      option.textContent = `${p.nom} ${p.prenom} (${p.code_patient})`;
      patientSelect.appendChild(option);
    });
  }

  // Charger paiements
  async function loadPayments() {
    const res = await fetch("/api/payments");
    const payments = await res.json();
    tableBody.innerHTML = "";
    payments.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nom} ${p.prenom} (${p.code_patient})</td>
        <td>${new Date(p.date_paiement).toLocaleString()}</td>
        <td>${p.montant} CFA</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Soumission formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      code_patient: patientSelect.value,
      montant: document.getElementById("montant").value
    };

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      form.reset();
      await loadPayments();
    } else {
      alert("Erreur lors de l'ajout du paiement");
    }
  });

  // Init
  await loadPatients();
  await loadPayments();
});
