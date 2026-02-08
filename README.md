# Vue - Template

## Tech Stacks

- [Vite](https://vitejs.dev/)
- [Vue.js](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind](https://tailwindcss.com/docs/installation)
- [VeeValidate](https://vee-validate.logaretm.com/v4/)
- [Tanstack](https://tanstack.com/query/v5/docs/framework/vue/overview)
- [Lucide](https://lucide.dev/icons/)

## Requisitos

- [Node.js](https://nodejs.org/en/download/) na versão 20.11.0

## 🚀 Desenvolvendo

### Instale as dependências

```sh
  npm install
```

### Rode o projeto

```sh
  npm run dev
```

Abra o servidor em: http://localhost:8080

## ✔️ Pre-Commit e Pre-Push Hooks

### 🔒 Sobre os Hooks

Este projeto utiliza hooks de pre-commit e pre-push para garantir a qualidade e a consistência do código. Antes de cada commit/push, o código passa por um processo de formatação e verificação de lint. Isso ajuda a manter um padrão de código e reduzir a possibilidade de erros.

### ⚙️ Fluxo de Trabalho

Antes de realizar um commit ou um push, é importante executar os seguintes comandos para garantir que seu código esteja de acordo com as diretrizes do projeto:

```sh
  npm run format
```

```sh
  npm run lint:fix
```

### Sobre API MOCK

Para utilizar a feramenta de mock precisamos de dois passos
1 - Ativar no .env a variavel responsavel por adicionar ao setup do app o serviceworker do MSW

```sh
VITE_ENABLE_MOCK_SERVER=true
```

2 - Gerar o arquivo mockServiceWorker.js na pasta publica com o comando abaixo

```sh
npx msw init public
```

Após esses dois passos ao rodar a aplicação as requests declaradas em handlers.ts serão interceptadas

### Sobre os testes

Para utilizar a feramenta de testes automatizados playwright podemos executar um dos dois comandos abaixo:
Ex. sem ui

```sh
npx playwright test
```

Ex. com ui

```sh
npx playwright test --ui
```

Caso queira gerar o codigo de testes com a ferramenta codegen utilize o comando abaixo e em seguida copie o conteudo do console aberto em um arquivo de testes (nome_do_teste.spec.ts) na pasta playwright.

```sh
npx playwright codegen
```

## 🌐 Links úteis

- [Figma]()
