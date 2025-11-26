const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Define o Schema (estrutura) do Usuário no MongoDB.
 * Inclui validações e um hook 'pre-save' para criptografar a senha.
 */
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O campo nome é obrigatório'], // Requisito (f)
  },
  email: {
    type: String,
    required: [true, 'O campo email é obrigatório'],
    unique: true, // Garante que não teremos dois usuários com mesmo email
    lowercase: true, // Salva tudo em minúscula
    match: [/\S+@\S+\.\S+/, 'Por favor, insira um email válido'], // Requisito (f)
  },
  senha: {
    type: String,
    required: [true, 'O campo senha é obrigatório'],
    select: false, // IMPORTANTE: Impede que a senha venha em queries (GET)
  },
}, {
  /**
   * Timestamps: Adiciona automaticamente os campos `createdAt` e `updatedAt`.
   */
  timestamps: true 
});

/**
 * Middleware (hook) 'pre-save' do Mongoose.
 * Executa ANTES de um documento 'User' ser salvo.
 * Responsável por fazer o hash da senha se ela foi modificada.
 */
userSchema.pre('save', async function (next) {
  // 'this' refere-se ao documento (usuário) que está sendo salvo
  
  // Se a senha não foi modificada (ex: atualização de email), pula o hash
  if (!this.isModified('senha')) {
    return next();
  }

  try {
    // Gera o "salt" (tempero aleatório) para o hash
    const salt = await bcrypt.genSalt(10); // Custo de processamento = 10
    
    // Faz o hash da senha (texto puro) com o salt
    this.senha = await bcrypt.hash(this.senha, salt);
    
    // Continua para a operação de 'save'
    next();
  } catch (error) {
    // Em caso de erro, passa o erro para o Mongoose
    next(error);
  }
});

// Adicione esta função no src/models/User.js
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.senha; // Remove o campo 'senha' do objeto antes de serializar
    return user;
};

module.exports = mongoose.model('User', userSchema);