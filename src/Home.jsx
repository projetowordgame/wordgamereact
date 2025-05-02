//import { useEffect } from "react";
import Header from "./components/header/header.jsx";
import "./Home.css";
import { useState } from "react";
import "./components/header/header.jsx"; 

const Home = () => {
  
  const [user] = useState(null);
 
  return (
        
    <div className="home-container">
      <Header user={user}/>
      <main class="container-logo">
        <img src="/images/logoKidsGames.jpeg" alt="Logo"/>
        <h1 className="head">Agora ensinar e aprender ficou mais divertido!<span>&#127919;</span></h1>        
      </main>
      <section>                
        <div>
          <h3>O que é o Kids Games?</h3>
          <p>O Kids Games é uma plataforma de aprendizado interativa que transforma o ensino e aprendizado em uma experiência divertida e envolvente. Com jogos educativos, quizzes e atividades dinâmicas, os alunos podem aprender enquanto se divertem.</p>  
        </div>
        <div>
          <h3>Como funciona?</h3>
          <p>Os professores podem criar atividades personalizadas ativando assim a criatividade e engajamento dos alunos, despertando o interesse dos alunos que têm uma experiência de aprendizado mais dinâmica e divertida, tendo acesso a uma variedade de jogos e quizzes para praticar o que aprenderam enquanto o professor avalia o nível de aprendizado e interesse dos alunos. </p>
        </div>
        <div> 
          <h3>Recursos principais</h3>
          <ul>
            <li>Jogos educativos interativos</li>
            <li>Quizzes e atividades dinâmicas</li>
            <li>Feedback em tempo real</li>
            <li>Relatórios de desempenho</li>
            <li>Atividades personalizadas</li>
          </ul>
        </div>
        <div>
          <h3>Benefícios do Kids Games</h3>
          <p>Com o Kids Games, os alunos podem aprender de forma mais eficaz e interativa. A plataforma é projetada para ajudar os alunos a reter informações de maneira mais eficiente, tornando o aprendizado uma experiência agradável.</p>
        </div>
        <div>
          <h3>Quem pode usar?</h3>
          <p>O Kids Games é ideal para alunos de todas as idades, professores e educadores. A plataforma é projetada para ser acessível e fácil de usar, permitindo que todos aproveitem os benefícios do aprendizado baseado em jogos.</p> 
        </div>
        <div>
          <h3>Como começar?</h3>
          <p>Para começar a usar o Kids Games, basta se inscrever na nossa plataforma. Você pode criar uma conta gratuita e começar a explorar nossos jogos e atividades educativas. É fácil e rápido!</p>  
        </div>
      </section>      
      <footer>
        2025 Kids Games. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;    