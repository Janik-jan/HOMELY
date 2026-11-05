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
    title: "Светлая квартира с видом на город",
    address: "Москва, Пресненский район",
    price: 85000,
    period: "мес.",
    rooms: 2,
    area: 64,
    floor: "8 из 16",
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000",
    tags: ["Много света", "Тихий двор"],
  },
  {
    id: 2,
    title: "Современная квартира рядом с парком",
    address: "Москва, район Хамовники",
    price: 18500000,
    period: "",
    rooms: 3,
    area: 82,
    floor: "5 из 12",
    type: "sale",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000",
    tags: ["Рядом парк", "Балкон"],
  },
  {
    id: 3,
    title: "Уютная квартира в спокойном районе",
    address: "Москва, район Сокол",
    price: 62000,
    period: "мес.",
    rooms: 1,
    area: 42,
    floor: "3 из 9",
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000",
    tags: ["Тихий район", "Метро рядом"],
  },
  {
    id: 4,
    title: "Просторная квартира с большой кухней",
    address: "Москва, район Хорошёво-Мнёвники",
    price: 14200000,
    period: "",
    rooms: 2,
    area: 71,
    floor: "11 из 20",
    type: "sale",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000",
    tags: ["Большая кухня", "Много света"],
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
      `http://localhost:8080/api/favorites/${id}`,
      {
        method: favorites.includes(id) ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Не удалось изменить избранное.");
      return;
    }

    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  } catch (error) {
    alert("Ошибка подключения к серверу.");
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
              ПРОСТРАНСТВО ДЛЯ ВАШЕЙ ЖИЗНИ
            </div>

            <h1>
              Найдите не просто
              <br />
              квартиру, а <span>свой дом.</span>
            </h1>

            <p className="hero-description">
              Помогаем выбрать жильё, в котором будет комфортно жить.
              Учитываем не только характеристики квартиры, но и то,
              что находится вокруг неё.
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
                  Аренда
                </button>

                <button
                  className={dealType === "sale" ? "active" : ""}
                  onClick={() => {
                    setDealType("sale");
                    setShowAll(false);
                  }}
                >
                  Покупка
                </button>
              </div>

              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrap">
                  <MapPin size={20} />

                  <input
                    type="text"
                    placeholder="Город, район или адрес"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <button className="search-button" type="submit">
                  <Search size={19} />
                  Найти жильё
                </button>
              </form>
            </div>

            <div className="hero-note">
              <ShieldCheck size={17} />
              Больше информации — увереннее выбор
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400"
              alt="Современный светлый интерьер квартиры"
            />

            <div className="image-caption">
              <span>Место, в котором хочется жить</span>
              <span>HOMELY</span>
            </div>
          </div>
        </section>

        <section className="listings section" id="listings">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                ПОДБОРКА HOMELY
              </div>

              <h2>
                {dealType === "rent"
                  ? "Жильё в аренду"
                  : "Жильё на продажу"}
              </h2>

              <p>
                Подобрали варианты, на которые стоит обратить внимание.
              </p>
            </div>

            <button
              className="filter-button"
              onClick={() => setSearch("")}
            >
              <SlidersHorizontal size={18} />
              Сбросить поиск
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

                  <span className="property-label">
                    {property.type === "rent" ? "Аренда" : "Продажа"}
                  </span>
                </div>

                <div className="property-info">
                  <div className="property-price">
                    {property.price.toLocaleString("ru-RU")} ₽
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
                      {property.rooms} комн.
                    </span>

                    <span>
                      <Maximize2 size={15} />
                      {property.area} м²
                    </span>

                    <span>{property.floor} этаж</span>
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
  Подробнее
  <ArrowUpRight size={17} />
</button>
                </div>
              </article>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="empty-state">
              <Search size={30} />
              <h3>Ничего не найдено</h3>
              <p>
                Попробуйте изменить название города или района.
              </p>
              <button onClick={() => setSearch("")}>
                Сбросить поиск
              </button>
            </div>
          )}

          {filteredProperties.length > 4 && (
            <button
              className="show-more-button"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Скрыть" : "Показать ещё"}
            </button>
          )}
        </section>

        <section className="about section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200"
              alt="Уютная гостиная"
            />
          </div>

          <div className="about-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              НАША ИДЕЯ
            </div>

            <h2>
              Дом — это больше,
              чем просто стены.
            </h2>

            <p>
              При выборе жилья важна не только площадь и цена.
              Имеет значение, насколько светло в квартире, тихо ли
              во дворе, есть ли рядом парк, магазины и удобный транспорт.
            </p>

            <p>
              HOMELY объединяет информацию о недвижимости и окружающей
              среде, чтобы помочь принять взвешенное решение.
            </p>

            <a href="#advantages" className="text-link">
              Узнать о преимуществах <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section className="advantages section" id="advantages">
          <div className="section-heading centered">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              ПОЧЕМУ HOMELY
              <span className="eyebrow-line" />
            </div>

            <h2>Выбирайте с пониманием</h2>

            <p>
              Мы обращаем внимание на детали, которые влияют
              на повседневную жизнь.
            </p>
          </div>

          <div className="advantages-grid">
            <div className="advantage-item">
              <div className="advantage-icon">
                <Sun size={25} />
              </div>

              <h3>Комфорт внутри</h3>
              <p>
                Освещённость, планировка, балкон, этаж и состояние жилья.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <Trees size={25} />
              </div>

              <h3>Окружение</h3>
              <p>
                Парки, магазины, кафе, школы и места для прогулок рядом.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <MapPin size={25} />
              </div>

              <h3>Удобное расположение</h3>
              <p>
                Транспорт, остановки и важные места поблизости.
              </p>
            </div>

            <div className="advantage-item">
              <div className="advantage-icon">
                <ShieldCheck size={25} />
              </div>

              <h3>Честная информация</h3>
              <p>
                Преимущества и недостатки, которые важно знать заранее.
              </p>
            </div>
          </div>
        </section>

        <section className="publish-banner">
          <div>
            <div className="eyebrow">ВАШЕ ЖИЛЬЁ — В HOMELY</div>

            <h2>Хотите разместить объявление?</h2>

            <p>
              Расскажите о своём объекте и найдите заинтересованных людей.
            </p>
          </div>

          <button
            onClick={() => navigate(
  isLoggedIn ? "/add-property" : "/login"
)}
            
          >
            <Plus size={19} />
            Разместить объявление
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
          Мы помогаем выбрать не просто квартиру,
          а место, в котором захочется жить.
        </p>

        <span>© 2026 HOMELY</span>
      </footer>
    </div>
  );
}

export default HomePage;