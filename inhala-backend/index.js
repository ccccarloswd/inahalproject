require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const corsOptions = {
  origin: 'https://ccccarloswd.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Conectamos con Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint para guardar reservas
app.post('/api/reservar', async (req, res) => {
  const { nombre, email, telefono, clase, profesor, fecha, horario } = req.body;
    console.log('Recibida reserva:', req.body);
  try {
    // Comprobamos si ya hay demasiadas reservas para esa clase/hora
    const { count } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('clase', clase)
      .eq('fecha', fecha)
      .eq('horario', horario);

    const capacidad = obtenerCapacidad(clase); // función auxiliar

    if (count >= capacidad) {
      return res.status(400).json({ error: 'No quedan plazas disponibles para esta clase.' });
    }

    const { error } = await supabase.from('reservas').insert({
      nombre,
      email,
      telefono,
      clase,
      profesor,
      fecha,
      horario
    });

    if (error) throw error;

    res.json({ mensaje: 'Reserva registrada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});
//Contraseña basica temporal
// USUARIO: admin
// CONTRASEÑA: inhala2025
app.use('/admin', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === 'Basic ' + Buffer.from('admin:inhala2025').toString('base64')) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin panel"');
    res.status(401).send('Autenticación requerida');
  }
});
//ENDPOINT CON HTML
app.get('/admin', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) throw error;

    let tabla = `<html><head>
      <title>Panel de Reservas</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px 12px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f3f3f3; }
      </style>
    </head><body>
      <h1>Reservas registradas</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>Teléfono</th>
            <th>Clase</th><th>Profesor</th><th>Fecha</th><th>Horario</th>
          </tr>
        </thead>
        <tbody>`;

    for (let r of data) {
      tabla += `<tr>
        <td>${r.nombre}</td><td>${r.email}</td><td>${r.telefono}</td>
        <td>${r.clase}</td><td>${r.profesor}</td><td>${r.fecha}</td><td>${r.horario}</td>
      </tr>`;
    }

    tabla += `</tbody></table></body></html>`;

    res.send(tabla);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar las reservas');
  }
});

// Función auxiliar para devolver la capacidad máxima por clase
function obtenerCapacidad(clase) {
  const capacidades = {
    hatha: 15,
    vinyasa: 12,
    yin: 10,
    pilates: 8,
    suave: 12,
    embarazo: 6,
    meditacion: 20,
    restaurativo: 10
  };
  return capacidades[clase] || 10;
}

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
});
