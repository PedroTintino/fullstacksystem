// Express
const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'usuario',
  password: 'senha',
  database: 'banco_de_dados',
  port: '3307'
});

// Configurar o middleware bodyParser para analisar o corpo das solicitações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Tive que permitir o CORs
// app.use(cors({origin: '*'}));

// Main Page
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Página de credenciais
app.get('/credenciais', (req, res) => {
  res.sendFile(__dirname + '/credenciais.html');
});

// Página de simulação
app.get('/simulador', (req, res) =>{
  res.sendFile(__dirname + '/simulador.html');
});

// Arquivos estáticos
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


// POST DO FORM PARA O DBEAVER
app.post('/cadastro', (req, res) => {
  const { firstName, lastName, email, cpf } = req.body;

  // Inserir os dados do formulário no banco de dados
  const sql = 'INSERT INTO formulario (first_name, last_name, email, cpf) VALUES (?, ?, ?, ?)';
  const values = [firstName, lastName, email, cpf];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error('Erro ao inserir os dados no banco de dados:', error);
      res.status(500).send('Erro ao enviar o formulário');
      return;
    }

    console.log('Formulário enviado com sucesso!');
    res.send('Formulário enviado com sucesso!');
  });
});

// POST DO SIMULADOR PARA O DBEAVER
app.post('/simulacao', (req, res) => {
  const { prazo, valor, resultado } = req.body;

  // Inserir os dados do formulário no banco de dados
  const sql = 'INSERT INTO simulacao (prazo, valor, parcelas) VALUES (?, ?, ?)';
  const values = [prazo, valor, resultado];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error('Erro ao inserir os dados no banco de dados:', error);
      res.status(500).send('Erro ao enviar o formulário');
      return;
    }

    console.log('Formulário enviado com sucesso!');
    res.redirect('/send');
    
  });
});

// Configuração do nodemailer
const transporter = nodemailer.createTransport ({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth:{
    user: 'pietraeternbronz@outlook.com',
    pass: 'pedro910'
  }
})

app.get('/send', (req, res) => {
  // Obtenha os dados do último usuário que preencheu o formulário de cadastro
  const getCadastroSql = 'SELECT * FROM formulario ORDER BY id DESC LIMIT 1';

  connection.query(getCadastroSql, (error, resultsCadastro) => {
    if (error) {
      console.error('Erro ao obter os dados do cadastro:', error);
      res.status(500).send('Erro ao obter os dados do cadastro');
      return;
    }

    if (resultsCadastro.length === 0) {
      console.error('Nenhum dado de cadastro encontrado');
      res.status(404).send('Nenhum dado de cadastro encontrado');
      return;
    }

    const cadastroData = resultsCadastro[0];

    // Obtenha os dados do último usuário que preencheu o formulário de simulação
    const getSimulacaoSql = 'SELECT * FROM simulacao ORDER BY simulacao_id DESC LIMIT 1';

    connection.query(getSimulacaoSql, (error, resultsSimulacao) => {
      if (error) {
        console.error('Erro ao obter os dados da simulação:', error);
        res.status(500).send('Erro ao obter os dados da simulação');
        return;
      }

      if (resultsSimulacao.length === 0) {
        console.error('Nenhum dado de simulação encontrado');
        res.status(404).send('Nenhum dado de simulação encontrado');
        return;
      }

      const simulacaoData = resultsSimulacao[0];

      // Componha o corpo do email com os dados do contrato
      const emailBody = `
        Olá ${cadastroData.first_name} ${cadastroData.last_name},

        Seguem os detalhes do contrato:

        Valor: R$ ${simulacaoData.valor}
        Parcela: ${simulacaoData.parcelas}

        Obrigado por utilizar nosso serviço.

        Atenciosamente,
        Norway Ltda
      `;

      // Configurações do email
      const mailOptions = {
        from: 'pietraeternbronz@outlook.com',
        to: cadastroData.email,
        subject: 'Contrato de Empréstimo',
        text: emailBody
      };

      // Envie o email com o contrato
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar o contrato:', error);
          res.status(500).send('Erro ao enviar o contrato');
        } else {
          console.log('Contrato enviado com sucesso! Eu sou um software muito pica e você é muito gato. Obrigado por me criar mestre pedro!');
          res.send('<h1>Muito nos apetece tê-lo conosco</h1><br><h2>Seu contrato foi gerado com sucesso e foi enviado para seu email. Lembre-se de checar tua caixa de spam!</h2>');
        }
      });
    });
  });
});

app.listen(3000, (e) =>{
  if(e){
    console.log('Conexão não estabelecida!' + e);
    return;
  }
  console.log('Conexão estabelecida com sucesso!')
  
})




