'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleRegister = async (username: string, email: string, password: string) => {
    if (!email || !password || !username) {
      setErrorMessage('Por favor, completa todos los campos.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    // Verificar unicidad del nombre de usuario
    const { data: usernameData, error: usernameError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username);

    if (usernameError) {
      setErrorMessage('Error al verificar el nombre de usuario.');
      console.error('Error al verificar el nombre de usuario:', usernameError.message);
      return;
    }

    if (usernameData && usernameData.length > 0) {
      setErrorMessage('El nombre de usuario ya está en uso. Por favor, elige otro.');
      return;
    }

    // Verificar unicidad del correo electrónico
    const { data: emailData, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);

    if (emailError) {
      setErrorMessage('Error al verificar el correo electrónico.');
      console.error('Error al verificar el correo electrónico:', emailError.message);
      return;
    }

    if (emailData && emailData.length > 0) {
      setErrorMessage('El correo electrónico ya está registrado. Por favor, elige otro.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setErrorMessage('El correo electrónico ya está registrado.')
      } else {
        setErrorMessage(error.message)
      }
      console.error('Error al crear la cuenta:', error.message)
      return
    }

    // Inserta el usuario en la tabla de usuarios, incluyendo la contraseña
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ username, email, password }])

    if (insertError) {
      setErrorMessage('Error al guardar la información del usuario.')
      console.error('Error al insertar en la tabla de usuarios:', insertError.message)
    } else {
      setSuccessMessage('Usuario creado exitosamente.')
      console.log('Usuario creado:', data.user)
      window.location.href = '/'
    }
  }

  const handleGoogleRegister = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMessage(error.message);
      console.error('Error al registrarse con Google:', error.message);
    } else {
      setSuccessMessage('Usuario registrado exitosamente con Google.');
      console.log('Usuario registrado con Google:', data);
      window.location.href = '/'; // Cambia esto a la ruta deseada
    }
  }

  const handleGithubRegister = async () => {
    // TODO: Implementar registro con GitHub
    console.log('GitHub register')
  }

  return (
    <main>
      <AuthBackground />
      <RegisterForm
        onSubmit={handleRegister}
        onGoogleRegister={handleGoogleRegister}
        onGithubRegister={handleGithubRegister}
        errorMessage={errorMessage}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </main>
  )
} 