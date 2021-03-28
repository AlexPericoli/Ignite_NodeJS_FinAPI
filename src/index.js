const express = require("express");
const Funcoes = require("../services/funcoes");

const { v4: uuidV4 } = require("uuid");

const app = express();
app.use(express.json());

let customers = [];

const funcoes = new Funcoes();

function verificaContaCPF(request, response, next) {
   const { cpf } = request.headers;

   const customer = customers.find((customer) => customer.cpf === cpf);

   if (!customer) {
      return response.status(400).json({ error: "Correntista não encontrado" });
   }

   request.customer = customer;

   return next();
}

function verificaNumerosContas(request, response, next) {
   const { nr_conta } = request.body;
   let contaExiste = false;

   if (customers.length > 0) {
      contaExiste = customers.some((customer) =>
         customer.contas.some((conta) => conta === nr_conta)
      );
   }

   if (contaExiste) {
      return response
         .status(401)
         .json({ error: "Número de conta já existente no nosso database" });
   }

   return next();
}

app.get("/funcionando", (request, response) => {
   return response.status(200).json(customers);
});

app.post("/create", verificaNumerosContas, (request, response) => {
   const { nome, cpf, nr_conta } = request.body;

   const customerExists = funcoes.customerExists(customers, cpf);

   if (customerExists) {
      return response.status(400).json({ error: "CPF já cadastrado" });
   }

   customers.push({
      id: uuidV4(),
      nome,
      cpf,
      contas: [nr_conta],
      saldo: 0,
      statement: [],
   });

   return response.status(201).json(customers);
});

app.post(
   "/add/account",
   verificaContaCPF,
   verificaNumerosContas,
   (request, response) => {
      const { customer } = request;
      const { nr_conta } = request.body;

      customer.contas.push(nr_conta);

      return response.status(201).json(customer);
   }
);

app.post("/update", verificaContaCPF, (request, response) => {
   const { customer } = request;
   const { nome } = request.body;

   customer.nome = nome;

   return response.status(201).json(customer);
});

app.post("/:operacao", verificaContaCPF, (request, response) => {
   const { nr_conta } = request.headers;
   const { operacao } = request.params;
   const { descricao, valor } = request.body;

   const { customer } = request;
   console.log("teste", customer.contas[nr_conta]);

   // Atualiza o saldo
   if (operacao === "deposito") {
      customer.saldo += valor;
   } else {
      // Verifica saldo disponível
      if (customer.contas[nr_conta].saldo < valor) {
         return response.status(403).json({ error: "Operação não permitida" });
      }
      customer.saldo -= valor;
   }

   const operacaoExtrato = {
      conta: nr_conta,
      descricao,
      valor,
      created_at: new Date(),
      tipo: operacao === "deposito" ? "crédito" : "débito",
   };

   customer.statement.push(operacaoExtrato);

   return response.status(201).json(customer);
});

app.get("/statement", verificaContaCPF, (request, response) => {
   const { nr_conta } = request.headers;
   const { customer } = request;

   return response.status(200).json(customer.statement);
});

app.get("/statement/date", verificaContaCPF, (request, response) => {
   const { customer } = request;
   const { date } = request.query;

   const dateFormat = new Date(date + " 00:00");
   console.log(customer.statement.created_at);

   const statement = customer.statement.filter(
      (statement) =>
         statement.created_at.toDateString() ===
         new Date(dateFormat).toDateString()
   );

   return response.status(200).json(statement);
});

app.listen(3333);
