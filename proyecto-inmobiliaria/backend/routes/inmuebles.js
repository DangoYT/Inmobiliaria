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


// GET /api/inmuebles
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM inmobiliaria');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener los inmuebles:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// GET /api/inmuebles/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM inmobiliaria WHERE id = $1', [id]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Inmueble no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener el inmueble:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// POST /api/inmuebles/nuevo
router.post('/nuevo', async (req, res) => {
    const { nombre, metros_cuadrados, direccion, precio_venta, moneda } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO inmobiliaria (nombre, metros_cuadrados, direccion, precio_venta, moneda) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nombre, metros_cuadrados, direccion, precio_venta, moneda]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear el inmueble:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// PUT /api/inmuebles/editar/:id
router.put('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, metros_cuadrados, direccion, precio_venta, moneda } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('UPDATE inmobiliaria SET nombre = $1, metros_cuadrados = $2, direccion = $3, precio_venta = $4, moneda = $5 WHERE id = $6 RETURNING *', [nombre, metros_cuadrados, direccion, precio_venta, moneda, id]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Inmueble no encontrado');
        }
    } catch (err) {
        console.error('Error al editar el inmueble:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// DELETE /api/inmuebles/eliminar/:id
router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        // Eliminar el inmueble con el ID especificado
        const deleteResult = await client.query('DELETE FROM inmobiliaria WHERE id = $1', [id]);
        // Obtener todos los inmuebles restantes
        const selectResult = await client.query('SELECT * FROM inmobiliaria');
        client.release();
        res.json(selectResult.rows);
    } catch (err) {
        console.error('Error al eliminar el inmueble:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// GET /api/inmuebles/filtro
router.get('/mueble/filtro', async (req, res) => {
    const { metrosCuadrados, precio } = req.query;

    // Construir la consulta SQL dinámica basada en los filtros proporcionados
    let queryString = 'SELECT * FROM inmobiliaria WHERE true';
    const queryParams = [];

    if (metrosCuadrados) {
        queryString += ' AND metros_cuadrados >= $1';
        queryParams.push(metrosCuadrados);
    }

    if (precio) {
        queryString += ' AND precio_venta <= $2';
        queryParams.push(precio);
    }

    try {
        const client = await pool.connect();
        // Ejecutar la consulta en la base de datos
        const result = await client.query(queryString, queryParams);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error al filtrar los inmuebles:', err);
        res.status(500).send('Error interno del servidor');
    }
});


// GET /api/inmuebles/info
router.get('/muebles/info', async (req, res) => {
    try {
        const client = await pool.connect();
        // Contar la cantidad de inmuebles existentes en la base de datos
        const countResult = await client.query('SELECT COUNT(*) FROM inmobiliaria');
        const count = countResult.rows[0].count;
        // Obtener la fecha y hora actual
        const currentDate = new Date();
        // Construir el mensaje de información
        const message = `Cantidad de inmuebles existentes: ${count}. Fecha y hora de la consulta: ${currentDate}`;
        client.release();
        res.send(message);
    } catch (err) {
        console.error('Error al obtener información de inmuebles:', err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;