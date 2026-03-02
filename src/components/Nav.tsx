import type { MenuItem } from "./Types";

interface NavProps {
  menu: MenuItem[];
  currentChapter: string;
  onSelect: (key: string) => void;
  
}

function Nav({ menu, currentChapter, onSelect }: NavProps) {
 

    return (
    <nav className="top-nav">
      {/* Логотип слева */}
      <div className="logo-wrapper">
       <img src="/assets/logo.png" alt="Логотип музея" className="logo"  onClick={() => onSelect("about")} />
      </div>

      {/* Меню справа, занимает 3/4 ширины */}
      <div className="menu-wrapper">
        <ul className="menu-list">
          {menu.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onSelect(item.key)}
                className={`nav-item ${currentChapter === item.key ? 'active' : ''}`}
                aria-label={item.name}
              >
                <div className="icon-wrapper">
                  <img src={item.icon} alt={item.name} className="nav-icon" />
                </div>
                <span className="nav-label">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;