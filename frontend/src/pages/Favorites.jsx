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
      setError("Войдите в аккаунт, чтобы просматривать избранное.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось загрузить избранное");
        return;
      }

      setProperties(data.properties || []);
    } catch (error) {
      setError("Не удалось подключиться к HOMELY API.");
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
        `http://localhost:8080/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Не удалось удалить объявление из избранного");
        return;
      }

      setProperties((current) =>
        current.filter((property) => property.id !== id)
      );
    } catch (error) {
      alert("Ошибка подключения к серверу");
    }
  }

  return (
    <div className="favorites-page">
      <Header />

      <main className="favorites-main">
        <div className="favorites-intro">
          <div className="catalog-eyebrow">
            <span />
            ВАШ HOMELY
          </div>

          <h1>Избранное</h1>

          <p>
            Здесь собраны квартиры, которые вы сохранили для дальнейшего
            просмотра.
          </p>
        </div>

        {loading ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>Загружаем избранное...</h3>
          </div>
        ) : error ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>{error}</h3>

            <button onClick={() => navigate("/login")}>
              Войти в аккаунт
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="catalog-empty">
            <Heart size={32} />
            <h3>Пока ничего нет</h3>
            <p>
              Добавляйте понравившиеся квартиры в избранное,
              чтобы не потерять их.
            </p>

            <Link to="/catalog" className="catalog-details-link">
              Перейти в каталог
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="favorites-heading">
              <h2>Сохранённые объявления</h2>
              <span>Найдено: {properties.length}</span>
            </div>

            <div className="catalog-grid">
              {properties.map((property) => (
                <article className="catalog-card" key={property.id}>
                  <div className="catalog-card-image">
                    <img src={property.image} alt={property.title} />

                    <button
                      className="catalog-favorite selected"
                      onClick={() => removeFavorite(property.id)}
                      aria-label="Удалить из избранного"
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>

                    <span className="catalog-property-label">
                      {property.deal_type === "rent" ? "Аренда" : "Продажа"}
                    </span>
                  </div>

                  <div className="catalog-card-info">
                    <div className="catalog-card-price">
                      {property.price.toLocaleString("ru-RU")} ₽
                      {property.deal_type === "rent" && (
                        <span> / мес.</span>
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

                      <span>
                        {property.floor} из {property.total_floors} этаж
                      </span>
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
          </>
        )}
      </main>
    </div>
  );
}

export default Favorites;