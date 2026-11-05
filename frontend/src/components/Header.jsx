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
        <Link to="/catalog">Недвижимость</Link>
        <a href="/#about">О проекте</a>
        <a href="/#advantages">Преимущества</a>
      </nav>

      <div className="site-actions">
        <Link
          className="header-favorites"
          to={isLoggedIn ? "/favorites" : "/login"}
        >
          <Heart size={18} />
          Избранное
        </Link>

        <Link
          className="header-favorites"
          to={isLoggedIn ? "/add-property" : "/register"}
        >
          <Plus size={18} />
          Разместить
        </Link>

        <Link className="header-login" to={isLoggedIn ? "/profile" : "/login"}>
          <UserRound size={17} />
          {isLoggedIn ? "Кабинет" : "Войти"}
        </Link>
      </div>
    </header>
  );
}

export default Header;