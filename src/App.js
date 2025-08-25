import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🔐 Credenciales corregidas (sin espacios)
const supabase = createClient(
  'https://bcotgxupjyocbxjdtsaa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb3RneHVwanlvY2J4amR0c2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjAzNTQsImV4cCI6MjA2OTQ5NjM1NH0.TXLUSaNlWQCYdBEUHGi0uzO-OwMkWcEiPOQmThKpFkA'
);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [alertas, setAlertas] = useState([
    { id: 1, tipo: 'Corte de luz', descripcion: 'En calle 5 y 6', fecha: new Date().toISOString() }
  ]);

  // ✅ Registro funcional
  const registrar = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            { nombre }
        }
      });

      if (error) throw error;

      alert('✅ Registro exitoso: ' + data.user.email);
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  // ✅ Enviar alerta (a backend o simulado)
  const enviar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tipo = formData.get('tipo');
    const descripcion = formData.get('descripcion');

    // Simulamos que se guardó
    setAlertas([
      { id: Date.now(), tipo, descripcion, fecha: new Date().toISOString() },
      ...alertas
    ]);

    alert('✅ Alerta enviada');
    e.target.reset();
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
      <form onSubmit={enviar} style={{ marginBottom: '20px' }}>
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
      {alertas.map(a => (
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
      ))}
    </div>
  );
}