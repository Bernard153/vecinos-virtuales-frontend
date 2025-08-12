import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [alertas, setAlertas] = useState([]);

  // ✅ Cargar alertas al iniciar
  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        const res = await fetch('https://vecinos-virtuales-backend.onrender.com/api/alertas');
        const data = await res.json();
        setAlertas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };
    cargarAlertas();
  }, []);

  // ✅ Iniciar sesión (simulado)
  const iniciarSesion = async (e) => {
    e.preventDefault();
    alert('✅ Inicio de sesión no implementado en este ejemplo');
    setEmailLogin('');
    setPasswordLogin('');
  };

  // ✅ Registrar usuario (simulado)
  const registrar = async (e) => {
    e.preventDefault();
    alert('✅ Registro no implementado en este ejemplo');
    setNombre('');
    setEmail('');
    setPassword('');
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
        // Recargar alertas
        const nuevas = await (await fetch('https://vecinos-virtuales-backend.onrender.com/api/alertas')).json();
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
            <small>Barrio: {alerta.barrio_id} | {new Date(alerta.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;