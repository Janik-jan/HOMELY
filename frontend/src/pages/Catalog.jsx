
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

const API_URL = "http://localhost:8080/api/properties";
const FAVORITES_URL = "http://localhost:8080/api/favorites";

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
          throw new Error("Не удалось загрузить объявления");
        }

        const data = await response.json();

        const formattedProperties = data.properties.map((property) => ({
          ...property,
          type: property.deal_type,
          period: property.deal_type === "rent" ? "мес." : "",
          floor: `${property.floor} из ${property.total_floors}`,
          tags:
            property.deal_type === "rent"
              ? ["Для аренды", "Уютное жильё"]
              : ["Для покупки", "Недвижимость"],
        }));

        setProperties(formattedProperties);
      } catch (err) {
        setError(
          "Не удалось подключиться к HOMELY API. Проверьте, запущен ли сервер."
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
      console.error("Ошибка загрузки избранного:", error);
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

      alert(data.error || "Не удалось изменить избранное");
      return;
    }

    setFavorites((current) =>
      isSelected
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  } catch (error) {
    alert("Не удалось подключиться к серверу");
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
            КАТАЛОГ HOMELY
          </div>

          <h1>Найдите место для жизни</h1>

          <p>
            Сравнивайте не только квартиры, но и условия,
            в которых вам предстоит жить.
          </p>
        </div>

        <section className="catalog-search">
          <div className="catalog-deal-tabs">
            <button
              className={dealType === "rent" ? "active" : ""}
              onClick={() => setDealType("rent")}
            >
              Аренда
            </button>

            <button
              className={dealType === "sale" ? "active" : ""}
              onClick={() => setDealType("sale")}
            >
              Покупка
            </button>
          </div>

          <div className="catalog-search-input">
            <Search size={20} />

            <input
              type="text"
              placeholder="Введите город, район или название"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <div className="catalog-layout">
          <aside className="catalog-filters">
            <div className="filters-heading">
              <SlidersHorizontal size={19} />
              <h2>Фильтры</h2>
            </div>

            <div className="filter-group">
              <label htmlFor="rooms-filter">
                Количество комнат
              </label>

              <select
                id="rooms-filter"
                value={rooms}
                onChange={(event) => setRooms(event.target.value)}
              >
                <option value="all">Любое количество</option>
<option value="1">1 комната</option>
<option value="2">2 комнаты</option>
<option value="3">3 комнаты</option>
<option value="4+">4 и более комнат</option>
              </select>
            </div>
<div className="filter-group">
  <label htmlFor="min-price-filter">
    Минимальная цена, ₽
  </label>

  <input
    id="min-price-filter"
    type="number"
    min="0"
    placeholder="От любой суммы"
    value={minPrice}
    onChange={(event) => setMinPrice(event.target.value)}
  />
</div>
            <div className="filter-group">
              <label htmlFor="price-filter">
                Максимальная цена, ₽
              </label>

              <input
                id="price-filter"
                type="number"
                min="0"
                placeholder="Без ограничений"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            <button className="reset-filters" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </aside>

          <section className="catalog-results">
            <div className="catalog-results-heading">
              <div>
                <h2>
                  {dealType === "rent"
                    ? "Квартиры в аренду"
                    : "Квартиры на продажу"}
                </h2>

                <p>
                  Найдено вариантов: {filteredProperties.length}
                </p>
              </div>

              <div className="catalog-sort">
                <label htmlFor="sort-filter">Сортировка:</label>

                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="default">По умолчанию</option>
                  <option value="cheap">Сначала дешевле</option>
                  <option value="expensive">Сначала дороже</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="catalog-empty">
                <Search size={32} />
                <h3>Загружаем объявления...</h3>
                <p>Получаем данные из базы HOMELY.</p>
              </div>
            ) : error ? (
              <div className="catalog-empty">
                <Search size={32} />
                <h3>Не удалось загрузить каталог</h3>
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
                        aria-label="Добавить в избранное"
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
                        {property.type === "rent" ? "Аренда" : "Продажа"}
                      </span>
                    </div>

                    <div className="catalog-card-info">
                      <div className="catalog-card-price">
                        {property.price.toLocaleString("ru-RU")} ₽
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
                          {property.rooms} комн.
                        </span>

                        <span>
                          <Maximize2 size={15} />
                          {property.area} м²
                        </span>

                        <span>{property.floor} этаж</span>
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
                        Подробнее
                        <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <Search size={32} />

                <h3>Ничего не найдено</h3>

                <p>
                  Попробуйте изменить параметры поиска или сбросить фильтры.
                </p>

                <button onClick={resetFilters}>
                  Сбросить фильтры
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
