const pool = require('./config/db');

(async () => {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Connexion PostgreSQL OK:', res.rows);
  } catch (err) {
    console.error('Erreur connexion PostgreSQL:', err);
  } finally {
    pool.end();
  }
})();
