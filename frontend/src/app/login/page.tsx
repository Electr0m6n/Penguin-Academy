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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un parámetro de consulta 'registered=true'
    const urlParams = new URLSearchParams(window.location.search);
    const registered = urlParams.get('registered');
    
    if (registered === 'true') {
      setSuccessMessage('Cuenta creada exitosamente. Por favor, inicia sesión.');
      
      // Limpiar el parámetro de la URL sin recargar la página
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // Temporizador para limpiar mensajes de error
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    
    // Temporizador para limpiar mensajes de éxito
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleLogin = async (identifier: string, password: string) => {
    if (!identifier || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

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
        return;
      }
    }

    setSuccessMessage('Usuario autenticado exitosamente.');
    console.log('Usuario autenticado');
    window.location.href = '/'; // Cambia esto a la ruta deseada
  };

  const handlePasswordRecovery = async (identifier: string) => {
    if (!identifier) {
      setErrorMessage('Por favor, ingresa tu correo electrónico o nombre de usuario para recuperar tu contraseña.');
      return;
    }

    let email = identifier;
    
    // Verificar si el identificador es un nombre de usuario
    if (!identifier.includes('@')) {
      // Buscar el correo asociado al nombre de usuario
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .single();

      if (error || !data) {
        setErrorMessage('No se encontró ninguna cuenta con ese nombre de usuario.');
        return;
      }
      
      email = data.email;
    }

    // Enviar correo de recuperación de contraseña con plantilla personalizada
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      // La plantilla de correo electrónico se configura en el panel de Supabase
    });

    if (error) {
      console.error('Error al enviar correo de recuperación:', error.message);
      setErrorMessage('Error al enviar el correo de recuperación. Inténtalo de nuevo más tarde.');
      return;
    }

    setSuccessMessage('Se ha enviado un correo de recuperación a tu dirección de correo electrónico.');
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
        onPasswordRecovery={handlePasswordRecovery}
        onGoogleLogin={handleGoogleLogin}
        onGithubLogin={handleGithubLogin}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </main>
  )
} 