
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
  "Балкон или лоджия",
  "Кондиционер",
  "Мебель",
  "Современный ремонт",
  "Панорамные окна",
  "Закрытый двор",
  "Парковка",
  "Лифт",
  "Детская площадка",
  "Рядом парк",
  "Рядом метро",
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
        throw new Error(data.error || "Не удалось создать объявление");
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Ошибка соединения с сервером");
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
            <h1>Размещение недвижимости</h1>
            <p>Чтобы разместить объявление, необходимо войти в аккаунт.</p>
            <Link to="/login" className="add-property-submit">
              Войти в аккаунт
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
          <ArrowLeft size={18} /> Вернуться в каталог
        </Link>

        <div className="add-property-heading">
          <span><Building2 size={25} /></span>
          <div>
            <h1>Разместить объявление</h1>
            <p>Расскажите о недвижимости, которую хотите продать или сдать.</p>
          </div>
        </div>

        <form className="add-property-form" onSubmit={handleSubmit}>
          <h2>Основная информация</h2>

          <label>
            Название объявления
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Например, Светлая квартира с видом на парк"
              required
            />
          </label>

          <label>
            <span><MapPin size={16} /> Адрес</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Город, район, улица"
              required
            />
          </label>

          <div className="add-property-grid">
            <label>
              Тип сделки
              <select
                name="deal_type"
                value={form.deal_type}
                onChange={handleChange}
              >
                <option value="sale">Продажа</option>
                <option value="rent">Аренда</option>
              </select>
            </label>

            <label>
              Цена (₽)
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
              Количество комнат
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
              Площадь (м²)
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
              Этаж
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
              Всего этажей
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

          <h2>Удобства и особенности</h2>

          <p className="add-property-amenities-description">
            Выберите всё, что есть в этой недвижимости или рядом с ней.
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
            Выбрано: {form.amenities.length}
          </p>

          <h2>Фотография и описание</h2>

          <label>
            <span><Image size={16} /> Ссылка на фотографию</span>
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
                alt="Предпросмотр недвижимости"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <label>
            Описание недвижимости
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Опишите квартиру, её особенности, преимущества и окружение..."
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
            {loading ? "Публикация..." : "Опубликовать объявление"}
          </button>

          <p className="add-property-note">
            После публикации объявление появится в общем каталоге.
          </p>
        </form>
      </main>
    </div>
  );
}

export default AddProperty;
