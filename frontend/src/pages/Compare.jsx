
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, X, GitCompareArrows } from "lucide-react";
import Header from "../components/Header";
import "./Compare.css";

function Compare() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparison() {
      try {
        const ids = JSON.parse(
          localStorage.getItem("compareProperties") || "[]"
        );

        if (ids.length === 0) {
          setProperties([]);
          return;
        }

        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error("Не удалось загрузить объявления");
        }

        const data = await response.json();

        const selected = data.properties.filter((property) =>
          ids.some((id) => String(id) === String(property.id))
        );

        setProperties(selected);
      } catch (error) {
        console.error("Ошибка сравнения:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComparison();
  }, []);

  function removeProperty(id) {
    const updated = properties.filter(
      (property) => String(property.id) !== String(id)
    );

    setProperties(updated);

    localStorage.setItem(
      "compareProperties",
      JSON.stringify(updated.map((property) => property.id))
    );
  }

  function clearComparison() {
    setProperties([]);
    localStorage.removeItem("compareProperties");
  }

  const rows = [
    {
      label: "Тип сделки",
      value: (p) => p.deal_type === "rent" ? "Аренда" : "Продажа",
    },
    {
      label: "Цена",
      value: (p) =>
        `${Number(p.price).toLocaleString("ru-RU")} ₽${
          p.deal_type === "rent" ? " / месяц" : ""
        }`,
    },
    {
      label: "Адрес",
      value: (p) => p.address,
    },
    {
      label: "Количество комнат",
      value: (p) => `${p.rooms}`,
    },
    {
      label: "Площадь",
      value: (p) => `${p.area} м²`,
    },
    {
      label: "Этаж",
      value: (p) => `${p.floor} из ${p.total_floors}`,
    },
  ];

  return (
    <div className="compare-page">
      <Header />

      <main className="compare-main">
        <Link to="/catalog" className="compare-back">
          <ArrowLeft size={18} />
          Вернуться в каталог
        </Link>

        <div className="compare-heading">
          <div>
            <div className="compare-eyebrow">
              <GitCompareArrows size={17} />
              HOMELY
            </div>

            <h1>Сравнение недвижимости</h1>

            <p>
              Сопоставьте характеристики объектов и выберите подходящий.
            </p>
          </div>

          {properties.length > 0 && (
            <button
              className="compare-clear"
              onClick={clearComparison}
            >
              Очистить сравнение
            </button>
          )}
        </div>

        {loading ? (
          <div className="compare-empty">
            Загружаем объекты...
          </div>
        ) : properties.length === 0 ? (
          <div className="compare-empty">
            <GitCompareArrows size={38} />
            <h2>Пока нечего сравнивать</h2>
            <p>
              Выберите до трёх объектов в каталоге недвижимости.
            </p>
            <Link to="/catalog" className="compare-catalog-link">
              Перейти в каталог
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="compare-count">
              Выбрано объектов: {properties.length} из 3
            </div>

            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Характеристика</th>

                    {properties.map((property) => (
                      <th key={property.id}>
                        <div className="compare-property-heading">
                          <span>{property.title}</span>

                          <button
                            onClick={() => removeProperty(property.id)}
                            title="Убрать из сравнения"
                            aria-label="Убрать объект"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Фотография</td>

                    {properties.map((property) => (
                      <td key={property.id}>
                        <img
                          className="compare-image"
                          src={property.image}
                          alt={property.title}
                        />
                      </td>
                    ))}
                  </tr>

                  {rows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>

                      {properties.map((property) => (
                        <td key={property.id}>
                          {row.value(property)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <td>Подробнее</td>

                    {properties.map((property) => (
                      <td key={property.id}>
                        <Link
                          to={`/property/${property.id}`}
                          className="compare-details-link"
                        >
                          Открыть объявление
                          <ArrowUpRight size={16} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Compare;
