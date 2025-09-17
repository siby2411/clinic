// login.js

const login = async () => {
  try {
    // Utilise fetch natif de Node 20+
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'secretary@clinique.com',
        password: '123'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Connexion réussie !');
      console.log('Token JWT:', result.token);
      console.log('Rôle ID:', result.role);
    } else {
      console.log('Erreur de connexion:', result.message || 'Identifiants invalides.');
    }
  } catch (error) {
    console.error('Erreur fetch:', error);
  }
};

login();
