import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [alertas, setAlertas] = useState([]);

  // ✅ Cargar alertas
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch('https://vecinos-virtuales-backend-fin.onrender.com/api/alertas');
        const data = await res.json();
        setAlertas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };
    cargar();
  }, []);

  const registrar = async (e) => {
    e.preventDefault();
    alert('✅ Registro no implementado en este ejemplo');
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    alert('✅ Inicio de sesión no implementado en este ejemplo');
  };

  const enviarAlerta = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const alerta = Object.fromEntries(formData);

    try {
      const res = await fetch('https://vecinos-virtuales-backend-fin.onrender.com/api/alertas', {
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
        alert('✅ Alerta enviada');
        e.target.reset();
        // Recargar
        const nuevas = await (await fetch('https://vecinos-virtuales-backend-fin.onrender.com/api/alertas')).json();
        setAlertas(Array.isArray(nuevas) ? nuevas : []);
      } else {
        alert('❌ Error al enviar');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Vecinos Virtuales</h1>

      <form onSubmit={registrar} style={{ marginBottom: '40px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '10px', margin: '5px' }} />
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', margin: '5px' }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', margin: '5px' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrarse
        </button>
      </form>

      <form onSubmit={iniciarSesion} style={{ marginBottom: '40px' }}>
        <input type="email" placeholder="Correo" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} required style={{ padding: '10px', margin: '5px' }} />
        <input type="password" placeholder="Contraseña" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} required style={{ padding: '10px', margin: '5px' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>

      <form onSubmit={enviarAlerta}>
        <select name="barrio_id" required style={{ margin: '10px', padding: '10px' }}>
          <option value="">Selecciona un barrio</option>
          <option value="1">San Miguel</option>
          <option value="2">Centro</option>
        </select>
        <input name="tipo" type="text" placeholder="Tipo de alerta" required style={{ margin: '10px', padding: '10px' }} />
        <textarea name="descripcion" placeholder="Describe la situación..." rows="3" required style={{ margin: '10px', padding: '10px' }} />
        <input name="lat" type="text" placeholder="Latitud (opcional)" style={{ margin: '10px', padding: '10px' }} />
        <input name="lng" type="text" placeholder="Longitud (opcional)" style={{ margin: '10px', padding: '10px' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Enviar Alerta
        </button>
      </form>

      <h3>Alertas Recientes</h3>
      {alertas.length === 0 ? (
        <p>No hay alertas</p>
      ) : (
        alertas.map((a) => (
          <div key={a.id} style={{ border: '1px solid #ccc', margin: '10px auto', padding: '10px', width: '80%', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <strong>{a.tipo}</strong>: {a.descripcion}
            <br />
            <small>Barrio: {a.barrio_id}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;