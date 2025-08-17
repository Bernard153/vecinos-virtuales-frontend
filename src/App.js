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

  const registrar = async (e) => {
    e.preventDefault();
    console.log("Intentando registrar..."); // 👈 Depuración

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
           { nombre }
        }
      });

      if (error) throw error;

      console.log("Usuario registrado:", data);

      alert('✅ Registro exitoso');
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error.message);
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Prueba de Registro</h1>
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
    </div>
  );
}