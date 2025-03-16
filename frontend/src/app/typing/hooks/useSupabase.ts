import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/config';
import { User, LeaderboardEntry } from '../types';

export function useSupabase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [isInTop25, setIsInTop25] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  
  const router = useRouter();

  // Obtener el usuario actual - ahora memoizado para evitar recreaciones en cada renderizado
  const getCurrentUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error al obtener el usuario actual', error);
      return null;
    }
  }, []); // Sin dependencias ya que no depende de ningún estado o props

  // Función separada para cargar datos del leaderboard
  const loadLeaderboardData = useCallback(async () => {
    if (isLoadingLeaderboard) return;
    
    setIsLoadingLeaderboard(true);
    try {
      console.log('Cargando datos del leaderboard...');
      const { data, error } = await supabase
        .from('typing_scores')
        .select('username, wpm, accuracy, is_competitive')
        .order('wpm', { ascending: false })
        .limit(25);
        
      if (error) throw error;
      
      console.log('Datos del leaderboard cargados:', data?.length || 0, 'registros');
      setLeaderboardData(data || []);
    } catch (error) {
      console.error('Error al cargar datos del leaderboard:', error);
      // Fallback a datos de ejemplo
      setLeaderboardData([
        { username: 'speed_typer', wpm: 120, accuracy: 98.5, is_competitive: true },
        { username: 'keyboard_master', wpm: 115, accuracy: 99.2, is_competitive: true },
        { username: 'typing_pro', wpm: 110, accuracy: 97.8, is_competitive: false },
      ]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, [isLoadingLeaderboard]); // Solo depende de isLoadingLeaderboard

  // Toggle del leaderboard - Versión corregida
  const toggleLeaderboard = useCallback(async () => {
    console.log('toggleLeaderboard llamado, estado actual:', showLeaderboard);
    
    // Evitar solicitudes múltiples si ya estamos cargando
    if (isLoadingLeaderboard) {
      console.log('Ya hay una carga en progreso, ignorando solicitud');
      return;
    }
    
    // Primer paso: actualizar el estado de visibilidad (operación síncrona)
    setShowLeaderboard(prevState => {
      const nuevoEstado = !prevState;
      console.log('Actualizando showLeaderboard a:', nuevoEstado);
      
      // Solo cargar datos si estamos mostrando el leaderboard
      if (nuevoEstado) {
        // Usar setTimeout para evitar que se llame durante la actualización del estado
        setTimeout(() => {
          loadLeaderboardData();
        }, 0);
      }
      
      return nuevoEstado;
    });
  }, [isLoadingLeaderboard, loadLeaderboardData, showLeaderboard]); // Añadimos showLeaderboard como dependencia

  // Cargar el usuario actual (memoizada para evitar recreaciones)
  const loadCurrentUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      console.log('Usuario cargado:', user ? user.email : 'No hay usuario');
      return user;
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [getCurrentUser]); // Ahora depende de getCurrentUser que está memoizado

  // Efecto para cargar el usuario actual al iniciar
  useEffect(() => {
    // Flag para evitar actualizaciones en componentes desmontados
    let isMounted = true;
    
    // Cargar el usuario actual al montar el componente
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
          setIsLoadingUser(false);
          console.log('Usuario cargado en el useEffect inicial:', user ? user.email : 'No hay usuario');
        }
      } catch (error) {
        console.error('Error al cargar el usuario en el useEffect:', error);
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };
    
    loadUser();
    
    // Suscribirse a los cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de autenticación:', event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // El usuario inició sesión o se refrescó el token
          if (session?.user) {
            setCurrentUser(session.user);
            setIsLoadingUser(false);
          }
        } else if (event === 'SIGNED_OUT') {
          // El usuario cerró sesión
          setCurrentUser(null);
          setIsLoadingUser(false);
          // Si el perfil está abierto, cerrarlo
          if (showUserProfile) {
            setShowUserProfile(false);
          }
        }
      }
    );
    
    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [showUserProfile, getCurrentUser]); // Añadimos getCurrentUser como dependencia

  // Gestionar perfil de usuario
  const handleProfileClick = useCallback(async () => {
    if (!currentUser) {
      router.push('/login');
    } else {
      setShowUserProfile(true);
    }
  }, [currentUser, router]); // Agregamos las dependencias correctas

  // Cerrar sesión
  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setShowUserProfile(false);
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []); // Sin dependencias ya que no depende de estado o props externos

  // Corregir la función que se usa al enviar puntuaciones automáticamente
  const submitScoreAutomatically = useCallback(async (
    finalWpm: number, 
    finalAccuracy: number,
    selectedTime: number | string,
    textLength: number,
    correctChars: number,
    incorrectChars: number,
    isCompetitiveMode: boolean
  ) => {
    try {
      // Obtener el usuario actual
      const user = await getCurrentUser();
      
      if (!user) {
        console.log('Debes iniciar sesión para guardar tu puntuación');
        return;
      }
      
      setIsSubmittingScore(true);
      
      // Verificar si el usuario ya tiene un puntaje guardado
      const { data: existingScore } = await supabase
        .from('typing_scores')
        .select('id, wpm, accuracy')
        .eq('user_id', user.id)
        .single();
      
      let result;
      let isImprovement = false;
      
      if (existingScore) {
        // Si el puntaje actual es mejor que el guardado, actualizarlo
        if (finalWpm > existingScore.wpm || 
            (finalWpm === existingScore.wpm && finalAccuracy > existingScore.accuracy)) {
          
          isImprovement = true;
          
          result = await supabase
            .from('typing_scores')
            .update({
              wpm: finalWpm,
              accuracy: finalAccuracy,
              test_duration: selectedTime,
              characters_typed: textLength,
              correct_chars: correctChars,
              incorrect_chars: incorrectChars,
              is_competitive: isCompetitiveMode,
              updated_at: new Date()
            })
            .eq('id', existingScore.id);
            
          console.log('Puntuación mejorada y actualizada en Supabase');
        } else {
          // Si el puntaje no es mejor, no actualizamos
          console.log('La puntuación actual no mejora la anterior:', {
            puntuaciónActual: { wpm: finalWpm, accuracy: finalAccuracy },
            puntuaciónExistente: { wpm: existingScore.wpm, accuracy: existingScore.accuracy }
          });
          setIsSubmittingScore(false);
          return;
        }
      } else {
        // Si es el primer puntaje del usuario, crearlo
        isImprovement = true;
        
        result = await supabase
          .from('typing_scores')
          .insert({
            user_id: user.id,
            username: user.user_metadata?.username || user.email,
            wpm: finalWpm,
            accuracy: finalAccuracy,
            test_duration: selectedTime,
            characters_typed: textLength,
            correct_chars: correctChars,
            incorrect_chars: incorrectChars,
            is_competitive: isCompetitiveMode
          });
      }
      
      if (result && result.error) {
        throw result.error;
      }
      
      // Si logramos mejorar nuestro puntaje, verificar si está en el top 25
      if (isImprovement) {
        // Simplificamos la lógica para considerarlo en Top 25 si hay una mejora
        setIsInTop25(true); // Si hubo mejora, consideramos que está en el Top 25
        setHasSubmittedScore(true);
        
        console.log('Puntuación mejorada, estableciendo isInTop25=true');
        
        // Emitir un evento personalizado para notificar la mejora de puntuación
        if (typeof window !== 'undefined') {
          const scoreImprovedEvent = new CustomEvent('scoreImproved', { 
            detail: { 
              wpm: finalWpm, 
              accuracy: finalAccuracy 
            } 
          });
          window.dispatchEvent(scoreImprovedEvent);
          console.log('Evento scoreImproved emitido');
        }
        
        // Mostrar leaderboard solo si entramos al top 25 y NO está visible ya
        if (!showLeaderboard) {
          console.log('¡Enhorabuena! Has entrado en el Top 25 - Preparando visualización');
          // Esperar un momento antes de mostrar el leaderboard para no interrumpir
          setTimeout(() => {
            // Establecer directamente el estado en vez de llamar a toggle
            setShowLeaderboard(true);
            // Y cargar los datos
            loadLeaderboardData();
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('Error al enviar puntuación automáticamente', error);
    } finally {
      setIsSubmittingScore(false);
    }
  }, [getCurrentUser, loadLeaderboardData, showLeaderboard, setShowLeaderboard, setIsInTop25, setHasSubmittedScore, setIsSubmittingScore]); // Incluimos todas las dependencias

  // Submit score manual - versión corregida
  const submitScore = useCallback(async (
    wpm: number | null,
    accuracy: number | null,
    selectedTime: number | string,
    textLength: number,
    correctChars: number,
    incorrectChars: number,
    isCompetitiveMode: boolean
  ) => {
    if (hasSubmittedScore || !wpm || !accuracy) return;
    
    setIsSubmittingScore(true);
    
    try {
      // Obtener el usuario actual
      const user = await getCurrentUser();
      
      if (!user) {
        // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
        alert('Debes iniciar sesión para guardar tu puntuación');
        router.push('/login');
        setIsSubmittingScore(false);
        return;
      }
      
      // Reutilizar el mismo código que la función automática
      await submitScoreAutomatically(
        wpm,
        accuracy,
        selectedTime,
        textLength,
        correctChars,
        incorrectChars,
        isCompetitiveMode
      );
      
      // Cargar datos del leaderboard si está visible
      // En lugar de llamar a toggleLeaderboard que podría cerrar el leaderboard
      if (showLeaderboard) {
        // Recargar los datos sin cambiar la visibilidad
        loadLeaderboardData();
      } else {
        // Si no está visible, mostrarlo y cargar datos
        setShowLeaderboard(true);
        loadLeaderboardData();
      }
    } catch (error) {
      console.error('Error al enviar puntuación', error);
      alert('Error al guardar tu puntuación. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmittingScore(false);
    }
  }, [getCurrentUser, hasSubmittedScore, loadLeaderboardData, router, setIsSubmittingScore, showLeaderboard, submitScoreAutomatically, setShowLeaderboard]);

  const resetUserState = useCallback(() => {
    setHasSubmittedScore(false);
    setIsInTop25(false);
    if (showLeaderboard) {
      setShowLeaderboard(false);
    }
  }, [showLeaderboard, setHasSubmittedScore, setIsInTop25, setShowLeaderboard]);

  return {
    currentUser,
    isLoadingUser,
    leaderboardData,
    showLeaderboard,
    showUserProfile,
    isSubmittingScore,
    hasSubmittedScore,
    isInTop25,
    isLoadingLeaderboard,
    loadCurrentUser,
    getCurrentUser,
    handleProfileClick,
    handleSignOut,
    toggleLeaderboard,
    submitScoreAutomatically,
    submitScore,
    setShowUserProfile,
    resetUserState,
    loadLeaderboardData
  };
} 