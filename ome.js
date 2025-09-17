import fetch from 'node-fetch';

const login = async () => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'secretary@clinique.com', password: 'momo' })
  });

  const data = await response.json();
  console.log('Réponse login:', data);
};

login();
