const pool = require('../config/database')
const md5 = require('md5')
const emailValidator = require('deep-email-validator')

const create = async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Os campos nome, email, e senha são obrigatórios. ' })
  }

  try {
    const { valid } = await emailValidator.validate(email)

    if (!valid) {
      return res.status(400).json({ mensagem: 'Insira um email válido!' })
    }

    let { rows: emailsExistentes } = await pool.query('SELECT email FROM usuarios;')
    emailsExistentes = emailsExistentes.map((a) => a.email)

    if (emailsExistentes.includes(email)) {
      return res.status(400).json({ mensagem: 'Este email já está em uso!' })
    }

    const senhaCrypt = md5(senha, process.env.SALT_KEY)
    console.log(senhaCrypt)

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

    if (usuario.senha != md5(senha, process.env.SALT_KEY)) {
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
