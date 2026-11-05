
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
      setError("РџР°СЂРѕР»СЊ РґРѕР»Р¶РµРЅ СЃРѕРґРµСЂР¶Р°С‚СЊ РјРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ");
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
        throw new Error(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ");
      }

      navigate("/login");
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
          <h1>РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚</h1>
          <p className="auth-subtitle">
            РџСЂРёСЃРѕРµРґРёРЅСЏР№С‚РµСЃСЊ Рє HOMELY Рё РЅР°С…РѕРґРёС‚Рµ РјРµСЃС‚Рѕ, РєРѕС‚РѕСЂРѕРµ СЃС‚Р°РЅРµС‚ РґРѕРјРѕРј.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Р’Р°С€Рµ РёРјСЏ</label>
            <div className="auth-input">
              <User size={19} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="РРІР°РЅ РРІР°РЅРѕРІ"
                required
              />
            </div>

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
                placeholder="РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ"
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "РЎРѕР·РґР°РЅРёРµ Р°РєРєР°СѓРЅС‚Р°..." : "Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ"}
            </button>
          </form>

          <p className="auth-bottom">
            РЈР¶Рµ РµСЃС‚СЊ Р°РєРєР°СѓРЅС‚? <Link to="/login">Р’РѕР№С‚Рё</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;

