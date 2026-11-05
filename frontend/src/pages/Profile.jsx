
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
      "Р’С‹ РґРµР№СЃС‚РІРёС‚РµР»СЊРЅРѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ СЌС‚Рѕ РѕР±СЉСЏРІР»РµРЅРёРµ?"
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
        alert(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ СѓРґР°Р»РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ");
        return;
      }

      setProperties((previous) =>
        previous.filter((property) => property.id !== id)
      );
    } catch {
      alert("РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ СЃ СЃРµСЂРІРµСЂРѕРј");
    }
  }
// РћРґРѕР±СЂРµРЅРёРµ РёР»Рё РѕС‚РєР»РѕРЅРµРЅРёРµ Р·Р°СЏРІРєРё
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
      alert(data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ РёР·РјРµРЅРёС‚СЊ СЃС‚Р°С‚СѓСЃ Р·Р°СЏРІРєРё");
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
    alert("РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ СЃ СЃРµСЂРІРµСЂРѕРј");
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
            <p>Р—Р°РіСЂСѓР·РєР° РїСЂРѕС„РёР»СЏ...</p>
          ) : user ? (
            <>
              <div className="auth-icon">
                <UserRound size={27} />
              </div>

              <h1>Р›РёС‡РЅС‹Р№ РєР°Р±РёРЅРµС‚</h1>

              <p className="auth-subtitle">
                РЈРїСЂР°РІР»СЏР№С‚Рµ Р°РєРєР°СѓРЅС‚РѕРј Рё СЃРІРѕРёРјРё РѕР±СЉСЏРІР»РµРЅРёСЏРјРё.
              </p>

              <div className="profile-info">
                <div className="profile-row">
                  <UserRound size={20} />
                  <div>
                    <span>РРјСЏ</span>
                    <strong>{user.name || "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ"}</strong>
                  </div>
                </div>

                <div className="profile-row">
                  <Mail size={20} />
                  <div>
                    <span>Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РїРѕС‡С‚Р°</span>
                    <strong>{user.email}</strong>
                  </div>
                </div>
              </div>

              <div className="profile-property-heading">
                <div>
                  <h2>РњРѕРё РѕР±СЉСЏРІР»РµРЅРёСЏ</h2>
                  <p>РћРїСѓР±Р»РёРєРѕРІР°РЅРѕ: {properties.length}</p>
                </div>

                <Link to="/add-property" className="profile-add-button">
                  <Plus size={17} /> Р Р°Р·РјРµСЃС‚РёС‚СЊ
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="profile-empty">
                  <Home size={30} />
                  <p>РЈ РІР°СЃ РїРѕРєР° РЅРµС‚ РѕР±СЉСЏРІР»РµРЅРёР№.</p>
                  <span>Р Р°Р·РјРµСЃС‚РёС‚Рµ РїРµСЂРІРѕРµ РѕР±СЉСЏРІР»РµРЅРёРµ Рѕ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё.</span>
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
                          {Number(property.price).toLocaleString("ru-RU")} в‚Ѕ
                          {property.deal_type === "rent" ? " / РјРµСЃ." : ""}
                        </b>

                        <Link to={`/property/${property.id}`}>
                          РџРѕСЃРјРѕС‚СЂРµС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ
                        </Link>
                      </div>

                      <button
                        className="profile-delete-button"
                        onClick={() => deleteProperty(property.id)}
                        title="РЈРґР°Р»РёС‚СЊ РѕР±СЉСЏРІР»РµРЅРёРµ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
{/* РџРѕР»СѓС‡РµРЅРЅС‹Рµ Р·Р°СЏРІРєРё */}
<section className="appointments-section">
  <h2>Р—Р°СЏРІРєРё РЅР° РјРѕРё РѕР±СЉСЏРІР»РµРЅРёСЏ</h2>

  {receivedAppointments.length === 0 ? (
    <p className="appointments-empty">
      РџРѕРєР° РЅРёРєС‚Рѕ РЅРµ Р·Р°РїРёСЃР°Р»СЃСЏ РЅР° РїСЂРѕСЃРјРѕС‚СЂ РІР°С€РёС… РѕР±СЉРµРєС‚РѕРІ.
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
            Р—Р°СЏРІРёС‚РµР»СЊ: {appointment.requester_name}
          </p>

          <p>
            Email: {appointment.requester_email}
          </p>

          <p>
            Р”Р°С‚Р° РїСЂРѕСЃРјРѕС‚СЂР°:{" "}
            {new Date(appointment.appointment_at).toLocaleString("ru-RU")}
          </p>

          {appointment.message && (
            <p>РЎРѕРѕР±С‰РµРЅРёРµ: {appointment.message}</p>
          )}

          <p>
            РЎС‚Р°С‚СѓСЃ: <strong>
              {appointment.status === "pending"
                ? "РћР¶РёРґР°РµС‚ РѕС‚РІРµС‚Р°"
                : appointment.status === "approved"
                ? "РћРґРѕР±СЂРµРЅР°"
                : "РћС‚РєР»РѕРЅРµРЅР°"}
            </strong>
          </p>

          {appointment.status === "pending" && (
            <div className="appointment-actions">
              <button
                onClick={() =>
                  updateAppointmentStatus(appointment.id, "approved")
                }
              >
                РћРґРѕР±СЂРёС‚СЊ
              </button>

              <button
                onClick={() =>
                  updateAppointmentStatus(appointment.id, "rejected")
                }
              >
                РћС‚РєР»РѕРЅРёС‚СЊ
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</section>

{/* РћС‚РїСЂР°РІР»РµРЅРЅС‹Рµ Р·Р°СЏРІРєРё */}
<section className="appointments-section">
  <h2>РњРѕРё Р·Р°СЏРІРєРё РЅР° РїСЂРѕСЃРјРѕС‚СЂ</h2>

  {appointments.length === 0 ? (
    <p className="appointments-empty">
      Р’С‹ РїРѕРєР° РЅРµ Р·Р°РїРёСЃС‹РІР°Р»РёСЃСЊ РЅР° РїСЂРѕСЃРјРѕС‚СЂ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё.
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
            Р”Р°С‚Р° РїСЂРѕСЃРјРѕС‚СЂР°:{" "}
            {new Date(appointment.appointment_at).toLocaleString("ru-RU")}
          </p>

          {appointment.message && (
            <p>Р’Р°С€Рµ СЃРѕРѕР±С‰РµРЅРёРµ: {appointment.message}</p>
          )}
          {appointment.status === "approved" && (
  <div className="owner-contacts">
    <strong>РљРѕРЅС‚Р°РєС‚С‹ РІР»Р°РґРµР»СЊС†Р°:</strong>

    <p>РРјСЏ: {appointment.owner_name || "РќРµ СѓРєР°Р·Р°РЅРѕ"}</p>

    <p>
      Email:{" "}
      {appointment.owner_email ? (
        <a href={`mailto:${appointment.owner_email}`}>
          {appointment.owner_email}
        </a>
      ) : (
        "РќРµ СѓРєР°Р·Р°РЅ"
      )}
    </p>
  </div>
)}
          <p>
            РЎС‚Р°С‚СѓСЃ: <strong>
              {appointment.status === "pending"
                ? "РћР¶РёРґР°РµС‚ РѕС‚РІРµС‚Р°"
                : appointment.status === "approved"
                ? "РћРґРѕР±СЂРµРЅР°"
                : "РћС‚РєР»РѕРЅРµРЅР°"}
            </strong>
          </p>
        </div>
      ))}
    </div>
  )}
</section>
              <Link to="/catalog" className="profile-catalog">
                <Home size={18} /> РџРµСЂРµР№С‚Рё РІ РєР°С‚Р°Р»РѕРі
              </Link>

              <button className="profile-logout" onClick={logout}>
                <LogOut size={18} /> Р’С‹Р№С‚Рё РёР· Р°РєРєР°СѓРЅС‚Р°
              </button>
            </>
          ) : (
            <>
              <div className="auth-icon">
                <UserRound size={27} />
              </div>

              <h1>Р’С‹ РЅРµ РІРѕС€Р»Рё РІ Р°РєРєР°СѓРЅС‚</h1>

              <p className="auth-subtitle">
                Р’РѕР№РґРёС‚Рµ РёР»Рё Р·Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ, С‡С‚РѕР±С‹ РїРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ Р»РёС‡РЅС‹Рј РєР°Р±РёРЅРµС‚РѕРј.
              </p>

              <Link to="/login" className="auth-submit auth-link-button">
                Р’РѕР№С‚Рё
              </Link>

              <p className="auth-bottom">
                РќРµС‚ Р°РєРєР°СѓРЅС‚Р°? <Link to="/register">Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;

