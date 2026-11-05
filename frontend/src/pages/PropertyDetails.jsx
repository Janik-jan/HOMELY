
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
// Р—Р°СЏРІРєРё РЅР° РїСЂРѕСЃРјРѕС‚СЂ
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
      throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РѕС‚Р·С‹РІС‹");
    }

    const data = await response.json();

    setReviews(data.reviews || []);
    setAverageRating(Number(data.average_rating) || 0);
    setReviewCount(data.review_count || 0);
    setDistribution(data.distribution || {});
  } catch (error) {
    console.error("РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РѕС‚Р·С‹РІРѕРІ:", error);
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
        if (!response.ok) throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ");
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
    setReviewError("Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ РѕСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ.");
    return;
  }

  if (!reviewComment.trim()) {
    setReviewError("РќР°РїРёС€РёС‚Рµ РєРѕРјРјРµРЅС‚Р°СЂРёР№.");
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
      throw new Error(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ");
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
  if (!window.confirm("РЈРґР°Р»РёС‚СЊ СЃРІРѕР№ РѕС‚Р·С‹РІ?")) return;

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
      throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ");
    }

    await loadReviews();
  } catch (error) {
    setReviewError(error.message);
  }
};
// РћС‚РїСЂР°РІРєР° Р·Р°СЏРІРєРё РЅР° РїСЂРѕСЃРјРѕС‚СЂ
const submitAppointment = async (event) => {
  event.preventDefault();
  setAppointmentStatus("");

  if (!token) {
    setAppointmentStatus("Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ Р·Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕСЃРјРѕС‚СЂ.");
    return;
  }

  if (!appointmentAt) {
    setAppointmentStatus("Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ Рё РІСЂРµРјСЏ.");
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
      throw new Error(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ");
    }

    setAppointmentStatus("Р—Р°СЏРІРєР° СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»РµРЅР°! РћР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р° РІР»Р°РґРµР»СЊС†Р°.");
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
          throw new Error("РћР±СЉСЏРІР»РµРЅРёРµ РЅРµ РЅР°Р№РґРµРЅРѕ");
        }

        if (!response.ok) {
          throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ");
        }

        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err.message || "РћС€РёР±РєР° РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє СЃРµСЂРІРµСЂСѓ");
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
      console.error("РћС€РёР±РєР° РїСЂРѕРІРµСЂРєРё РёР·Р±СЂР°РЅРЅРѕРіРѕ:", error);
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

      alert(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ РёР·Р±СЂР°РЅРЅРѕРµ");
      return;
    }

    setIsFavorite(!isFavorite);
  } catch (error) {
    alert("РћС€РёР±РєР° РїРѕРґРєР»СЋС‡РµРЅРёСЏ Рє СЃРµСЂРІРµСЂСѓ");
  }
}
  if (loading) {
    return (
      <div className="property-details-page">
        <Header />
        <main className="property-details-main">
          <div className="catalog-empty">
            <Search size={32} />
            <h3>Р—Р°РіСЂСѓР¶Р°РµРј РѕР±СЉСЏРІР»РµРЅРёРµ...</h3>
            <p>РџРѕР»СѓС‡Р°РµРј РёРЅС„РѕСЂРјР°С†РёСЋ РёР· Р±Р°Р·С‹ HOMELY.</p>
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
            <h3>{error || "РћР±СЉСЏРІР»РµРЅРёРµ РЅРµ РЅР°Р№РґРµРЅРѕ"}</h3>
            <p>Р’РѕР·РјРѕР¶РЅРѕ, РѕР±СЉСЏРІР»РµРЅРёРµ Р±С‹Р»Рѕ СѓРґР°Р»РµРЅРѕ РёР»Рё СЃСЃС‹Р»РєР° РЅРµРІРµСЂРЅР°.</p>
            <Link to="/catalog" className="catalog-details-link">
              Р’РµСЂРЅСѓС‚СЊСЃСЏ РІ РєР°С‚Р°Р»РѕРі
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isRent = property.deal_type === "rent";

  const formattedPrice = property.price.toLocaleString("ru-RU");

  const floorText = `${property.floor} РёР· ${property.total_floors}`;

  return (
    <div className="property-details-page">
      <Header />

      <main className="property-details-main">
        <Link to="/catalog" className="back-link">
          <ArrowLeft size={18} />
          Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє РѕР±СЉСЏРІР»РµРЅРёСЏРј
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
                ? "РљРІР°СЂС‚РёСЂР° РґР»СЏ РєРѕРјС„РѕСЂС‚РЅРѕР№ Р°СЂРµРЅРґС‹"
                : "РљРІР°СЂС‚РёСЂР° РґР»СЏ РїРѕРєСѓРїРєРё"}
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
            {isFavorite ? "Р’ РёР·Р±СЂР°РЅРЅРѕРј" : "Р’ РёР·Р±СЂР°РЅРЅРѕРµ"}
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
                alt="Р¤РѕС‚РѕРіСЂР°С„РёСЏ РєРІР°СЂС‚РёСЂС‹"
              />
            </button>
          </div>
        </section>

        <div className="details-content-grid">
          <div className="details-main-content">
            <section className="details-section">
              <div className="details-price">
                {formattedPrice} в‚Ѕ
                {isRent && (
                  <span style={{ fontSize: "16px", fontWeight: 400 }}>
                    {" "}/ РјРµСЃСЏС†
                  </span>
                )}
              </div>

              <h2>РҐР°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё РєРІР°СЂС‚РёСЂС‹</h2>

              <div className="characteristics-grid">
                <div className="characteristic">
                  <BedDouble size={22} />
                  <div>
                    <span>РљРѕРјРЅР°С‚</span>
                    <strong>{property.rooms}</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <Maximize2 size={22} />
                  <div>
                    <span>РџР»РѕС‰Р°РґСЊ</span>
                    <strong>{property.area} РјВІ</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <Building2 size={22} />
                  <div>
                    <span>Р­С‚Р°Р¶</span>
                    <strong>{floorText}</strong>
                  </div>
                </div>

                <div className="characteristic">
                  <ShieldCheck size={22} />
                  <div>
                    <span>РўРёРї РѕР±СЉСЏРІР»РµРЅРёСЏ</span>
                    <strong>{isRent ? "РђСЂРµРЅРґР°" : "РџСЂРѕРґР°Р¶Р°"}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>РћРїРёСЃР°РЅРёРµ</h2>

              <p className="details-description">
                {property.description}
              </p>
            </section>
            <section className="details-section">
              <h2>РЈРґРѕР±СЃС‚РІР° Рё РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё</h2>

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
                  Р’Р»Р°РґРµР»РµС† РїРѕРєР° РЅРµ СѓРєР°Р·Р°Р» СѓРґРѕР±СЃС‚РІР° Рё РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё СЌС‚РѕР№ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё.
                </p>
              )}
            </section>
            <section className="details-section">
              <h2>РРЅС„РѕСЂРјР°С†РёСЏ РѕР± РѕР±СЉРµРєС‚Рµ</h2>

              <div className="pros-cons-list">
                <div className="pros-cons-item positive">
                  <ShieldCheck size={19} />
                  <span>
                    Р”Р°РЅРЅС‹Рµ Рѕ РєРІР°СЂС‚РёСЂРµ Р·Р°РіСЂСѓР¶РµРЅС‹ РЅРµРїРѕСЃСЂРµРґСЃС‚РІРµРЅРЅРѕ РёР· Р±Р°Р·С‹ HOMELY.
                  </span>
                </div>

                <div className="pros-cons-item positive">
                  <ShieldCheck size={19} />
                  <span>
                    РЈРєР°Р·Р°РЅС‹ С„Р°РєС‚РёС‡РµСЃРєРёРµ РїР°СЂР°РјРµС‚СЂС‹ РѕР±СЉСЏРІР»РµРЅРёСЏ: РїР»РѕС‰Р°РґСЊ,
                    РєРѕР»РёС‡РµСЃС‚РІРѕ РєРѕРјРЅР°С‚ Рё СЌС‚Р°Р¶.
                  </span>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h2>РћРєСЂСѓР¶РµРЅРёРµ Рё РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°</h2>

              <div className="review-placeholder">
                <MapPin size={26} />

                <div>
                  <strong>Р Р°СЃРїРѕР»РѕР¶РµРЅРёРµ РѕР±СЉРµРєС‚Р°</strong>
                  <p>
                    {property.address}. Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ
                    РѕР± РѕСЃРІРµС‰С‘РЅРЅРѕСЃС‚Рё, РґРІРѕСЂРµ, С‚СЂР°РЅСЃРїРѕСЂС‚Рµ Рё РјРµСЃС‚Р°С…
                    РїРѕР±Р»РёР·РѕСЃС‚Рё РґРѕР±Р°РІРёРј РІ СЃР»РµРґСѓСЋС‰РёС… СЌС‚Р°РїР°С… РїСЂРѕРµРєС‚Р°.
                  </p>
                </div>
              </div>
            </section>

            <section className="details-section reviews-section">
  <h2>РћС‚Р·С‹РІС‹ Рѕ Р¶РёР»СЊРµ</h2>

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
        {reviewCount} {reviewCount === 1 ? "РѕС‚Р·С‹РІ" : "РѕС‚Р·С‹РІРѕРІ"}
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
            <span>{rating} в…</span>

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
        Р’С‹ СѓР¶Рµ РѕСЃС‚Р°РІРёР»Рё РѕС‚Р·С‹РІ РѕР± СЌС‚РѕР№ РєРІР°СЂС‚РёСЂРµ.
      </p>
    ) : (
      <form className="review-form" onSubmit={submitReview}>
        <h3>РћСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ</h3>

        <div className="review-rating-select">
          <span>Р’Р°С€Р° РѕС†РµРЅРєР°:</span>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="review-star-button"
                onClick={() => setSelectedRating(star)}
                aria-label={`РћС†РµРЅРєР° ${star}`}
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
          placeholder="Р Р°СЃСЃРєР°Р¶РёС‚Рµ Рѕ РєРІР°СЂС‚РёСЂРµ, РґРѕРјРµ РёР»Рё СЂР°Р№РѕРЅРµ..."
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
          {reviewSubmitting ? "РћС‚РїСЂР°РІРєР°..." : "РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ РѕС‚Р·С‹РІ"}
        </button>
      </form>
    )
  ) : (
    <p className="review-notice">
      <Link to="/login">Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚</Link>, С‡С‚РѕР±С‹ РѕСЃС‚Р°РІРёС‚СЊ РѕС‚Р·С‹РІ.
    </p>
  )}

  {reviewError && token && (
    <p className="review-error">{reviewError}</p>
  )}

  <div className="reviews-list">
    {reviewLoading ? (
      <p>Р—Р°РіСЂСѓР·РєР° РѕС‚Р·С‹РІРѕРІ...</p>
    ) : reviews.length === 0 ? (
      <p className="review-empty">
        РџРѕРєР° РЅРµС‚ РѕС‚Р·С‹РІРѕРІ. РЎС‚Р°РЅСЊС‚Рµ РїРµСЂРІС‹Рј!
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
              РЈРґР°Р»РёС‚СЊ РѕС‚Р·С‹РІ
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
                {formattedPrice} в‚Ѕ
              </div>

              <span className="contact-subtitle">
                {isRent ? "РђСЂРµРЅРґР° РєРІР°СЂС‚РёСЂС‹" : "РџСЂРѕРґР°Р¶Р° РєРІР°СЂС‚РёСЂС‹"}
              </span>

              {token ? (
  <form className="appointment-form" onSubmit={submitAppointment}>
    <h3>Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕСЃРјРѕС‚СЂ</h3>

    <label htmlFor="appointment-date">
      Р–РµР»Р°РµРјР°СЏ РґР°С‚Р° Рё РІСЂРµРјСЏ
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
      РЎРѕРѕР±С‰РµРЅРёРµ РІР»Р°РґРµР»СЊС†Сѓ
    </label>

    <textarea
      id="appointment-message"
      value={appointmentMessage}
      onChange={(event) => setAppointmentMessage(event.target.value)}
      placeholder="РќР°РїСЂРёРјРµСЂ, С…РѕС‚РµР» Р±С‹ РїРѕСЃРјРѕС‚СЂРµС‚СЊ РєРІР°СЂС‚РёСЂСѓ РІРµС‡РµСЂРѕРј..."
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
      {appointmentSubmitting ? "РћС‚РїСЂР°РІРєР°..." : "РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ"}
    </button>
  </form>
) : (
  <>
    <p>Р’РѕР№РґРёС‚Рµ РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ Р·Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕСЃРјРѕС‚СЂ.</p>

    <Link to="/login" className="contact-button">
      Р’РѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚
    </Link>
  </>
)}
              <div className="contact-note">
                <ShieldCheck size={17} />
                HOMELY РїРѕРјРѕРіР°РµС‚ РІС‹Р±СЂР°С‚СЊ Р¶РёР»СЊС‘ РѕСЃРѕР·РЅР°РЅРЅРѕ
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PropertyDetails;

