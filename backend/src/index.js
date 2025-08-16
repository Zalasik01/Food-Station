const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const loginRouter = require('./routes/login');

const app = express();

app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/login', loginRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando!' });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
