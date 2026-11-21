import { useTheme } from '../theme';
import { profile } from '../content';
import './ui.css';

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-name">{profile.name}</span>
        <span className="navbar-title">{profile.title}</span>
      </div>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark and light mode"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className={`theme-toggle-track ${theme}`}>
          <span className="theme-toggle-thumb">{theme === 'dark' ? '🌙' : '☀'}</span>
        </span>
      </button>
    </header>
  );
}
