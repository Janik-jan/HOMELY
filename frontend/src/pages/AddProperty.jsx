
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Image,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import Header from "../components/Header";
import "./AddProperty.css";

const availableAmenities = [
  "Р‘Р°Р»РєРѕРЅ РёР»Рё Р»РѕРґР¶РёСЏ",
  "РљРѕРЅРґРёС†РёРѕРЅРµСЂ",
  "РњРµР±РµР»СЊ",
  "РЎРѕРІСЂРµРјРµРЅРЅС‹Р№ СЂРµРјРѕРЅС‚",
  "РџР°РЅРѕСЂР°РјРЅС‹Рµ РѕРєРЅР°",
  "Р—Р°РєСЂС‹С‚С‹Р№ РґРІРѕСЂ",
  "РџР°СЂРєРѕРІРєР°",
  "Р›РёС„С‚",
  "Р”РµС‚СЃРєР°СЏ РїР»РѕС‰Р°РґРєР°",
  "Р СЏРґРѕРј РїР°СЂРє",
  "Р СЏРґРѕРј РјРµС‚СЂРѕ",
];

function AddProperty() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [form, setForm] = useState({
    title: "",
    address: "",
    price: "",
    deal_type: "sale",
    rooms: "1",
    area: "",
    floor: "",
    total_floors: "",
    image: "",
    description: "",
    amenities: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleAmenityChange(amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          rooms: Number(form.rooms),
          area: Number(form.area),
          floor: Number(form.floor),
          total_floors: Number(form.total_floors),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ");
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message || "РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ СЃ СЃРµСЂРІРµСЂРѕРј");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="add-property-page">
        <Header />
        <main className="add-property-container">
          <div className="add-property-message">
            <Building2 size={35} />
            <h1>Р Р°Р·РјРµС‰РµРЅРёРµ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё</h1>
            <p>Р§С‚РѕР±С‹ СЂР°Р·РјРµСЃС‚РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ, РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚.</p>
            <Link to="/login" className="add-property-submit">
              Р’РѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="add-property-page">
      <Header />

      <main className="add-property-container">
        <Link to="/catalog" className="add-property-back">
          <ArrowLeft size={18} /> Р’РµСЂРЅСѓС‚СЊСЃСЏ РІ РєР°С‚Р°Р»РѕРі
        </Link>

        <div className="add-property-heading">
          <span><Building2 size={25} /></span>
          <div>
            <h1>Р Р°Р·РјРµСЃС‚РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ</h1>
            <p>Р Р°СЃСЃРєР°Р¶РёС‚Рµ Рѕ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё, РєРѕС‚РѕСЂСѓСЋ С…РѕС‚РёС‚Рµ РїСЂРѕРґР°С‚СЊ РёР»Рё СЃРґР°С‚СЊ.</p>
          </div>
        </div>

        <form className="add-property-form" onSubmit={handleSubmit}>
          <h2>РћСЃРЅРѕРІРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ</h2>

          <label>
            РќР°Р·РІР°РЅРёРµ РѕР±СЉСЏРІР»РµРЅРёСЏ
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="РќР°РїСЂРёРјРµСЂ, РЎРІРµС‚Р»Р°СЏ РєРІР°СЂС‚РёСЂР° СЃ РІРёРґРѕРј РЅР° РїР°СЂРє"
              required
            />
          </label>

          <label>
            <span><MapPin size={16} /> РђРґСЂРµСЃ</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Р“РѕСЂРѕРґ, СЂР°Р№РѕРЅ, СѓР»РёС†Р°"
              required
            />
          </label>

          <div className="add-property-grid">
            <label>
              РўРёРї СЃРґРµР»РєРё
              <select
                name="deal_type"
                value={form.deal_type}
                onChange={handleChange}
              >
                <option value="sale">РџСЂРѕРґР°Р¶Р°</option>
                <option value="rent">РђСЂРµРЅРґР°</option>
              </select>
            </label>

            <label>
              Р¦РµРЅР° (в‚Ѕ)
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="1"
                placeholder="18500000"
                required
              />
            </label>

            <label>
              РљРѕР»РёС‡РµСЃС‚РІРѕ РєРѕРјРЅР°С‚
              <input
                type="number"
                name="rooms"
                value={form.rooms}
                onChange={handleChange}
                min="1"
                required
              />
            </label>

            <label>
              РџР»РѕС‰Р°РґСЊ (РјВІ)
              <input
                type="number"
                name="area"
                value={form.area}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                placeholder="64.5"
                required
              />
            </label>

            <label>
              Р­С‚Р°Р¶
              <input
                type="number"
                name="floor"
                value={form.floor}
                onChange={handleChange}
                min="1"
                required
              />
            </label>

            <label>
              Р’СЃРµРіРѕ СЌС‚Р°Р¶РµР№
              <input
                type="number"
                name="total_floors"
                value={form.total_floors}
                onChange={handleChange}
                min="1"
                required
              />
            </label>
          </div>

          <h2>РЈРґРѕР±СЃС‚РІР° Рё РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё</h2>

          <p className="add-property-amenities-description">
            Р’С‹Р±РµСЂРёС‚Рµ РІСЃС‘, С‡С‚Рѕ РµСЃС‚СЊ РІ СЌС‚РѕР№ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё РёР»Рё СЂСЏРґРѕРј СЃ РЅРµР№.
          </p>

          <div className="add-property-amenities">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={
                  form.amenities.includes(amenity)
                    ? "add-property-amenity selected"
                    : "add-property-amenity"
                }
              >
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>

          <p className="add-property-amenities-count">
            Р’С‹Р±СЂР°РЅРѕ: {form.amenities.length}
          </p>

          <h2>Р¤РѕС‚РѕРіСЂР°С„РёСЏ Рё РѕРїРёСЃР°РЅРёРµ</h2>

          <label>
            <span><Image size={16} /> РЎСЃС‹Р»РєР° РЅР° С„РѕС‚РѕРіСЂР°С„РёСЋ</span>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              required
            />
          </label>

          {form.image && (
            <div className="add-property-preview">
              <img
                src={form.image}
                alt="РџСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <label>
            РћРїРёСЃР°РЅРёРµ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="РћРїРёС€РёС‚Рµ РєРІР°СЂС‚РёСЂСѓ, РµС‘ РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё, РїСЂРµРёРјСѓС‰РµСЃС‚РІР° Рё РѕРєСЂСѓР¶РµРЅРёРµ..."
              rows="5"
              required
            />
          </label>

          {error && <p className="add-property-error">{error}</p>}

          <button
            type="submit"
            className="add-property-submit"
            disabled={loading}
          >
            <Send size={18} />
            {loading ? "РџСѓР±Р»РёРєР°С†РёСЏ..." : "РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ"}
          </button>

          <p className="add-property-note">
            РџРѕСЃР»Рµ РїСѓР±Р»РёРєР°С†РёРё РѕР±СЉСЏРІР»РµРЅРёРµ РїРѕСЏРІРёС‚СЃСЏ РІ РѕР±С‰РµРј РєР°С‚Р°Р»РѕРіРµ.
          </p>
        </form>
      </main>
    </div>
  );
}

export default AddProperty;

