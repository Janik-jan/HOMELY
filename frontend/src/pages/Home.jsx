import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Heart,
  ArrowUpRight,
  SlidersHorizontal,
  ShieldCheck,
  Trees,
  Sun,
  BedDouble,
  Maximize2,
  Plus,
  Home,
} from "lucide-react";
import "../App.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const properties = [
  {
    id: 1,
    title: "РЎРІРµС‚Р»Р°СЏ РєРІР°СЂС‚РёСЂР° СЃ РІРёРґРѕРј РЅР° РіРѕСЂРѕРґ",
    address: "РњРѕСЃРєРІР°, РџСЂРµСЃРЅРµРЅСЃРєРёР№ СЂР°Р№РѕРЅ",
    price: 85000,
    period: "РјРµСЃ.",
    rooms: 2,
    area: 64,
    floor: "8 РёР· 16",
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000",
    tags: ["РњРЅРѕРіРѕ СЃРІРµС‚Р°", "РўРёС…РёР№ РґРІРѕСЂ"],
  },
  {
    id: 2,
    title: "РЎРѕРІСЂРµРјРµРЅРЅР°СЏ РєРІР°СЂС‚РёСЂР° СЂСЏРґРѕРј СЃ РїР°СЂРєРѕРј",
    address: "РњРѕСЃРєРІР°, СЂР°Р№РѕРЅ РҐР°РјРѕРІРЅРёРєРё",
    price: 18500000,
    period: "",
    rooms: 3,
    area: 82,
    floor: "5 РёР· 12",
    type: "sale",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000",
    tags: ["Р СЏРґРѕРј РїР°СЂРє", "Р‘Р°Р»РєРѕРЅ"],
  },
  {
    id: 3,
    title: "РЈСЋС‚РЅР°СЏ РєРІР°СЂС‚РёСЂР° РІ СЃРїРѕРєРѕР№РЅРѕРј СЂР°Р№РѕРЅРµ",
    address: "РњРѕСЃРєРІР°, СЂР°Р№РѕРЅ РЎРѕРєРѕР»",
    price: 62000,
    period: "РјРµСЃ.",
    rooms: 1,
    area: 42,
    floor: "3 РёР· 9",
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000",
    tags: ["РўРёС…РёР№ СЂР°Р№РѕРЅ", "РњРµС‚СЂРѕ СЂСЏРґРѕРј"],
  },
  {
    id: 4,
    title: "РџСЂРѕСЃС‚РѕСЂРЅР°СЏ РєРІР°СЂС‚РёСЂР° СЃ Р±РѕР»СЊС€РѕР№ РєСѓС…РЅРµР№",
    address: "РњРѕСЃРєРІР°, СЂР°Р№РѕРЅ РҐРѕСЂРѕС€С‘РІРѕ-РњРЅС‘РІРЅРёРєРё",
    price: 14200000,
    period: "",
    rooms: 2,
    area: 71,
    floor: "11 РёР· 20",
    type: "sale",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000",
    tags: ["Р‘РѕР»СЊС€Р°СЏ РєСѓС…РЅСЏ", "РњРЅРѕРіРѕ СЃРІРµС‚Р°"],
  },
];

function HomePage() {
  const [dealType, setDealType] = useState("rent");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesType = property.type === dealType;
      const text = `${property.title} ${property.address}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [dealType, search]);

  const visibleProperties = showAll
    ? filteredProperties
    : filteredProperties.slice(0, 4);

 async function toggleFavorite(id) {
  if (!isLoggedIn) {
    navigate("/register");
    return;
  }

  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `/api/favorites/${id}`,
      {
        method: favorites.includes(id) ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ.");
      return;
    }

    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  } catch (error) {
    alert("РћС€РёР±РєР° РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє СЃРµСЂРІРµСЂСѓ.");
  }
}

  function handleSearch(event) {
    event.preventDefault();

    document.getElementById("listings")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="app">
      <Header />

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              РџР РћРЎРўР РђРќРЎРўР’Рћ Р”Р›РЇ Р’РђРЁР•Р™ Р–РР—РќР
            </div>

            <h1>
              РќР°Р№РґРёС‚Рµ РЅРµ РїСЂРѕСЃС‚Рѕ
              <br />
              РєРІР°СЂС‚РёСЂСѓ, Р° <span>СЃРІРѕР№ РґРѕРј.</span>
            </h1>

            <p className="hero-description">
              РџРѕРјРѕРіР°РµРј РІС‹Р±СЂР°С‚СЊ Р¶РёР»СЊС‘, РІ РєРѕС‚РѕСЂРѕРј Р±СѓРґРµС‚ РєРѕРјС„РѕСЂС‚РЅРѕ Р¶РёС‚СЊ.
              РЈС‡РёС‚С‹РІР°РµРј РЅРµ С‚РѕР»СЊРєРѕ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РєРІР°СЂС‚РёСЂС‹, РЅРѕ Рё С‚Рѕ,
              С‡С‚Рѕ РЅР°С…РѕРґРёС‚СЃСЏ РІРѕРєСЂСѓРі РЅРµС‘.
            </p>

            <div className="search-panel">
              <div className="deal-tabs">
                <button
                  className={dealType === "rent" ? "active" : ""}
                  onClick={() => {
                    setDealType("rent");
                    setShowAll(false);
                  }}
                >
                  РђСЂРµРЅРґР°
                </button>

                <button
                  className={dealType === "sale" ? "active" : ""}
                  onClick={() => {
                    setDealType("sale");
                    setShowAll(false);
                  }}
                >
                  РџРѕРєСѓРїРєР°
                </button>
              </div>

              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrap">
                  <MapPin size={20} />

                  <input
                    type="text"
                    placeholder="Р“РѕСЂРѕРґ, СЂР°Р№РѕРЅ РёР»Рё Р°РґСЂРµСЃ"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <button className="search-button" type="submit">
                  <Search size={19} />
                  РќР°Р№С‚Рё Р¶РёР»СЊС‘
                </button>
              </form>
            </div>

            <div className="hero-note">
              <ShieldCheck size={17} />
              Р‘РѕР»СЊС€Рµ РёРЅС„РѕСЂРјР°С†РёРё вЂ” СѓРІРµСЂРµРЅРЅРµРµ РІС‹Р±РѕСЂ
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400"
              alt="РЎРѕРІСЂРµРјРµРЅРЅС‹Р№ СЃРІРµС‚Р»С‹Р№ РёРЅС‚РµСЂСЊРµСЂ РєРІР°СЂС‚РёСЂС‹"
            />

            <div className="image-caption">
              <span>РњРµСЃС‚Рѕ, РІ РєРѕС‚РѕСЂРѕРј С…РѕС‡РµС‚СЃСЏ Р¶РёС‚СЊ</span>
              <span>HOMELY</span>
            </div>
          </div>
        </section>

        <section className="listings section" id="listings">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                РџРћР”Р‘РћР РљРђ HOMELY
              </div>

              <h2>
                {dealType === "rent"
                  ? "Р–РёР»СЊС‘ РІ Р°СЂРµРЅРґСѓ"
                  : "Р–РёР»СЊС‘ РЅР° РїСЂРѕРґР°Р¶Сѓ"}
              </h2>

              <p>
                РџРѕРґРѕР±СЂР°Р»Рё РІР°СЂРёР°РЅС‚С‹, РЅР° РєРѕС‚РѕСЂС‹Рµ СЃС‚РѕРёС‚ РѕР±СЂР°С‚РёС‚СЊ РІРЅРёРјР°РЅРёРµ.
              </p>
            </div>

            <button
              className="filter-button"
              onClick={() => setSearch("")}
            >
              <SlidersHorizontal size={18} />
              РЎР±СЂРѕСЃРёС‚СЊ РїРѕРёСЃРє
            </button>
          </div>

          <div className="property-grid">
            {visibleProperties.map((property) => (
              <article className="property-card" key={property.id}>
                <div className="property-image">
                  <img src={property.image} alt={property.title} />

                  <button
                    className={`favorite-button ${
                      favorites.includes(property.id) ? "selected" : ""
                    }`}
                    onClick={() => toggleFavorite(property.id)}
                    aria-label="Р”РѕР±Р°РІРёС‚СЊ РІ РёР·Р±СЂР°РЅРЅРѕРµ"
                  >
                    <Heart
                      size={20}
                      fill={
                        favorites.includes(property.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <span className="property-label">
                    {property.type === "rent" ? "РђСЂРµРЅРґР°" : "РџСЂРѕРґР°Р¶Р°"}
                  </span>
                </div>

                <div className="property-info">
                  <div className="property-price">
                    {property.price.toLocaleString("ru-RU")} в‚Ѕ
                    {property.period && (
                      <span> / {property.period}</span>
                    )}
                  </div>

                  <h3>{property.title}</h3>

                  <div className="property-address">
                    <MapPin size={15} />
                    {property.address}
                  </div>

                  <div className="property-details">
                    <span>
                      <BedDouble size={16} />
                      {property.rooms} РєРѕРјРЅ.
                    </span>

                    <span>
                      <Maximize2 size={15} />
                      {property.area} РјВІ
                    </span>

                    <span>{property.floor} СЌС‚Р°Р¶</span>
                  </div>

                  <div className="property-tags">
                    {property.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <button
  className="catalog-details-link"
  onClick={() => navigate(`/property/${property.id}`)}
>
  РџРѕРґСЂРѕР±РЅРµРµ
  <ArrowUpRight size={17} />
</button>
                </div>
              </article>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="empty-state">
              <Search size={30} />
              <h3>РќРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ</h3>
              <p>
                РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РЅР°Р·РІР°РЅРёРµ РіРѕСЂРѕРґР° РёР»Рё СЂР°Р№РѕРЅР°.
              </p>
              <button onClick={() => setSearch("")}>
                РЎР±СЂРѕСЃРёС‚СЊ РїРѕРёСЃРє
              </button>
            </div>
          )}

          {filteredProperties.length > 4 && (
            <button
              className="show-more-button"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "РЎРєСЂС‹С‚СЊ" : "РџРѕРєР°Р·Р°С‚СЊ РµС‰С‘"}
            </button>
          )}
        </section>

        <section className="about section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200"
              alt="РЈСЋС‚РЅР°СЏ РіРѕСЃС‚РёРЅР°СЏ"
            />
          </div>

          <div className="about-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              РќРђРЁРђ РР”Р•РЇ
            </div>

            <h2>
              Р”РѕРј вЂ” СЌС‚Рѕ Р±РѕР»СЊС€Рµ,
              С‡РµРј РїСЂРѕСЃС‚Рѕ СЃС‚РµРЅС‹.
            </h2>

            <p>
              РџСЂРё РІС‹Р±РѕСЂРµ Р¶РёР»СЊСЏ РІР°Р¶РЅР° РЅРµ С‚РѕР»СЊРєРѕ РїР»РѕС‰Р°РґСЊ Рё С†РµРЅР°.
              РРјРµРµС‚ Р·РЅР°С‡РµРЅРёРµ, РЅР°СЃРєРѕР»СЊРєРѕ СЃРІРµС‚Р»Рѕ РІ РєРІР°СЂС‚РёСЂРµ, С‚РёС…Рѕ Р»Рё
              РІРѕ РґРІРѕСЂРµ, РµСЃС‚СЊ Р»Рё СЂСЏРґРѕРј РїР°СЂРє, РјР°РіР°Р·РёРЅС‹ Рё СѓРґРѕР±РЅС‹Р№ С‚СЂР°РЅСЃРїРѕСЂС‚.
            </p>

            <p>
              HOMELY РѕР±СЉРµРґРёРЅСЏРµС‚ РёРЅС„РѕСЂРјР°С†РёСЋ Рѕ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё Рё РѕРєСЂСѓР¶Р°СЋС‰РµР№
              СЃСЂРµРґРµ, С‡С‚РѕР±С‹ РїРѕРјРѕС‡СЊ РїСЂРёРЅСЏС‚СЊ РІР·РІРµС€РµРЅРЅРѕРµ СЂРµС€РµРЅРёРµ.
            </p>

            <a href="#advantages" className="text-link">
              РЈР·РЅР°С‚СЊ Рѕ РїСЂРµРёРјСѓС‰РµСЃС‚РІР°С… <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section className="advantages section" id="advantages">
          <div className="section-heading centered">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              РџРћР§Р•РњРЈ HOMELY
              <span className="eyebrow-line" />
            </div>

            <h2>Р’С‹Р±РёСЂР°Р№С‚Рµ СЃ РїРѕРЅРёРјР°РЅРёРµРј</h2>

            <p>
              РњС‹ РѕР±СЂР°С‰Р°РµРј РІРЅРёРјР°РЅРёРµ РЅР° РґРµС‚Р°Р»Рё, РєРѕС‚РѕСЂС‹Рµ РІР»РёСЏСЋС‚
              РЅР° РїРѕРІСЃРµРґРЅРµРІРЅСѓСЋ Р¶РёР·РЅСЊ.
            </p>
          </div>

          <div className="advantages-grid">
            <div className="advantage-item">
              <div className="advantage-icon">
                <Sun size={25} />
              </div>

              <h3>РљРѕРјС„РѕСЂС‚ РІРЅСѓС‚СЂРё</h3>
              <p>
                РћСЃРІРµС‰С‘РЅРЅРѕСЃС‚СЊ, РїР»Р°РЅРёСЂРѕРІРєР°, Р±Р°Р»РєРѕРЅ, СЌС‚Р°Р¶ Рё СЃРѕСЃС‚РѕСЏРЅРёРµ Р¶РёР»СЊСЏ.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <Trees size={25} />
              </div>

              <h3>РћРєСЂСѓР¶РµРЅРёРµ</h3>
              <p>
                РџР°СЂРєРё, РјР°РіР°Р·РёРЅС‹, РєР°С„Рµ, С€РєРѕР»С‹ Рё РјРµСЃС‚Р° РґР»СЏ РїСЂРѕРіСѓР»РѕРє СЂСЏРґРѕРј.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <MapPin size={25} />
              </div>

              <h3>РЈРґРѕР±РЅРѕРµ СЂР°СЃРїРѕР»РѕР¶РµРЅРёРµ</h3>
              <p>
                РўСЂР°РЅСЃРїРѕСЂС‚, РѕСЃС‚Р°РЅРѕРІРєРё Рё РІР°Р¶РЅС‹Рµ РјРµСЃС‚Р° РїРѕР±Р»РёР·РѕСЃС‚Рё.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <ShieldCheck size={25} />
              </div>

              <h3>Р§РµСЃС‚РЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ</h3>
              <p>
                РџСЂРµРёРјСѓС‰РµСЃС‚РІР° Рё РЅРµРґРѕСЃС‚Р°С‚РєРё, РєРѕС‚РѕСЂС‹Рµ РІР°Р¶РЅРѕ Р·РЅР°С‚СЊ Р·Р°СЂР°РЅРµРµ.
              </p>
            </div>
          </div>
        </section>

        <section className="publish-banner">
          <div>
            <div className="eyebrow">Р’РђРЁР• Р–РР›Р¬РЃ вЂ” Р’ HOMELY</div>

            <h2>РҐРѕС‚РёС‚Рµ СЂР°Р·РјРµСЃС‚РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ?</h2>

            <p>
              Р Р°СЃСЃРєР°Р¶РёС‚Рµ Рѕ СЃРІРѕС‘Рј РѕР±СЉРµРєС‚Рµ Рё РЅР°Р№РґРёС‚Рµ Р·Р°РёРЅС‚РµСЂРµСЃРѕРІР°РЅРЅС‹С… Р»СЋРґРµР№.
            </p>
          </div>

          <button
            onClick={() => navigate(
  isLoggedIn ? "/add-property" : "/login"
)}
            
          >
            <Plus size={19} />
            Р Р°Р·РјРµСЃС‚РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ
          </button>
        </section>
      </main>

      <footer className="footer">
        <a className="logo footer-logo" href="#home">
          <span className="logo-icon">
            <Home size={20} />
          </span>
          HOMELY
        </a>

        <p>
          РњС‹ РїРѕРјРѕРіР°РµРј РІС‹Р±СЂР°С‚СЊ РЅРµ РїСЂРѕСЃС‚Рѕ РєРІР°СЂС‚РёСЂСѓ,
          Р° РјРµСЃС‚Рѕ, РІ РєРѕС‚РѕСЂРѕРј Р·Р°С…РѕС‡РµС‚СЃСЏ Р¶РёС‚СЊ.
        </p>

        <span>В© 2026 HOMELY</span>
      </footer>
    </div>
  );
}

export default HomePage;
