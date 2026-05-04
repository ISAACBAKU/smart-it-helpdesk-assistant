import { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import Sidebar from './components/Sidebar';
import { FaBars, FaTimes } from "react-icons/fa";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // pick the color once from darkMode
const iconColor = darkMode ? "text-white" : "text-zinc-900";


return (
  <div className={`flex h-screen ${darkMode ? 'dark bg-zinc-900' : 'bg-white'}`}>
  <Sidebar
    isOpen={isSidebarOpen}
    toggleSidebar={toggleSidebar}
    darkMode={darkMode}
    setDarkMode={setDarkMode}
  />

  <main className="flex-1 overflow-hidden">
    <ChatBox toggleSidebar={toggleSidebar} darkMode={darkMode} />
  </main>
</div>
);
}

export default App;

