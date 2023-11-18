const pool = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const create = async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Os campos nome, email, e senha são obrigatórios. ' })
  }

  try {
    let { rows: emailsExistentes } = await pool.query('SELECT email FROM usuarios;')
    emailsExistentes = emailsExistentes.map((a) => a.email)

    if (emailsExistentes.includes(email)) {
      return res.status(400).json({ mensagem: 'Este email já está em uso!' })
    }

    const senhaCrypt = await bcrypt.hash(senha, 10)

    const { rows: cadastro } = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *;',
      [nome, email, senhaCrypt]
    )

    const { senha: _, ...usuario } = cadastro[0]

    return res.status(201).json(usuario)
  } catch (error) {
    return res.status(500).json({ mensagem: `Erro do servidor: ${error.message}` })
  }
}

const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(403).json({ mensagem: 'Informe o email e a senha.' })
  }

  try {
    const { rows, rowCount } = await pool.query('SELECT * FROM usuarios WHERE email = $1;', [email])
    const usuario = rows[0]

    if (!rowCount) {
      return res.status(403).send({ mensagem: 'Email incorreto.' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(403).send({ mensagem: 'Senha incorreta' })
    }

    return res.status(200).send({ mensagem: 'Usuário logado.' })
  } catch (error) {
    return res.status(500).send({ mensagem: `Erro interno do servidor: ${error.message}` })
  }
}

module.exports = {
  create,
  login,
}
