# Wallet API

É uma aplicação de backend projetada para gerenciar a entrada e saída de saldo em uma carteira virtual. Combinando tecnologias como Fastify, TypeORM, e PostgreSQL, a API oferece uma solução robusta e segura para as operações financeiras dos usuários.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados em sua máquina:

- Node.js
- PostgreSQL
- Yarn
- Docker
- Docker Compose

## Configuração

Siga estas etapas para configurar e executar o projeto:

1. Clone este repositório para sua máquina local:

   ```bash
   git clone https://github.com/enyasantos/wallet-api.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd wallet-api
   ```

3. Instale as dependências utilizando Yarn:

   ```bash
   yarn install
   ```

4. Copie o arquivo de exemplo `.env.example` e renomeie para `.env`:

   ```bash
   cp .env.example .env
   ```

   Em seguida, atualize as variáveis de ambiente conforme necessário no arquivo `.env`.

5. Inicie o contêiner do Docker usando o Docker Compose:

   ```bash
   docker-compose up -d
   ```

6. Inicie o servidor de desenvolvimento:

   ```bash
   yarn dev
   ```

A API estará disponível em `http://localhost:3000`.

## Comandos Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento com o hot-reloading ativado.
- `yarn start`: Inicia o servidor em modo de produção.
- `docker-compose up -d`: Inicia os contêineres Docker definidos no arquivo `docker-compose.yml`.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
