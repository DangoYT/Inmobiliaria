const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proyecto-inmobiliaria',
    password: '1234',
    port: 5432,
});


router.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *', [nombre, email, password]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).send('Error interno del servidor');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router