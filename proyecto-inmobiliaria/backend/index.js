const express = require('express');
const { Pool } = require('pg');
const inmueblesRouter = require('./routes/inmuebles');

const app = express();
const PORT = 3001;


app.use(express.json());

app.use('/api/inmuebles', inmueblesRouter);

app.use('/api/usuarios', require('./routes/usuarios'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
