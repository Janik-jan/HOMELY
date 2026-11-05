
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
        throw new Error(data.error || "РќРµРІРµСЂРЅР°СЏ РїРѕС‡С‚Р° РёР»Рё РїР°СЂРѕР»СЊ");
      }

      localStorage.setItem("authToken", data.token);
      navigate("/profile");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРєР»СЋС‡РёС‚СЊСЃСЏ Рє СЃРµСЂРІРµСЂСѓ. Р’РѕР·РјРѕР¶РЅРѕ, backend РµС‰С‘ РЅРµ Р·Р°РїСѓС‰РµРЅ."
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
          <h1>РЎ РІРѕР·РІСЂР°С‰РµРЅРёРµРј!</h1>
          <p className="auth-subtitle">
            Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ РїСЂРѕРґРѕР»Р¶РёС‚СЊ СЂР°Р±РѕС‚Сѓ СЃ HOMELY.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РїРѕС‡С‚Р°</label>
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

            <label>РџР°СЂРѕР»СЊ</label>
            <div className="auth-input">
              <Lock size={19} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ"
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Р’С‹РїРѕР»РЅСЏРµС‚СЃСЏ РІС…РѕРґ..." : "Р’РѕР№С‚Рё"}
            </button>
          </form>

          <p className="auth-bottom">
            Р•С‰С‘ РЅРµС‚ Р°РєРєР°СѓРЅС‚Р°? <Link to="/register">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;

