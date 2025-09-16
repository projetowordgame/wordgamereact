//import { useEffect } from "react";
import Header from "./components/header/header.jsx";
import "./Home.css";
import { useState } from "react";
import "./components/header/header.jsx"; 

const Home = () => {
  
  const [user] = useState(null);
 
  return (
    <>
      <Header />

      {/* Link de pular direto para o conteúdo (acessibilidade teclado) */}
      <a href="#conteudo" className="skip-link">Pular para o conteúdo principal</a>

      <div className="home-container">
        <main id="conteudo" className="container-logo-home" role="main">
          <img src="logo.png" alt="Logotipo do Kids Games" />
          <h1 className="head-home">
            Agora ensinar e aprender ficou mais divertido!
            <span className="span-home" role="img" aria-label="bandeira de chegada">
              🏁
            </span>
          </h1>        
        </main>

        <section className="section-home">                
          <div>
            <h2 className="h2-home">Sobre a plataforma</h2>
            <h3 className="h3-home">O que é o Kids Games?</h3>
            <p className="p-home">
              O Kids Games é uma plataforma de aprendizado interativa que transforma o ensino e aprendizado em uma experiência divertida e envolvente. 
              Com jogos educativos, quizzes e atividades dinâmicas, os alunos podem aprender enquanto se divertem.
            </p>  
          </div>

          <div>
            <h2 className="h2-home">Funcionamento</h2>
            <h3 className="h3-home">Como funciona?</h3>
            <p className="p-home">
              Os professores podem criar atividades personalizadas ativando assim a criatividade e engajamento dos alunos, despertando o interesse dos alunos que têm uma experiência de aprendizado mais dinâmica e divertida, 
              tendo acesso a uma variedade de jogos e quizzes para praticar o que aprenderam enquanto o professor avalia o nível de aprendizado e interesse dos alunos. 
            </p>
          </div>

          <div> 
            <h2 className="h2-home">Principais recursos</h2>
            <h3 className="h3-home">Recursos principais</h3>
            <ul>
              <li className="li-home">Jogos educativos interativos</li>
              <li className="li-home">Quizzes e atividades dinâmicas</li>
              <li className="li-home">Feedback em tempo real</li>
              <li className="li-home">Relatórios de desempenho</li>
              <li className="li-home">Atividades personalizadas</li>
            </ul>
          </div>

          <div>
            <h2 className="h2-home">Benefícios</h2>
            <h3 className="h3-home">Benefícios do Kids Games</h3>
            <p className="p-home">
              Com o Kids Games, os alunos podem aprender de forma mais eficaz e interativa. 
              A plataforma é projetada para ajudar os alunos a reter informações de maneira mais eficiente, tornando o aprendizado uma experiência agradável.
            </p>
          </div>

          <div>
            <h2 className="h2-home">Público-alvo</h2>
            <h3 className="h3-home">Quem pode usar?</h3>
            <p className="p-home">
              O Kids Games é ideal para alunos de todas as idades, professores e educadores. 
              A plataforma é projetada para ser acessível e fácil de usar, permitindo que todos aproveitem os benefícios do aprendizado baseado em jogos.
            </p> 
          </div>

          <div>
            <h2 className="h2-home">Primeiros passos</h2>
            <h3 className="h3-home">Como começar?</h3>
            <p className="p-home">
              Para começar a usar o Kids Games, basta se inscrever na nossa plataforma. 
              Você pode criar uma conta gratuita e começar a explorar nossos jogos e atividades educativas. 
              É fácil e rápido!
            </p>  
          </div>
        </section>      

        <footer className="footer-home" role="contentinfo">
          2025 Kids Games. Todos os direitos reservados.
        </footer>
      </div>
    </>
  );
};

export default Home;
