## Dependencias - O que Instalar Antes de baixar o projeto?

**1- Baixar o NodeJs e o NPM:**

Baixar no site: https://nodejs.org/pt (Ja vem com o NPM junto)

Apos baixar verifique a versão do Node e do Npm, no Prompt de comando rode:
* node -v

* npm -v


**2- Baixar o projeto backend do wordgame em nodejs**

* Baixar e instalar o backend:
https://github.com/projetowordgame/wordgamenode

* O projeto consome as APIS criadas no backend, sem elas o projeto não salva e nem recupera as informações do banco de dados


Pronto, ja da para seguir para a instalação.


## Instalação do projeto

1- Crie uma pasta onde você deseja baixar o projeto, pode ser o nome "Wordgame frontend React"

2- Dentro da pasta, abra o prompt de comando e rode: git clone https://github.com/projetowordgame/wordgamereact.git

3- Depois, entre na pasta desses arquivos baixados e rode o comando: npm install


--Pronto, seu Frontend React está configurado.---

Para rodar o frontend, entre na pasta do projeto e rode: npm run dev

para sair, use o "Control+c" 

O ambiente Frontend usa a porta 5173, portanto, para acessar a tela inicial é essa url:  

http://localhost:5173/  


## Ferramentas auxiliares para ajudar no desenvolvimento

1- Visual Studio Code: IDE para ajudar a abrir o codigo, modificar e salvar.

2- Postman: ferramenta para testar APIs criadas(opção online ou baixar)


## Mais informações do React + Vite (padrão) para estudo depois:

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
