'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLogin = async (identifier: string, password: string) => {
    if (!identifier || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    console.log('Intentando iniciar sesión con:', identifier, password);

    // Primero, intentamos iniciar sesión con el correo electrónico
    const { error: emailError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (emailError) {
      // Si falla, intentamos iniciar sesión con el nombre de usuario
      const { data, error: usernameError } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .single();

      if (usernameError || !data) {
        console.error('Error al iniciar sesión:', usernameError ? usernameError.message : 'Nombre de usuario no encontrado.');
        setErrorMessage('Nombre de usuario o contraseña incorrectos.');
        setLoading(false);
        return;
      }

      // Si encontramos el correo asociado al nombre de usuario, intentamos iniciar sesión
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          setErrorMessage('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
        } else {
          console.error('Error al iniciar sesión:', error.message);
          setErrorMessage('Nombre de usuario o contraseña incorrectos.');
        }
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccessMessage('Usuario autenticado exitosamente.');
    console.log('Usuario autenticado');
    window.location.href = '/'; // Cambia esto a la ruta deseada
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error al iniciar sesión con Google:', error.message);
    } else {
      setSuccessMessage('Usuario autenticado exitosamente con Google.');
      console.log('Usuario autenticado con Google:', data);
      window.location.href = '/'; // Cambia esto a la ruta deseada
    }
  };

  const handleGithubLogin = async () => {
    // TODO: Implementar inicio de sesión con GitHub
    console.log('GitHub login')
  }

  return (
    <main>
      <AuthBackground />
      <LoginForm
        onSubmit={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onGithubLogin={handleGithubLogin}
        errorMessage={errorMessage}
      />
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <button type="submit" disabled={loading}>Iniciar Sesión</button>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
    </main>
  )
} 