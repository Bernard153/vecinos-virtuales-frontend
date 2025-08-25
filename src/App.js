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
  const [tipo, setTipo] = useState('común'); // común, oficio, profesional, auspiciante

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

      // Guardar perfil con tipo de usuario
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([{ 
          id: data.user.id, 
          email, 
          nombre, 
          tipo_usuario: tipo,
          fecha_registro: new Date() 
        }]);

      if (profileError) throw profileError;

      alert(`✅ Registro exitoso: ${data.user.email} como ${tipo}`);
      setEmail('');
      setPassword('');
      setNombre('');
    } catch (error) {
      if (error.message.includes('User already registered')) {
        alert('⚠️ Este correo ya está registrado. ¿Quieres iniciar sesión?');
      } else {
        alert('❌ Error: ' + error.message);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Vecinos Virtuales</h1>
      <p>Regístrate según tu rol</p>

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
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ display: 'block', margin: '10px 0' }}
        >
          <option value="común">Usuario Común</option>
          <option value="oficio">Usuario Oficio</option>
          <option value="profesional">Usuario Profesional</option>
          <option value="auspiciante">Auspiciante / Mayorista / Ente</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}