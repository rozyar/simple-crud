const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Configuração do banco de dados usando Knex.js
const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'sqluser',
    port: 9000,
    password: 'password',
    database: 'simple_crud',
  },
});

app.use(cors());
app.use(bodyParser.json());

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('*');
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  try {
    const user = req.body;

    // Validar os dados do usuário
    if (!user.email || !user.password || !user.name) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    // Inserir o novo usuário no banco de dados
    await db('users').insert({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar um usuário pelo ID
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar o usuário pelo ID no banco de dados
    const user = await db('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para atualizar um usuário pelo ID
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;

    // Validar os dados do usuário
    if (!user.email || !user.password || !user.name) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    // Atualizar o usuário no banco de dados
    await db('users').where({ id }).update(user);

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para deletar um usuário pelo ID
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Deletar o usuário no banco de dados
    await db('users').where({ id }).delete();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});