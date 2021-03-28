# Ignite_NodeJS_FinAPI

- Deve ser possível:

[x] => Criar uma conta
[x] => Buscar o extrato bancário do cliente
[x] => Realizar um depósito
[x] => Realizar um saque
[x] => Buscar o extrato bancário do cliente por data
[x] => Atualizar dados da conta do cliente
[x] => Obter dados da conta do cliente
[ ] => Deletar uma conta


- Regras de negócio (Não deve permitir):

[x] => Cadastrar uma conta com CPF existente
[x] => Fazer depósito em uma conta não existente
[x] => Buscar extrato em uma conta não existente
[x] => Fazer saque em uma conta não existente
[ ] => Excluir uma conta não existente
[ ] => Saque quando não há saldo suficiente
[x] => Duas contas com o mesmo número
[ ] => Alterar números de contas, apenas apagá-las, mas é preciso sacar tudo antes


- Melhorias:
[x] => Funcoes saparadas em uma classe
[x] => Regras de negócio separadas em uma outra classe
[x] => Tudo separado em outros arquivos
[ ] => Suporte a várias contas para cada correntista
[ ] => Movimentação, Extrato e Extrato por data devem perguntar a qual conta se referem
