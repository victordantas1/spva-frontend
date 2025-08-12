# SPVA - Frontend

## Descrição do Projeto

Este é o projeto frontend para o **SPVA (Sistema de Processo de Vagas de Emprego)**. Desenvolvido com Angular, ele fornece a interface de usuário para que candidatos possam buscar vagas, se candidatar, e para que administradores possam gerenciar as oportunidades de emprego. A aplicação se comunica com o back-end do SPVA para todas as operações de dados.

## Tecnologias Utilizadas

- **Framework:** Angular
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Estado Reativo:** RxJS
- **Componentes UI:** Flowbite
- **Conteinerização:** Docker, Docker Compose

## Como Executar o Projeto

Existem duas maneiras de executar o projeto: utilizando Docker para uma configuração rápida e isolada, ou localmente para um ambiente de desenvolvimento mais tradicional.

### Modo 1: Executando com Docker (Recomendado)

Este modo orquestra a aplicação em um contêiner Nginx.

**Pré-requisitos:**

- Docker
- Docker Compose

**Passos:**

1.  **Clonar o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd spva-frontend
    ```

2.  **Configurar variáveis de ambiente:**

  - Crie um arquivo `.env` a partir do template fornecido.
    ```bash
    cp .env.template .env
    ```
  - Edite o arquivo `.env` e defina a variável `API_URL` para o endereço do seu back-end.
    ```env
    # .env
    API_URL=http://localhost:8000
    ```

3.  **Iniciar o serviço:**

    ```bash
    docker-compose up -d --build
    ```

    Este comando irá construir a imagem Docker e iniciar o contêiner. A aplicação estará acessível em `http://localhost:4200`.

### Modo 2: Executando Localmente (Desenvolvimento)

Este modo é ideal para desenvolver e depurar a aplicação diretamente na sua máquina.

**Pré-requisitos:**

- Node.js (versão 18 ou superior)
- NPM (geralmente instalado com o Node.js)

**Passos:**

1.  **Clonar o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd spva-frontend
    ```

2.  **Instalar as dependências:**

    ```bash
    npm install
    ```

3.  **Configurar variáveis de ambiente:**

  - Crie um arquivo `.env` a partir do template:
    ```bash
    cp .env.template .env
    ```
  - **Edite o arquivo `.env`** e defina a `API_URL` para apontar para o seu back-end em execução.
    ```env
    # .env
    API_URL=http://localhost:8000
    ```

4.  **Iniciar o servidor de desenvolvimento:**

    ```bash
    npm start
    ```

    Este comando iniciará o servidor de desenvolvimento do Angular com *hot-reload*. A aplicação estará acessível em `http://localhost:4200`.

## Build de Produção

Para gerar os arquivos de produção, utilize o comando:

```bash
npm run build
```

Os arquivos otimizados serão gerados no diretório `dist/spva-frontend`.
