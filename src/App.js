import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// 🔐 Tus credenciales
const supabaseUrl = 'https://bcotgxupjyocbxjdtsaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb3RneHVwanlvY2J4amR0c2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjAzNTQsImV4cCI6MjA2OTQ5NjM1NH0.TXLUSaNlWQCYdBEUHGi0uzO-OwMkWcEiPOQmThKpFkA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLogin,
        password: passwordLogin
      });

      if (error) throw error;

      alert('✅ Sesión iniciada como ' + data.user.email);
      setEmailLogin('');
      setPasswordLogin('');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const registrar = async (e) => {
    e.preventDefault();
    try {
      // 1. Registrar en Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // 2. Guardar en tabla 'usuarios'
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([{ id: data.user.id, email, nombre }]);

      if (profileError) throw profileError;

      alert('✅ Registro exitoso');
    } catch (error) {
      if (error.message.includes('User already registered')) {
        alert('⚠️ Este correo ya está registrado. ¿Quieres iniciar sesión?');
      } else {
        alert('❌ Error: ' + error.message);
      }
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
      <form onSubmit={iniciarSesion}>
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
    </div>
  );
}

export default App;