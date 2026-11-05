import { Link } from "react-router-dom";
import { Home, Heart, UserRound, Plus } from "lucide-react";
import "./Header.css";

function Header() {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  return (
    <header className="site-header">
      <Link className="site-logo" to="/">
        <span className="site-logo-icon">
          <Home size={21} />
        </span>
        HOMELY
      </Link>

      <nav className="site-navigation">
        <Link to="/catalog">РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ</Link>
        <a href="/#about">Рћ РїСЂРѕРµРєС‚Рµ</a>
        <a href="/#advantages">РџСЂРµРёРјСѓС‰РµСЃС‚РІР°</a>
      </nav>

      <div className="site-actions">
        <Link
          className="header-favorites"
          to={isLoggedIn ? "/favorites" : "/login"}
        >
          <Heart size={18} />
          РР·Р±СЂР°РЅРЅРѕРµ
        </Link>

        <Link
          className="header-favorites"
          to={isLoggedIn ? "/add-property" : "/register"}
        >
          <Plus size={18} />
          Р Р°Р·РјРµСЃС‚РёС‚СЊ
        </Link>

        <Link className="header-login" to={isLoggedIn ? "/profile" : "/login"}>
          <UserRound size={17} />
          {isLoggedIn ? "РљР°Р±РёРЅРµС‚" : "Р’РѕР№С‚Рё"}
        </Link>
      </div>
    </header>
  );
}

export default Header;
