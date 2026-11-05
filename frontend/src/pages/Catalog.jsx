
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  BedDouble,
  Maximize2,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import Header from "../components/Header";
import "./Catalog.css";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/properties";
const FAVORITES_URL = "/api/favorites";

function Catalog() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dealType, setDealType] = useState("rent");
  const [search, setSearch] = useState("");
const [rooms, setRooms] = useState("all");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёСЏ");
        }

        const data = await response.json();

        const formattedProperties = data.properties.map((property) => ({
          ...property,
          type: property.deal_type,
          period: property.deal_type === "rent" ? "РјРµСЃ." : "",
          floor: `${property.floor} РёР· ${property.total_floors}`,
          tags:
            property.deal_type === "rent"
              ? ["Р”Р»СЏ Р°СЂРµРЅРґС‹", "РЈСЋС‚РЅРѕРµ Р¶РёР»СЊС‘"]
              : ["Р”Р»СЏ РїРѕРєСѓРїРєРё", "РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ"],
        }));

        setProperties(formattedProperties);
      } catch (err) {
        setError(
          "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРєР»СЋС‡РёС‚СЊСЃСЏ Рє HOMELY API. РџСЂРѕРІРµСЂСЊС‚Рµ, Р·Р°РїСѓС‰РµРЅ Р»Рё СЃРµСЂРІРµСЂ."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);
useEffect(() => {
  async function fetchFavorites() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const response = await fetch(FAVORITES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setFavorites(data.properties.map((property) => property.id));
    } catch (error) {
      console.error("РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РёР·Р±СЂР°РЅРЅРѕРіРѕ:", error);
    }
  }

  fetchFavorites();
}, []);
  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const searchText =
        `${property.title} ${property.address}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesType = property.type === dealType;

      const propertyRooms = Number(property.rooms);
const propertyPrice = Number(property.price);

const matchesRooms =
  rooms === "all" ||
  (rooms === "4+"
    ? propertyRooms >= 4
    : propertyRooms === Number(rooms));

const matchesMinPrice =
  minPrice === "" || propertyPrice >= Number(minPrice);

const matchesMaxPrice =
  maxPrice === "" || propertyPrice <= Number(maxPrice);

return (
  matchesSearch &&
  matchesType &&
  matchesRooms &&
  matchesMinPrice &&
  matchesMaxPrice
);
    });

    if (sort === "cheap") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "expensive") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [properties, dealType, search, rooms, minPrice, maxPrice, sort]);

  async function toggleFavorite(id) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    navigate("/login");
    return;
  }

  const isSelected = favorites.includes(id);

  try {
    const response = await fetch(`${FAVORITES_URL}/${id}`, {
      method: isSelected ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      alert(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ");
      return;
    }

    setFavorites((current) =>
      isSelected
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  } catch (error) {
    alert("РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРєР»СЋС‡РёС‚СЊСЃСЏ Рє СЃРµСЂРІРµСЂСѓ");
  }
}

  function resetFilters() {
  setSearch("");
  setRooms("all");
  setMinPrice("");
  setMaxPrice("");
  setSort("default");
}

  return (
    <div className="catalog-page">
      <Header />

      <main className="catalog-main">
        <div className="catalog-intro">
          <div className="catalog-eyebrow">
            <span />
            РљРђРўРђР›РћР“ HOMELY
          </div>

          <h1>РќР°Р№РґРёС‚Рµ РјРµСЃС‚Рѕ РґР»СЏ Р¶РёР·РЅРё</h1>

          <p>
            РЎСЂР°РІРЅРёРІР°Р№С‚Рµ РЅРµ С‚РѕР»СЊРєРѕ РєРІР°СЂС‚РёСЂС‹, РЅРѕ Рё СѓСЃР»РѕРІРёСЏ,
            РІ РєРѕС‚РѕСЂС‹С… РІР°Рј РїСЂРµРґСЃС‚РѕРёС‚ Р¶РёС‚СЊ.
          </p>
        </div>

        <section className="catalog-search">
          <div className="catalog-deal-tabs">
            <button
              className={dealType === "rent" ? "active" : ""}
              onClick={() => setDealType("rent")}
            >
              РђСЂРµРЅРґР°
            </button>

            <button
              className={dealType === "sale" ? "active" : ""}
              onClick={() => setDealType("sale")}
            >
              РџРѕРєСѓРїРєР°
            </button>
          </div>

          <div className="catalog-search-input">
            <Search size={20} />

            <input
              type="text"
              placeholder="Р’РІРµРґРёС‚Рµ РіРѕСЂРѕРґ, СЂР°Р№РѕРЅ РёР»Рё РЅР°Р·РІР°РЅРёРµ"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <div className="catalog-layout">
          <aside className="catalog-filters">
            <div className="filters-heading">
              <SlidersHorizontal size={19} />
              <h2>Р¤РёР»СЊС‚СЂС‹</h2>
            </div>

            <div className="filter-group">
              <label htmlFor="rooms-filter">
                РљРѕР»РёС‡РµСЃС‚РІРѕ РєРѕРјРЅР°С‚
              </label>

              <select
                id="rooms-filter"
                value={rooms}
                onChange={(event) => setRooms(event.target.value)}
              >
                <option value="all">Р›СЋР±РѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ</option>
<option value="1">1 РєРѕРјРЅР°С‚Р°</option>
<option value="2">2 РєРѕРјРЅР°С‚С‹</option>
<option value="3">3 РєРѕРјРЅР°С‚С‹</option>
<option value="4+">4 Рё Р±РѕР»РµРµ РєРѕРјРЅР°С‚</option>
              </select>
            </div>
<div className="filter-group">
  <label htmlFor="min-price-filter">
    РњРёРЅРёРјР°Р»СЊРЅР°СЏ С†РµРЅР°, в‚Ѕ
  </label>

  <input
    id="min-price-filter"
    type="number"
    min="0"
    placeholder="РћС‚ Р»СЋР±РѕР№ СЃСѓРјРјС‹"
    value={minPrice}
    onChange={(event) => setMinPrice(event.target.value)}
  />
</div>
            <div className="filter-group">
              <label htmlFor="price-filter">
                РњР°РєСЃРёРјР°Р»СЊРЅР°СЏ С†РµРЅР°, в‚Ѕ
              </label>

              <input
                id="price-filter"
                type="number"
                min="0"
                placeholder="Р‘РµР· РѕРіСЂР°РЅРёС‡РµРЅРёР№"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            <button className="reset-filters" onClick={resetFilters}>
              РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂС‹
            </button>
          </aside>

          <section className="catalog-results">
            <div className="catalog-results-heading">
              <div>
                <h2>
                  {dealType === "rent"
                    ? "РљРІР°СЂС‚РёСЂС‹ РІ Р°СЂРµРЅРґСѓ"
                    : "РљРІР°СЂС‚РёСЂС‹ РЅР° РїСЂРѕРґР°Р¶Сѓ"}
                </h2>

                <p>
                  РќР°Р№РґРµРЅРѕ РІР°СЂРёР°РЅС‚РѕРІ: {filteredProperties.length}
                </p>
              </div>

              <div className="catalog-sort">
                <label htmlFor="sort-filter">РЎРѕСЂС‚РёСЂРѕРІРєР°:</label>

                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="default">РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ</option>
                  <option value="cheap">РЎРЅР°С‡Р°Р»Р° РґРµС€РµРІР»Рµ</option>
                  <option value="expensive">РЎРЅР°С‡Р°Р»Р° РґРѕСЂРѕР¶Рµ</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="catalog-empty">
                <Search size={32} />
                <h3>Р—Р°РіСЂСѓР¶Р°РµРј РѕР±СЉСЏРІР»РµРЅРёСЏ...</h3>
                <p>РџРѕР»СѓС‡Р°РµРј РґР°РЅРЅС‹Рµ РёР· Р±Р°Р·С‹ HOMELY.</p>
              </div>
            ) : error ? (
              <div className="catalog-empty">
                <Search size={32} />
                <h3>РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєР°С‚Р°Р»РѕРі</h3>
                <p>{error}</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="catalog-grid">
                {filteredProperties.map((property) => (
                  <article className="catalog-card" key={property.id}>
                    <div className="catalog-card-image">
                      <img
                        src={property.image}
                        alt={property.title}
                      />

                      <button
                        className={`catalog-favorite ${
                          favorites.includes(property.id)
                            ? "selected"
                            : ""
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

                      <span className="catalog-property-label">
                        {property.type === "rent" ? "РђСЂРµРЅРґР°" : "РџСЂРѕРґР°Р¶Р°"}
                      </span>
                    </div>

                    <div className="catalog-card-info">
                      <div className="catalog-card-price">
                        {property.price.toLocaleString("ru-RU")} в‚Ѕ
                        {property.period && (
                          <span> / {property.period}</span>
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

                        <span>{property.floor} СЌС‚Р°Р¶</span>
                      </div>

                      <div className="catalog-card-tags">
                        {property.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
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
            ) : (
              <div className="catalog-empty">
                <Search size={32} />

                <h3>РќРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ</h3>

                <p>
                  РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РїР°СЂР°РјРµС‚СЂС‹ РїРѕРёСЃРєР° РёР»Рё СЃР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂС‹.
                </p>

                <button onClick={resetFilters}>
                  РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂС‹
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Catalog;

