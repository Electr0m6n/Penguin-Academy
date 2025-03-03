'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AuthBackground } from '@/components/auth/AuthBackground';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        // Redirigir a la página de inicio si no hay sesión
        window.location.href = '/login';
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      console.log('Sesión cerrada exitosamente.');
      window.location.href = '/login'; // Redirigir a la página de inicio de sesión
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <AuthBackground />
      <h1>Perfil</h1>
      <p>Bienvenido a tu perfil.</p>
      <p style={{ cursor: 'pointer', color: 'blue' }} onClick={handleLogout}>Cerrar sesión</p>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.user_metadata.full_name || 'No disponible'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID de Usuario:</strong> {user.id}</p>
          <p><strong>Nombre de Usuario:</strong> {user.user_metadata.username || 'No disponible'}</p>
          {/* Aquí puedes agregar más información del usuario si es necesario */}
        </div>
      ) : (
        <p>No se encontró información del usuario.</p>
      )}
    </div>
  );
} 