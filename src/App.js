import React, { useState, useEffect } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [alertas, setAlertas] = useState([]);

  // Cargar alertas del backend en Railway
  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        const res = await fetch('https://vecinos-virtuales.up.railway.app/api/alertas?barrio_id=1');
        const data = await res.json();
        setAlertas(data);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
        setAlertas([]);
      }
    };
    cargarAlertas();
  }, []);

  // ✅ Registrar usuario (envía al backend)
  const registrar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://vecinos-virtuales.up.railway.app/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, tipo_usuario: 'común' })
      });

      if (res.ok) {
        alert('✅ Registro exitoso: ' + email);
        setNombre('');
        setEmail('');
        setPassword('');
      } else {
        const error = await res.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  // ✅ Enviar alerta al backend
  const enviarAlerta = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tipo = formData.get('tipo');
    const descripcion = formData.get('descripcion');

    try {
      const res = await fetch('https://vecinos-virtuales.up.railway.app/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barrio_id: 1,
          tipo,
          descripcion,
          lat: null,
          lng: null
        })
      });

      if (res.ok) {
        alert('✅ Alerta enviada');
        e.target.reset();
        // Recargar alertas
        const nuevas = await (await fetch('https://vecinos-virtuales.up.railway.app/api/alertas?barrio_id=1')).json();
        setAlertas(nuevas);
      } else {
        alert('❌ Error al enviar la alerta');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#007bff' }}>Vecinos Virtuales</h1>
      <p><strong>Presentación oficial – Congreso de Tecnología 2025</strong></p>

      {/* Registro */}
      <h3>Regístrate como Vecino</h3>
      <form onSubmit={registrar} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
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

      {/* Enviar alerta */}
      <h3>Enviar Alerta Comunitaria</h3>
      <form onSubmit={enviarAlerta} style={{ marginBottom: '20px' }}>
        <input
          name="tipo"
          placeholder="Tipo de alerta"
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <textarea
          name="descripcion"
          placeholder="Describe la situación..."
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar Alerta
        </button>
      </form>

      {/* Alertas */}
      <h3>Alertas Recientes</h3>
      {alertas.length === 0 ? (
        <p>No hay alertas aún</p>
      ) : (
        alertas.map(a => (
          <div
            key={a.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <strong>{a.tipo}</strong>: {a.descripcion}
            <br />
            <small>{new Date(a.fecha).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}