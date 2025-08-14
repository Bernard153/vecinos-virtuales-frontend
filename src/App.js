import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [alertas, setAlertas] = useState([]);
  const [barrioUsuario, setBarrioUsuario] = useState('');

  // ✅ Detectar ubicación del usuario
  useEffect(() => {
    const detectarUbicacion = () => {
      if (!navigator.geolocation) {
        console.log("Geolocalización no soportada");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            const barrio = 
              data.address.suburb || 
              data.address.neighbourhood || 
              data.address.hamlet || 
              data.address.town || 
              data.address.village || 
              'Lomas de Tafi'; // Barrio por defecto

            setBarrioUsuario(barrio);
            localStorage.setItem('barrioUsuario', barrio);
            console.log("Barrio detectado:", barrio);
          } catch (error) {
            console.error("Error al obtener el barrio:", error);
            setBarrioUsuario('Lomas de Tafi');
            localStorage.setItem('barrioUsuario', 'Lomas de Tafi');
          }
        },
        (error) => {
          console.log("Permiso denegado o error:", error.message);
          const guardado = localStorage.getItem('barrioUsuario') || 'Lomas de Tafi';
          setBarrioUsuario(guardado);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    };

    const guardado = localStorage.getItem('barrioUsuario');
    if (guardado) {
      setBarrioUsuario(guardado);
    } else {
      detectarUbicacion();
    }
  }, []);

  // ✅ Cargar alertas filtradas por barrio
  useEffect(() => {
    if (!barrioUsuario) return;

    const cargarAlertas = async () => {
      try {
        const res = await fetch(
          `https://vecinos-virtuales-backend.onrender.com/api/alertas?barrio=${encodeURIComponent(barrioUsuario)}`
        );
        const data = await res.json();
        setAlertas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };

    cargarAlertas();
  }, [barrioUsuario]);

  // ✅ Registrar usuario
  const registrar = async (e) => {
    e.preventDefault();
    alert('✅ Registro no implementado en este ejemplo');
    setNombre('');
    setEmail('');
    setPassword('');
  };

  // ✅ Iniciar sesión
  const iniciarSesion = async (e) => {
    e.preventDefault();
    alert('✅ Inicio de sesión no implementado en este ejemplo');
    setEmailLogin('');
    setPasswordLogin('');
  };

  // ✅ Enviar alerta
  const enviarAlerta = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const alerta = Object.fromEntries(formData);

    try {
      const res = await fetch('https://vecinos-virtuales-backend.onrender.com/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barrio: barrioUsuario,
          barrio_id: parseInt(alerta.barrio_id),
          tipo: alerta.tipo,
          descripcion: alerta.descripcion,
          lat: alerta.lat ? parseFloat(alerta.lat) : null,
          lng: alerta.lng ? parseFloat(alerta.lng) : null
        })
      });

      if (res.ok) {
        alert('✅ Alerta enviada con éxito');
        e.target.reset();
        const nuevas = await (await fetch(`https://vecinos-virtuales-backend.onrender.com/api/alertas?barrio=${encodeURIComponent(barrioUsuario)}`)).json();
        setAlertas(Array.isArray(nuevas) ? nuevas : []);
      } else {
        alert('❌ Error al enviar la alerta');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Vecinos Virtuales</h1>

      {barrioUsuario && (
        <p style={{ color: '#007bff', fontWeight: 'bold' }}>
          Bienvenido a {barrioUsuario}
        </p>
      )}

      {/* Formulario de registro */}
      <p>Regístrate como vecino</p>
      <form onSubmit={registrar} style={{ marginBottom: '40px' }}>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Registrarse
        </button>
      </form>

      {/* Formulario de inicio de sesión */}
      <h3>Iniciar sesión</h3>
      <form onSubmit={iniciarSesion} style={{ marginBottom: '40px' }}>
        <div style={{ margin: '10px 0' }}>
          <input
            type="email"
            placeholder="Correo"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Formulario de alertas */}
      <h3>Enviar una alerta comunitaria</h3>
      <form onSubmit={enviarAlerta}>
        <select name="barrio_id" required style={{ margin: '10px', padding: '10px' }}>
          <option value="">Selecciona un barrio</option>
          <option value="1">San Miguel</option>
          <option value="2">Centro</option>
        </select>
        <input
          name="tipo"
          type="text"
          placeholder="Tipo de alerta"
          required
          style={{ margin: '10px', padding: '10px' }}
        />
        <textarea
          name="descripcion"
          placeholder="Describe la situación..."
          rows="3"
          required
          style={{ margin: '10px', padding: '10px' }}
        />
        <input
          name="lat"
          type="text"
          placeholder="Latitud (opcional)"
          style={{ margin: '10px', padding: '10px' }}
        />
        <input
          name="lng"
          type="text"
          placeholder="Longitud (opcional)"
          style={{ margin: '10px', padding: '10px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar Alerta
        </button>
      </form>

      {/* Mostrar alertas */}
      <h3>Alertas Recientes</h3>
      {alertas.length === 0 ? (
        <p>No hay alertas aún</p>
      ) : (
        alertas.map((alerta) => (
          <div
            key={alerta.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px auto',
              padding: '10px',
              width: '80%',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              textAlign: 'left'
            }}
          >
            <strong>{alerta.tipo}</strong>: {alerta.descripcion}
            <br />
            <small>Barrio: {alerta.barrio || alerta.barrio_id} | {new Date(alerta.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;