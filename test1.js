const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function login() {
  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "secretary@clinique.com", password: "123" }) // ou "momo" selon ton choix
    });

    const data = await res.json();
    console.log("Réponse login:", data);
  } catch (err) {
    console.error("Erreur fetch:", err);
  }
}

login();
