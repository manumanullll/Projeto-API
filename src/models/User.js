const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 1. Esta é a "Planta Baixa" (Schema) do Usuário
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O campo nome é obrigatório'], // Requisito (f) - Validação
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
  // Timestamps automáticos
}, { timestamps: true }); // Adiciona createdAt e updatedAt

// 2. "Hook" (Gancho) do Mongoose: ANTES de salvar, faça algo
// Isso é um "middleware" do Mongoose.
// Usamos 'function' (e não arrow =>) para termos acesso ao 'this' (o usuário)
userSchema.pre('save', async function (next) {
  // 'this.isModified' verifica se o campo 'senha' foi modificado
  // (não queremos criptografar uma senha já criptografada)
  if (!this.isModified('senha')) {
    return next();
  }

  try {
    // "Salt" é um "tempero" aleatório adicionado à senha antes do hash
    const salt = await bcrypt.genSalt(10); // 10 é o "custo" do hash
    // 'this.senha' é a senha em texto puro
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 3. Exporta o Modelo
module.exports = mongoose.model('User', userSchema);