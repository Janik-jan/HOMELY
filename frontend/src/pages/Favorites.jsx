import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  BedDouble,
  Maximize2,
  ArrowUpRight,
} from "lucide-react";
import Header from "../components/Header";
import "./Favorites.css";

function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchFavorites() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ РїСЂРѕСЃРјР°С‚СЂРёРІР°С‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ");
        return;
      }

      setProperties(data.properties || []);
    } catch (error) {
      setError("РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРєР»СЋС‡РёС‚СЊСЃСЏ Рє HOMELY API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function removeFavorite(id) {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ");
        return;
      }

      setProperties((current) =>
        current.filter((property) => property.id !== id)
      );
    } catch (error) {
      alert("РћС€РёР±РєР° РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє СЃРµСЂРІРµСЂСѓ");
    }
  }

  return (
    <div className="favorites-page">
      <Header />

      <main className="favorites-main">
        <div className="favorites-intro">
          <div className="catalog-eyebrow">
            <span />
            Р’РђРЁ HOMELY
          </div>

          <h1>РР·Р±СЂР°РЅРЅРѕРµ</h1>

          <p>
            Р—РґРµСЃСЊ СЃРѕР±СЂР°РЅС‹ РєРІР°СЂС‚РёСЂС‹, РєРѕС‚РѕСЂС‹Рµ РІС‹ СЃРѕС…СЂР°РЅРёР»Рё РґР»СЏ РґР°Р»СЊРЅРµР№С€РµРіРѕ
            РїСЂРѕСЃРјРѕС‚СЂР°.
          </p>
        </div>

        {loading ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>Р—Р°РіСЂСѓР¶Р°РµРј РёР·Р±СЂР°РЅРЅРѕРµ...</h3>
          </div>
        ) : error ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>{error}</h3>

            <button onClick={() => navigate("/login")}>
              Р’РѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>РџРѕРєР° РЅРёС‡РµРіРѕ РЅРµС‚</h3>
            <p>
              Р”РѕР±Р°РІР»СЏР№С‚Рµ РїРѕРЅСЂР°РІРёРІС€РёРµСЃСЏ РєРІР°СЂС‚РёСЂС‹ РІ РёР·Р±СЂР°РЅРЅРѕРµ,
              С‡С‚РѕР±С‹ РЅРµ РїРѕС‚РµСЂСЏС‚СЊ РёС….
            </p>

            <Link to="/catalog" className="catalog-details-link">
              РџРµСЂРµР№С‚Рё РІ РєР°С‚Р°Р»РѕРі
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="favorites-heading">
              <h2>РЎРѕС…СЂР°РЅС‘РЅРЅС‹Рµ РѕР±СЉСЏРІР»РµРЅРёСЏ</h2>
              <span>РќР°Р№РґРµРЅРѕ: {properties.length}</span>
            </div>

            <div className="catalog-grid">
              {properties.map((property) => (
                <article className="catalog-card" key={property.id}>
                  <div className="catalog-card-image">
                    <img src={property.image} alt={property.title} />

                    <button
                      className="catalog-favorite selected"
                      onClick={() => removeFavorite(property.id)}
                      aria-label="РЈРґР°Р»РёС‚СЊ РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ"
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>

                    <span className="catalog-property-label">
                      {property.deal_type === "rent" ? "РђСЂРµРЅРґР°" : "РџСЂРѕРґР°Р¶Р°"}
                    </span>
                  </div>

                  <div className="catalog-card-info">
                    <div className="catalog-card-price">
                      {property.price.toLocaleString("ru-RU")} в‚Ѕ
                      {property.deal_type === "rent" && (
                        <span> / РјРµСЃ.</span>
                      )}
                    </div>

                    <h3>{property.title}</h3>

                    <div className="catalog-card-address">
                      <MapPin size={15} />
                      {property.address}
                    </div>

                    <div className="catalog-card-details">
                      <span>
                        <BedDouble size={16} />
                        {property.rooms} РєРѕРјРЅ.
                      </span>

                      <span>
                        <Maximize2 size={15} />
                        {property.area} РјВІ
                      </span>

                      <span>
                        {property.floor} РёР· {property.total_floors} СЌС‚Р°Р¶
                      </span>
                    </div>

                    <Link
                      to={`/property/${property.id}`}
                      className="catalog-details-link"
                    >
                      РџРѕРґСЂРѕР±РЅРµРµ
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Favorites;
