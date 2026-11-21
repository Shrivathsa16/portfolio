import { useState } from 'react';
import { ThemeProvider } from './theme';
import Scene from './components/Scene';
import NavBar from './components/NavBar';
import SectionPanel from './components/SectionPanel';
import type { SectionId } from './components/sections';
import './components/ui.css';

function PortfolioApp() {
  const [selected, setSelected] = useState<SectionId | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  const handleSelect = (id: SectionId | null) => {
    setSelected(id);
    if (hintVisible) setHintVisible(false);
  };

  return (
    <>
      <NavBar />
      <Scene selected={selected} onSelect={handleSelect} />
      <SectionPanel section={selected} onClose={() => setSelected(null)} />
      <div className={`hint-bar ${hintVisible ? '' : 'hidden'}`}>
        Drag to orbit · Scroll to zoom · Click a shape to explore
      </div>
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
