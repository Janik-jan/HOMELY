
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LogOut,
  Home,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import Header from "../components/Header";
import "./Auth.css";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
const [appointments, setAppointments] = useState([]);
const [receivedAppointments, setReceivedAppointments] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
  profileResponse,
  propertiesResponse,
  appointmentsResponse,
  receivedResponse,
] = await Promise.all([
  fetch("/api/me", { headers }),
  fetch("/api/my/properties", { headers }),
  fetch("/api/my/appointments", { headers }),
  fetch("/api/my/received-appointments", { headers }),
]);

        if (!profileResponse.ok || !propertiesResponse.ok) {
          localStorage.removeItem("authToken");
          setUser(null);
          return;
        }

        const profileData = await profileResponse.json();
const propertiesData = await propertiesResponse.json();

const appointmentsData = appointmentsResponse.ok
  ? await appointmentsResponse.json()
  : { appointments: [] };

const receivedData = receivedResponse.ok
  ? await receivedResponse.json()
  : { appointments: [] };

setUser(profileData.user || profileData);
setProperties(propertiesData.properties || []);
setAppointments(appointmentsData.appointments || []);
setReceivedAppointments(receivedData.appointments || []);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function deleteProperty(id) {
    const confirmed = window.confirm(
      "Вы действительно хотите удалить это объявление?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `/api/properties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Не удалось удалить объявление");
        return;
      }

      setProperties((previous) =>
        previous.filter((property) => property.id !== id)
      );
    } catch {
      alert("Ошибка соединения с сервером");
    }
  }
// Одобрение или отклонение заявки
async function updateAppointmentStatus(id, status) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `/api/appointments/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Не удалось изменить статус заявки");
      return;
    }

    setReceivedAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment
      )
    );
  } catch {
    alert("Ошибка соединения с сервером");
  }
}
  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-container">
        <div className="auth-box profile-box">
          {loading ? (
            <p>Загрузка профиля...</p>
          ) : user ? (
            <>
              <div className="auth-icon">
                <UserRound size={27} />
              </div>

              <h1>Личный кабинет</h1>

              <p className="auth-subtitle">
                Управляйте аккаунтом и своими объявлениями.
              </p>

              <div className="profile-info">
                <div className="profile-row">
                  <UserRound size={20} />
                  <div>
                    <span>Имя</span>
                    <strong>{user.name || "Пользователь"}</strong>
                  </div>
                </div>

                <div className="profile-row">
                  <Mail size={20} />
                  <div>
                    <span>Электронная почта</span>
                    <strong>{user.email}</strong>
                  </div>
                </div>
              </div>

              <div className="profile-property-heading">
                <div>
                  <h2>Мои объявления</h2>
                  <p>Опубликовано: {properties.length}</p>
                </div>

                <Link to="/add-property" className="profile-add-button">
                  <Plus size={17} /> Разместить
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="profile-empty">
                  <Home size={30} />
                  <p>У вас пока нет объявлений.</p>
                  <span>Разместите первое объявление о недвижимости.</span>
                </div>
              ) : (
                <div className="profile-property-list">
                  {properties.map((property) => (
                    <div className="profile-property" key={property.id}>
                      <img src={property.image} alt={property.title} />

                      <div className="profile-property-info">
                        <strong>{property.title}</strong>

                        <span>
                          <MapPin size={14} />
                          {property.address}
                        </span>

                        <b>
                          {Number(property.price).toLocaleString("ru-RU")} ₽
                          {property.deal_type === "rent" ? " / мес." : ""}
                        </b>

                        <Link to={`/property/${property.id}`}>
                          Посмотреть объявление
                        </Link>
                      </div>

                      <button
                        className="profile-delete-button"
                        onClick={() => deleteProperty(property.id)}
                        title="Удалить объявление"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
{/* Полученные заявки */}
<section className="appointments-section">
  <h2>Заявки на мои объявления</h2>

  {receivedAppointments.length === 0 ? (
    <p className="appointments-empty">
      Пока никто не записался на просмотр ваших объектов.
    </p>
  ) : (
    <div className="appointments-list">
      {receivedAppointments.map((appointment) => (
        <div className="appointment-card" key={appointment.id}>
          <strong>{appointment.property_title}</strong>

          <p>
            <MapPin size={15} />
            {appointment.property_address}
          </p>

          <p>
            Заявитель: {appointment.requester_name}
          </p>

          <p>
            Email: {appointment.requester_email}
          </p>

          <p>
            Дата просмотра:{" "}
            {new Date(appointment.appointment_at).toLocaleString("ru-RU")}
          </p>

          {appointment.message && (
            <p>Сообщение: {appointment.message}</p>
          )}

          <p>
            Статус: <strong>
              {appointment.status === "pending"
                ? "Ожидает ответа"
                : appointment.status === "approved"
                ? "Одобрена"
                : "Отклонена"}
            </strong>
          </p>

          {appointment.status === "pending" && (
            <div className="appointment-actions">
              <button
                onClick={() =>
                  updateAppointmentStatus(appointment.id, "approved")
                }
              >
                Одобрить
              </button>

              <button
                onClick={() =>
                  updateAppointmentStatus(appointment.id, "rejected")
                }
              >
                Отклонить
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</section>

{/* Отправленные заявки */}
<section className="appointments-section">
  <h2>Мои заявки на просмотр</h2>

  {appointments.length === 0 ? (
    <p className="appointments-empty">
      Вы пока не записывались на просмотр недвижимости.
    </p>
  ) : (
    <div className="appointments-list">
      {appointments.map((appointment) => (
        <div className="appointment-card" key={appointment.id}>
          <strong>{appointment.property_title}</strong>

          <p>
            <MapPin size={15} />
            {appointment.property_address}
          </p>

          <p>
            Дата просмотра:{" "}
            {new Date(appointment.appointment_at).toLocaleString("ru-RU")}
          </p>

          {appointment.message && (
            <p>Ваше сообщение: {appointment.message}</p>
          )}
          {appointment.status === "approved" && (
  <div className="owner-contacts">
    <strong>Контакты владельца:</strong>

    <p>Имя: {appointment.owner_name || "Не указано"}</p>

    <p>
      Email:{" "}
      {appointment.owner_email ? (
        <a href={`mailto:${appointment.owner_email}`}>
          {appointment.owner_email}
        </a>
      ) : (
        "Не указан"
      )}
    </p>
  </div>
)}
          <p>
            Статус: <strong>
              {appointment.status === "pending"
                ? "Ожидает ответа"
                : appointment.status === "approved"
                ? "Одобрена"
                : "Отклонена"}
            </strong>
          </p>
        </div>
      ))}
    </div>
  )}
</section>
              <Link to="/catalog" className="profile-catalog">
                <Home size={18} /> Перейти в каталог
              </Link>

              <button className="profile-logout" onClick={logout}>
                <LogOut size={18} /> Выйти из аккаунта
              </button>
            </>
          ) : (
            <>
              <div className="auth-icon">
                <UserRound size={27} />
              </div>

              <h1>Вы не вошли в аккаунт</h1>

              <p className="auth-subtitle">
                Войдите или зарегистрируйтесь, чтобы пользоваться личным кабинетом.
              </p>

              <Link to="/login" className="auth-submit auth-link-button">
                Войти
              </Link>

              <p className="auth-bottom">
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
