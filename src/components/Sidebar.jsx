import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar, darkMode, setDarkMode }) => {
  
  return (
    <>

      {/* Sidebar */}
      <nav
  className={`sidebar h-screen flex flex-col shrink-0 transition-all duration-300 ${
    darkMode
      ? 'bg-[#18181b] shadow-[8px_0_30px_rgba(0,0,0,0.35)]'
      : 'bg-white shadow-[8px_0_24px_rgba(0,0,0,0.10)]'
  }`}
  style={{
    width: isOpen ? '320px' : '0px',
    minWidth: isOpen ? '320px' : '0px',
    overflow: 'hidden',
  }}
>

       <div className="flex flex-col h-full" style={{ padding: '20px 24px 32px 24px' }}>

  {/* TOP CONTENT */}
  <div>
        <h2
      className="font-bold text-white tracking-tight"
      style={{ fontSize: '1.75rem', lineHeight: 1.1, marginBottom: '24px' }}
    >
      Menu Items
    </h2>

    {/* future menu items go here */}
  </div>

  {/* BOTTOM (this is the magic) */}
      <div
      className="bottom-section mt-auto flex items-center justify-between gap-4"
      style={{
        paddingTop: '16px',
        paddingBottom: '56px',
        paddingLeft: '14px',
        paddingRight: '14px',
        borderRadius: '16px',
        background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
      }}
    >

      <span className="font-medium text-white" style={{ fontSize: '1.1rem' }}>
  {darkMode ? 'Dark Mode' : 'Light Mode'}
</span>

      <div
        onClick={() => setDarkMode(!darkMode)}
            style={{
            position: 'relative',
            width: '56px',
            height: '32px',
            borderRadius: '999px',
            cursor: 'pointer',
            background: darkMode ? '#3b82f6' : '#9ca3af',
            transition: 'background-color 0.22s ease, box-shadow 0.22s ease',
            boxShadow: darkMode
              ? '0 0 6px rgba(59, 130, 246, 0.6), 0 0 12px rgba(59, 130, 246, 0.3)'
              : 'none',
    }}
      >
              <div
        style={{
          position: 'absolute',
          left: darkMode ? '26px' : '4px',
          width: '24px',
          height: '24px',
          borderRadius: '999px',
          background: '#ffffff',
          transition: 'left 0.22s ease',
          top: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {darkMode ? (
          <FaMoon size={12} color="#1e293b" />
        ) : (
          <FaSun size={12} color="#f59e0b" />
        )}
      </div>
      </div>

    </div>
  </div> 
      </nav>
    </>
  );
};

export default Sidebar;
