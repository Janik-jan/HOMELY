
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Mail, Lock } from "lucide-react";
import Header from "../components/Header";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось зарегистрироваться");
      }

      navigate("/login");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Не удалось подключиться к серверу. Возможно, backend ещё не запущен."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-container">
        <div className="auth-box">
          <div className="auth-icon"><Home size={27} /></div>
          <h1>Создать аккаунт</h1>
          <p className="auth-subtitle">
            Присоединяйтесь к HOMELY и находите место, которое станет домом.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Ваше имя</label>
            <div className="auth-input">
              <User size={19} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Иван Иванов"
                required
              />
            </div>

            <label>Электронная почта</label>
            <div className="auth-input">
              <Mail size={19} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
              />
            </div>

            <label>Пароль</label>
            <div className="auth-input">
              <Lock size={19} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="auth-bottom">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
