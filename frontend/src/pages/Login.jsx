
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Lock } from "lucide-react";
import Header from "../components/Header";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Неверная почта или пароль");
      }

      localStorage.setItem("authToken", data.token);
      navigate("/profile");
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
          <h1>С возвращением!</h1>
          <p className="auth-subtitle">
            Войдите в аккаунт, чтобы продолжить работу с HOMELY.
          </p>

          <form onSubmit={handleSubmit}>
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
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Выполняется вход..." : "Войти"}
            </button>
          </form>

          <p className="auth-bottom">
            Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
