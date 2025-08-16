require('dotenv').config();

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL || 'http://localhost:3001/api'
  },

  // Configurações do banco de dados
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
  },

  // Configurações AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  // Configurações JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configurações de email
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },

  // Configurações de upload
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || '5MB'
  },

  // Configurações de log
  log: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log'
  },

  // Configurações CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },

  // Configurações Redis (opcional)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },

  // Configurações de sessão
  session: {
    secret: process.env.SESSION_SECRET,
    timeout: process.env.SESSION_TIMEOUT || 3600000 // 1 hora
  }
};

// Validação de variáveis obrigatórias
const requiredEnvVars = [
  'DB_HOST',
  'DB_USERNAME', 
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'SESSION_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Certifique-se de que o arquivo .env está configurado corretamente.');
  process.exit(1);
}

module.exports = config;
