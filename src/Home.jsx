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
          <img src="logo.png" alt="Logotipo do GameLearn" />
          <h1 className="head-home">
            Agora ensinar e aprender ficou mais divertido!
          </h1>        
        </main>

        <section className="section-home">                
          <div>
            <h3 className="h3-home">O que é o GameLearn?</h3>
            <p className="p-home">
              O GameLearn é uma plataforma de aprendizado interativa que transforma o ensino e aprendizado em uma experiência divertida e envolvente. 
              Com jogos educativos, quizzes e atividades dinâmicas, os alunos podem aprender enquanto se divertem.
            </p>  
          </div>

          <div>
            <h3 className="h3-home">Como funciona?</h3>
            <p className="p-home">
              Ao criarem atividades personalizadas, os professores estimulam a criatividade e o engajamento dos alunos. Isso desperta o interesse da turma por meio de uma experiência de aprendizado dinâmica e divertida, que utiliza jogos e quizzes para a prática do conteúdo, enquanto o docente acompanha o progresso e o nível de interesse em tempo real. 
            </p>
          </div>

          <div> 
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
            <h3 className="h3-home">Benefícios do GameLearn</h3>
            <p className="p-home">
              Com o GameLearn, o aprendizado torna-se mais eficaz e interativo. Nossa plataforma foi projetada para potencializar a retenção de conhecimento, transformando o estudo em uma experiência envolvente e prazerosa.
            </p>
          </div>

          <div>
            <h3 className="h3-home">Quem pode usar?</h3>
            <p className="p-home">
              O GameLearn é ideal para alunos de todas as idades e para educadores que buscam inovação. Com uma interface intuitiva e acessível, garantimos que todos possam extrair o máximo do aprendizado baseado em jogos.O GameLearn é ideal para alunos de todas as idades e educadores que buscam inovação. Com uma interface intuitiva e desenhada para ser acessível, entregamos uma experiência descomplicada que democratiza os benefícios da gamificação, garantindo que todos possam extrair o máximo do aprendizado baseado em jogos.
            </p> 
          </div>

          <div>
            <h3 className="h3-home">Como começar?</h3>
            <p className="p-home">
              Pronto para transformar o aprendizado? Inscreva-se no GameLearn! Em poucos minutos, você cria sua conta gratuita e acessa todas as nossas atividades interativas. O acesso é imediato e sem complicações.
            </p>  
          </div>
        </section>      

        <footer className="footer-home" role="contentinfo">
          <p>© 2026 GameLearn. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;