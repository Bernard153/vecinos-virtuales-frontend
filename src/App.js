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