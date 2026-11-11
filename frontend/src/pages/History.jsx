
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Trash2, ArrowLeft, Home, X } from "lucide-react";
import Header from "../components/Header";
import "./History.css";

function History() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("viewedProperties") || "[]"
      );

      setProperties(Array.isArray(saved) ? saved : []);
    } catch {
      setProperties([]);
    }
  }, []);

  const removeProperty = (id) => {
    const updated = properties.filter(
      (property) => Number(property.id) !== Number(id)
    );

    setProperties(updated);
    localStorage.setItem("viewedProperties", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setProperties([]);
    localStorage.removeItem("viewedProperties");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-page">
      <Header />

      <main className="history-main">
        <Link to="/catalog" className="history-back">
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </Link>

        <div className="history-heading">
          <div>
            <div className="history-title-icon">
              <Clock3 size={23} />
              <span>Ваши просмотры</span>
            </div>

            <h1>История просмотров</h1>

            <p>
              Здесь собраны объявления, которые вы недавно просматривали.
            </p>
          </div>

          {properties.length > 0 && (
            <button
              className="history-clear"
              onClick={clearHistory}
            >
              <Trash2 size={17} />
              Очистить историю
            </button>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <Home size={34} />
            </div>

            <h2>История пока пуста</h2>

            <p>
              Просматривайте объявления, и они автоматически появятся здесь.
            </p>

            <Link to="/catalog" className="history-catalog-button">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            <div className="history-count">
              Просмотрено объектов: {properties.length}
            </div>

            <div className="history-grid">
              {properties.map((property) => {
                const image =
                  property.images?.[0] || property.image;

                return (
                  <article
                    className="history-card"
                    key={property.id}
                  >
                    <Link
                      to={`/property/${property.id}`}
                      className="history-card-image"
                    >
                      {image ? (
                        <img src={image} alt={property.title} />
                      ) : (
                        <div className="history-no-image">
                          <Home size={35} />
                        </div>
                      )}
                    </Link>

                    <button
                      className="history-remove"
                      onClick={() => removeProperty(property.id)}
                      aria-label="Удалить из истории"
                      title="Удалить из истории"
                    >
                      <X size={19} />
                    </button>

                    <div className="history-card-content">
                      <span className="history-deal-type">
                        {property.deal_type === "rent"
                          ? "Аренда"
                          : "Продажа"}
                      </span>

                      <Link
                        to={`/property/${property.id}`}
                        className="history-card-title"
                      >
                        {property.title}
                      </Link>

                      <p className="history-address">
                        {property.address}
                      </p>

                      <div className="history-card-info">
                        <span>{property.rooms} комн.</span>
                        <span>{property.area} м²</span>
                      </div>

                      <div className="history-card-bottom">
                        <strong>
                          {Number(property.price).toLocaleString("ru-RU")} ₽
                          {property.deal_type === "rent" && (
                            <span> / мес.</span>
                          )}
                        </strong>

                        <span className="history-viewed-date">
                          {formatDate(property.viewedAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default History;
