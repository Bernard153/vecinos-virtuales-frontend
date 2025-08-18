import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🔐 Credenciales CORRECTAS (sin espacios)
const supabase = createClient(
  'https://bcotgxupjyocbxjdtsaa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb3RneHVwanlvY2J4amR0c2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjAzNTQsImV4cCI6MjA2OTQ5NjM1NH0.TXLUSaNlWQCYdBEUHGi0uzO-OwMkWcEiPOQmThKpFkA'
);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [alertas, setAlertas] = useState([]);
  const [barrioUsuario, setBarrioUsuario] = useState('Lomas de Tafi');

  // Cargar alertas
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch('https://vecinos-virtuales-backend.onrender.com/api/alertas?barrio_id=1');
        const data = await res.json();
        setAlertas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };
    cargar();
  }, []);

  // Registrar usuario
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Prueba de Registro</h1>
      <p>Bienvenido a {barrioUsuario}</p>

      <form onSubmit={registrar}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit">Registrar</button>
      </form>

      <h3>Alertas Recientes</h3>
      {alertas.map(a => (
        <div key={a.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: 10 }}>
          <strong>{a.tipo}</strong>: {a.descripcion}
        </div>
      ))}
    </div>
  );
}