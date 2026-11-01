import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import parse from 'html-react-parser';
import { Analytics } from '@vercel/analytics/react';
import legacyMarkup from './legacy-markup.html?raw';
import './styles.css';

const reactMarkup = legacyMarkup
  .replace('<select id="textFontSize"', '<select id="textFontSize" defaultValue="16"')
  .replace(' selected>', '>')
  .replace(/onclick="([^"]*)"/g, (_, handler) => {
    const match = handler.match(/^(\w+)\((?:'([^']*)')?\)$/);
    if (!match) {
      throw new Error(`Unsupported legacy click handler: ${handler}`);
    }

    const [, action, argument] = match;
    return `data-legacy-action="${action}"${argument ? ` data-legacy-argument="${argument}"` : ''}`;
  });

function App() {
  useEffect(() => {
    const legacyScript = document.createElement('script');
    legacyScript.src = new URL('./legacy.js', import.meta.url).href;
    legacyScript.async = true;
    document.body.appendChild(legacyScript);

    return () => legacyScript.remove();
  }, []);

  function handleLegacyClick(event) {
    const actionElement = event.target.closest('[data-legacy-action]');
    if (!actionElement) return;

    const actionName = actionElement.dataset.legacyAction;
    const action = window[actionName];
    if (typeof action !== 'function') {
      console.error(`Legacy click handler "${actionName}" is unavailable.`);
      return;
    }

    action.call(window, actionElement.dataset.legacyArgument);
  }

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0D0D0B] font-sans text-gray-100 selection:bg-[#F5C527] selection:text-[#17130A]"
      onClick={handleLegacyClick}
    >
      {parse(reactMarkup)}
      <Analytics />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
