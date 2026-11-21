import { ThemeProvider } from './context/ThemeContext.jsx';
import { useLenis } from './hooks/useLenis.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import CustomCursor from './components/CustomCursor.jsx';
import ParticleField from './components/ParticleField.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Projects from './sections/Projects.jsx';
import About from './sections/About.jsx';
import Skills from './sections/Skills.jsx';
import Contact from './sections/Contact.jsx';

function PortfolioApp() {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);

  return (
    <>
      <ParticleField />
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
