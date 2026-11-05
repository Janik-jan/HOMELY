
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  BedDouble,
  Maximize2,
  Building2,
  ShieldCheck,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Header from "../components/Header";
import "./PropertyDetails.css";
import { useNavigate } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
const [reviews, setReviews] = useState([]);
const [averageRating, setAverageRating] = useState(0);
const [reviewCount, setReviewCount] = useState(0);
const [distribution, setDistribution] = useState({});
const [currentUserId, setCurrentUserId] = useState(null);

const [selectedRating, setSelectedRating] = useState(5);
const [reviewComment, setReviewComment] = useState("");
const [reviewError, setReviewError] = useState("");
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewSubmitting, setReviewSubmitting] = useState(false);
// Заявки на просмотр
const [appointmentAt, setAppointmentAt] = useState("");
const [appointmentMessage, setAppointmentMessage] = useState("");
const [appointmentStatus, setAppointmentStatus] = useState("");
const [appointmentSubmitting, setAppointmentSubmitting] = useState(false);
const token = localStorage.getItem("authToken");
const navigate = useNavigate();
const loadReviews = async () => {
  try {
    const response = await fetch(
      `/api/properties/${id}/reviews`
    );

    if (!response.ok) {
      throw new Error("Не удалось загрузить отзывы");
    }

    const data = await response.json();

    setReviews(data.reviews || []);
    setAverageRating(Number(data.average_rating) || 0);
    setReviewCount(data.review_count || 0);
    setDistribution(data.distribution || {});
  } catch (error) {
    console.error("Ошибка загрузки отзывов:", error);
  } finally {
    setReviewLoading(false);
  }
};

useEffect(() => {
  setReviewLoading(true);
  loadReviews();

  if (token) {
    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Не удалось получить пользователя");
        return response.json();
      })
      .then((data) => setCurrentUserId(data.user?.id ?? null))
      .catch((error) => console.error(error));
  }
}, [id]);

const submitReview = async (event) => {
  event.preventDefault();
  setReviewError("");

  if (!token) {
    setReviewError("Войдите в аккаунт, чтобы оставить отзыв.");
    return;
  }

  if (!reviewComment.trim()) {
    setReviewError("Напишите комментарий.");
    return;
  }

  setReviewSubmitting(true);

  try {
    const response = await fetch(
      `/api/properties/${id}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: selectedRating,
          comment: reviewComment.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Не удалось отправить отзыв");
    }

    setReviewComment("");
    setSelectedRating(5);

    await loadReviews();
  } catch (error) {
    setReviewError(error.message);
  } finally {
    setReviewSubmitting(false);
  }
};

const deleteReview = async (reviewId) => {
  if (!window.confirm("Удалить свой отзыв?")) return;

  try {
    const response = await fetch(
      `/api/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Не удалось удалить отзыв");
    }

    await loadReviews();
  } catch (error) {
    setReviewError(error.message);
  }
};
// Отправка заявки на просмотр
const submitAppointment = async (event) => {
  event.preventDefault();
  setAppointmentStatus("");

  if (!token) {
    setAppointmentStatus("Войдите в аккаунт, чтобы записаться на просмотр.");
    return;
  }

  if (!appointmentAt) {
    setAppointmentStatus("Выберите дату и время.");
    return;
  }

  setAppointmentSubmitting(true);

  try {
    const response = await fetch(
      `/api/properties/${id}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_at: appointmentAt,
          message: appointmentMessage.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Не удалось отправить заявку");
    }

    setAppointmentStatus("Заявка успешно отправлена! Ожидайте ответа владельца.");
    setAppointmentAt("");
    setAppointmentMessage("");
  } catch (error) {
    setAppointmentStatus(error.message);
  } finally {
    setAppointmentSubmitting(false);
  }
};
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError("");
        setProperty(null);

        const response = await fetch(
          `/api/properties/${id}`
        );

        if (response.status === 404) {
          throw new Error("Объявление не найдено");
        }

        if (!response.ok) {
          throw new Error("Не удалось загрузить объявление");
        }

        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err.message || "Ошибка подключения к серверу");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);
useEffect(() => {
  async function checkFavorite() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsFavorite(false);
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();

      setIsFavorite(
        data.properties.some((item) => item.id === Number(id))
      );
    } catch (error) {
      console.error("Ошибка проверки избранного:", error);
    }
  }

  checkFavorite();
}, [id]);
async function toggleFavorite() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      `/api/favorites/${id}`,
      {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    setIsFavorite(!isFavorite);
  } catch (error) {
    alert("Ошибка подключения к серверу");
  }
}
  if (loading) {
    return (
      <div className="property-details-page">
        <Header />
        <main className="property-details-main">
          <div className="catalog-empty">
            <Search size={32} />
            <h3>Загружаем объявление...</h3>
            <p>Получаем информацию из базы HOMELY.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-details-page">
        <Header />
        <main className="property-details-main">
          <div className="catalog-empty">
            <Search size={32} />
            <h3>{error || "Объявление не найдено"}</h3>
            <p>Возможно, объявление было удалено или ссылка неверна.</p>
            <Link to="/catalog" className="catalog-details-link">
              Вернуться в каталог
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isRent = property.deal_type === "rent";

  const formattedPrice = property.price.toLocaleString("ru-RU");

  const floorText = `${property.floor} из ${property.total_floors}`;

  return (
    <div className="property-details-page">
      <Header />

      <main className="property-details-main">
        <Link to="/catalog" className="back-link">
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </Link>

        <div className="details-heading">
          <div>
            <div className="details-location">
              <MapPin size={17} />
              {property.address}
            </div>

            <h1>{property.title}</h1>

            <p>
              {isRent
                ? "Квартира для комфортной аренды"
                : "Квартира для покупки"}
            </p>
          </div>

          <button
            className={`details-favorite ${
              isFavorite ? "selected" : ""
            }`}
            onClick={toggleFavorite}
          >
            <Heart
              size={20}
              fill={isFavorite ? "currentColor" : "none"}
            />
            {isFavorite ? "В избранном" : "В избранное"}
          </button>
        </div>

        <section className="details-gallery">
          <div className="gallery-main">
            <img
              src={property.image}
              alt={property.title}
            />
          </div>

          <div className="gallery-thumbnails">
            <button className="gallery-thumbnail active">
              <img
                src={property.image}
                alt="Фотография квартиры"
              />
            </button>
          </div>
        </section>

        <div className="details-content-grid">
          <div className="details-main-content">
            <section className="details-section">
              <div className="details-price">
                {formattedPrice} ₽
                {isRent && (
                  <span style={{ fontSize: "16px", fontWeight: 400 }}>
                    {" "}/ месяц
                  </span>
                )}
              </div>

              <h2>Характеристики квартиры</h2>

              <div className="characteristics-grid">
                <div className="characteristic">
                  <BedDouble size={22} />
                  <div>
                    <span>Комнат</span>
                    <strong>{property.rooms}</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <Maximize2 size={22} />
                  <div>
                    <span>Площадь</span>
                    <strong>{property.area} м²</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <Building2 size={22} />
                  <div>
                    <span>Этаж</span>
                    <strong>{floorText}</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <ShieldCheck size={22} />
                  <div>
                    <span>Тип объявления</span>
                    <strong>{isRent ? "Аренда" : "Продажа"}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>Описание</h2>

              <p className="details-description">
                {property.description}
              </p>
            </section>
            <section className="details-section">
              <h2>Удобства и особенности</h2>

              {property.amenities && property.amenities.length > 0 ? (
                <div className="details-amenities">
                  {property.amenities.map((amenity) => (
                    <div className="details-amenity" key={amenity}>
                      <ShieldCheck size={18} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="details-amenities-empty">
                  Владелец пока не указал удобства и особенности этой недвижимости.
                </p>
              )}
            </section>
            <section className="details-section">
              <h2>Информация об объекте</h2>

              <div className="pros-cons-list">
                <div className="pros-cons-item positive">
                  <ShieldCheck size={19} />
                  <span>
                    Данные о квартире загружены непосредственно из базы HOMELY.
                  </span>
                </div>

                <div className="pros-cons-item positive">
                  <ShieldCheck size={19} />
                  <span>
                    Указаны фактические параметры объявления: площадь,
                    количество комнат и этаж.
                  </span>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>Окружение и инфраструктура</h2>

              <div className="review-placeholder">
                <MapPin size={26} />

                <div>
                  <strong>Расположение объекта</strong>
                  <p>
                    {property.address}. Дополнительную информацию
                    об освещённости, дворе, транспорте и местах
                    поблизости добавим в следующих этапах проекта.
                  </p>
                </div>
              </div>
            </section>

            <section className="details-section reviews-section">
  <h2>Отзывы о жилье</h2>

  <div className="reviews-summary">
    <div className="rating-average">
      <strong>{averageRating.toFixed(1)}</strong>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            fill={star <= Math.round(averageRating) ? "#ae6c00" : "none"}
            color="#ae6c00"
          />
        ))}
      </div>

      <span>
        {reviewCount} {reviewCount === 1 ? "отзыв" : "отзывов"}
      </span>
    </div>

    <div className="rating-distribution">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = Number(distribution[rating]) || 0;
        const percentage = reviewCount
          ? (count / reviewCount) * 100
          : 0;

        return (
          <div className="rating-row" key={rating}>
            <span>{rating} ★</span>

            <div className="rating-bar">
              <div
                className="rating-bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <span>{count}</span>
          </div>
        );
      })}
    </div>
  </div>

  {token ? (
    reviews.some((review) => review.user_id === currentUserId) ? (
      <p className="review-notice">
        Вы уже оставили отзыв об этой квартире.
      </p>
    ) : (
      <form className="review-form" onSubmit={submitReview}>
        <h3>Оставить отзыв</h3>

        <div className="review-rating-select">
          <span>Ваша оценка:</span>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="review-star-button"
                onClick={() => setSelectedRating(star)}
                aria-label={`Оценка ${star}`}
              >
                <Star
                  size={27}
                  fill={star <= selectedRating ? "#ae6c00" : "none"}
                  color="#ae6c00"
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="review-textarea"
          placeholder="Расскажите о квартире, доме или районе..."
          value={reviewComment}
          onChange={(event) => setReviewComment(event.target.value)}
          maxLength={2000}
          rows={4}
        />

        {reviewError && (
          <p className="review-error">{reviewError}</p>
        )}

        <button
          type="submit"
          className="review-submit"
          disabled={reviewSubmitting}
        >
          {reviewSubmitting ? "Отправка..." : "Опубликовать отзыв"}
        </button>
      </form>
    )
  ) : (
    <p className="review-notice">
      <Link to="/login">Войдите в аккаунт</Link>, чтобы оставить отзыв.
    </p>
  )}

  {reviewError && token && (
    <p className="review-error">{reviewError}</p>
  )}

  <div className="reviews-list">
    {reviewLoading ? (
      <p>Загрузка отзывов...</p>
    ) : reviews.length === 0 ? (
      <p className="review-empty">
        Пока нет отзывов. Станьте первым!
      </p>
    ) : (
      reviews.map((review) => (
        <article className="review-card" key={review.id}>
          <div className="review-card-header">
            <div>
              <strong>{review.user_name}</strong>

              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= review.rating ? "#ae6c00" : "none"}
                    color="#ae6c00"
                  />
                ))}
              </div>
            </div>

            <span className="review-date">
              {new Date(review.created_at).toLocaleDateString("ru-RU")}
            </span>
          </div>

          <p>{review.comment}</p>

          {currentUserId === review.user_id && (
            <button
              className="review-delete"
              onClick={() => deleteReview(review.id)}
            >
              <Trash2 size={15} />
              Удалить отзыв
            </button>
          )}
        </article>
      ))
    )}
  </div>
</section>
          </div>

          <aside className="details-sidebar">
            <div className="contact-card">
              <div className="contact-price">
                {formattedPrice} ₽
              </div>

              <span className="contact-subtitle">
                {isRent ? "Аренда квартиры" : "Продажа квартиры"}
              </span>

              {token ? (
  <form className="appointment-form" onSubmit={submitAppointment}>
    <h3>Записаться на просмотр</h3>

    <label htmlFor="appointment-date">
      Желаемая дата и время
    </label>

    <input
      id="appointment-date"
      type="datetime-local"
      value={appointmentAt}
      onChange={(event) => setAppointmentAt(event.target.value)}
      min={new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      ).toISOString().slice(0, 16)}
      required
    />

    <label htmlFor="appointment-message">
      Сообщение владельцу
    </label>

    <textarea
      id="appointment-message"
      value={appointmentMessage}
      onChange={(event) => setAppointmentMessage(event.target.value)}
      placeholder="Например, хотел бы посмотреть квартиру вечером..."
      rows={3}
      maxLength={1000}
    />

    {appointmentStatus && (
      <p className="appointment-status">{appointmentStatus}</p>
    )}

    <button
      type="submit"
      className="contact-button"
      disabled={appointmentSubmitting}
    >
      {appointmentSubmitting ? "Отправка..." : "Отправить заявку"}
    </button>
  </form>
) : (
  <>
    <p>Войдите в аккаунт, чтобы записаться на просмотр.</p>

    <Link to="/login" className="contact-button">
      Войти в аккаунт
    </Link>
  </>
)}
              <div className="contact-note">
                <ShieldCheck size={17} />
                HOMELY помогает выбрать жильё осознанно
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PropertyDetails;
