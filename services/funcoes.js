class Funcoes {
   customerExists(customers, cpf) {
      const customerExists = customers.some((customer) => customer.cpf === cpf);

      return customerExists;
   }
}

module.exports = Funcoes;
