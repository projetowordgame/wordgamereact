//import { useEffect } from "react";
import Header from "./components/header/header.jsx";
import "./Home.css";
import { useState } from "react";
import "./components/header/header.jsx"; 

const Home = () => {
  
  const [user] = useState(null);
 
  return (
        
    <div className="home-container">
      <Header user={user} />
      <main>
        <h1><span id="montain">&#128507;</span>Agora você pode aprender se divertindo!<span>&#127919;</span></h1>        
      </main>

      <div className="head">
        <h2 className="head">Aprender virou uma grande diversão!</h2>
      </div>

      <section>
                
        <div>
          <h2>O que é o Learn by Playing?</h2>
          <p>O Learn by Playing é uma plataforma de aprendizado interativa que transforma o estudo em uma experiência divertida e envolvente. Com jogos educativos, quizzes e atividades dinâmicas, os alunos podem aprender enquanto se divertem.</p>  
        </div>

        <div>
          <h3>Como funciona?</h3>
          <p>Os professores podem criar atividades personalizadas, enquanto os alunos têm acesso a uma variedade de jogos e quizzes para praticar o que aprenderam. A plataforma também oferece feedback em tempo real para ajudar no processo de aprendizado.</p>
        </div>

        <div> 
          <h3>Recursos principais</h3>
          <ul>
            <li>Jogos educativos interativos</li>
            <li>Quizzes e atividades dinâmicas</li>
            <li>Feedback em tempo real</li>
            <li>Relatórios de desempenho</li>
            <li>Comunidade de aprendizado</li>
          </ul>
        </div>

        <div>
          <h3>Benefícios do Learn by Playing</h3>
          <p>Com o Learn by Playing, os alunos podem aprender de forma mais eficaz e divertida. A plataforma é projetada para ajudar os alunos a reter informações de maneira mais eficiente, tornando o aprendizado uma experiência agradável.</p>
        </div>

        <div>
          <h3>Quem pode usar?</h3>
          <p>O Learn by Playing é ideal para alunos de todas as idades, professores e educadores. A plataforma é projetada para ser acessível e fácil de usar, permitindo que todos aproveitem os benefícios do aprendizado baseado em jogos.</p> 
        </div>

        <div>
          <h3>O que você pode esperar?</h3>
          <p>Com o Learn by Playing, você pode esperar uma experiência de aprendizado envolvente e divertida. Nossa plataforma é projetada para tornar o ensino mais eficaz e acessível, ajudando os alunos a aprender de forma mais eficiente.</p>
        </div>

        <div>
          <h3>Como começar?</h3>
          <p>Para começar a usar o Learn by Playing, basta se inscrever na nossa plataforma. Você pode criar uma conta gratuita e começar a explorar nossos jogos e atividades educativas. É fácil e rápido!</p>  
        </div>

      </section>
      
      <footer>
        <p>2025 Learn by Playing. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
};

export default Home;    