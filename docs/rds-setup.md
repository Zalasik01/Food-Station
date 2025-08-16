# Configuração do Banco de Dados RDS AWS

Este documento explica como configurar o Amazon RDS para o projeto Food Station da Autos360.

## 📋 Pré-requisitos

- Conta AWS ativa
- Permissões para criar recursos RDS
- AWS CLI configurado (opcional)

## 🛠️ Configuração do RDS

### 1. Criar Instância RDS

1. Acesse o AWS Console → RDS
2. Clique em "Create database"
3. Escolha "Standard create"
4. Selecione "MySQL" como engine
5. Escolha a versão mais recente (8.0.x)

### 2. Configurações da Instância

```
DB Instance Identifier: food-status-autos360
Master Username: admin
Master Password: [senha segura]
DB Instance Class: db.t3.micro (para desenvolvimento)
Storage Type: General Purpose (SSD)
Allocated Storage: 20 GB
```

### 3. Configurações de Conectividade

```
Virtual Private Cloud (VPC): Default VPC
Subnet Group: default
Public Access: Yes (para desenvolvimento)
VPC Security Group: Create new
Port: 3306
```

### 4. Configurações Adicionais

```
Database Name: food_status_autos360
Backup Retention Period: 7 days
Monitoring: Enable Enhanced Monitoring
Log Exports: Error log, General log, Slow query log
```

## 🔒 Configuração de Segurança

### Security Group

Criar um Security Group com as seguintes regras:

**Inbound Rules:**
```
Type: MySQL/Aurora
Protocol: TCP
Port: 3306
Source: Your IP / Application Server IP
```

**Outbound Rules:**
```
Type: All Traffic
Protocol: All
Port Range: All
Destination: 0.0.0.0/0
```

## 📝 Configuração das Variáveis de Ambiente

Após criar a instância RDS, atualize o arquivo `.env` com as informações:

```env
# Endpoint da instância RDS (encontre no AWS Console)
DB_HOST=food-status-autos360.xyz123.us-east-1.rds.amazonaws.com

# Porta (padrão MySQL)
DB_PORT=3306

# Nome do banco de dados
DB_NAME=food_status_autos360

# Credenciais configuradas na criação
DB_USERNAME=admin
DB_PASSWORD=sua_senha_segura_aqui

# SSL habilitado para segurança
DB_SSL=true
```

## 🧪 Teste de Conexão

Para testar a conexão com o RDS:

```bash
# No diretório do backend
npm run test:db
```

Ou manualmente via MySQL client:

```bash
mysql -h food-status-autos360.xyz123.us-east-1.rds.amazonaws.com -P 3306 -u admin -p food_status_autos360
```

## 📊 Monitoramento

### CloudWatch Metrics

O RDS automaticamente envia métricas para o CloudWatch:

- CPU Utilization
- Database Connections
- Free Storage Space
- Read/Write IOPS
- Read/Write Latency

### Logs

Habilite os seguintes logs no RDS:
- Error Log
- General Log  
- Slow Query Log

## 💰 Custos Estimados

Para uma instância `db.t3.micro` na região `us-east-1`:

- Instância: ~$12/mês
- Storage (20GB): ~$2/mês
- Backup Storage: ~$1/mês
- **Total estimado: ~$15/mês**

## 🔧 Comandos Úteis

### Backup Manual
```bash
aws rds create-db-snapshot \
  --db-instance-identifier food-status-autos360 \
  --db-snapshot-identifier food-status-backup-$(date +%Y%m%d)
```

### Restaurar Backup
```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier food-status-restored \
  --db-snapshot-identifier food-status-backup-20250815
```

## 🚨 Troubleshooting

### Erro de Conexão
1. Verificar Security Group
2. Confirmar endpoint e porta
3. Testar conectividade de rede
4. Verificar credenciais

### Erro de SSL
Se houver problemas com SSL, temporariamente defina:
```env
DB_SSL=false
```

### Performance Lenta
1. Verificar métricas no CloudWatch
2. Considerar upgrade da instância
3. Otimizar queries lentas
4. Adicionar índices necessários

## 📚 Links Úteis

- [Documentação AWS RDS](https://docs.aws.amazon.com/rds/)
- [Guia de Segurança RDS](https://docs.aws.amazon.com/rds/latest/userguide/UsingWithRDS.html)
- [Calculadora de Preços AWS](https://calculator.aws/)

---

**Nota:** Este setup é para ambiente de desenvolvimento. Para produção, considere usar Multi-AZ, instâncias maiores e configurações de segurança mais robustas.
