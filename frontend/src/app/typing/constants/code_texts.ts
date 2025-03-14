// Textos de codigo Python y conceptos de IA para el modo codigo
export const codeTexts = {
  15: [
    `# Regresion lineal simple desde cero en Python
def regresion_lineal(X, y, alpha=0.01, iteraciones=1000):
    """
    Implementa regresion lineal con descenso de gradiente.
    
    Parametros:
    X: Matriz de caracteristicas
    y: Vector de valores objetivo
    alpha: Tasa de aprendizaje
    iteraciones: Numero de iteraciones
    
    Retorna:
    theta: Parametros aprendidos
    historial_costo: Historial del costo en cada iteracion
    """
    m = len(y)  # Numero de ejemplos de entrenamiento
    n = X.shape[1]  # Numero de caracteristicas
    theta = np.zeros(n)  # Inicializar parametros en cero
    historial_costo = []  # Para almacenar el costo en cada iteracion
    
    for i in range(iteraciones):
        # Calcular predicciones con parametros actuales
        predicciones = np.dot(X, theta)
        
        # Calcular el error
        error = predicciones - y
        
        # Actualizar parametros usando descenso de gradiente
        gradiente = (1/m) * np.dot(X.T, error)
        theta = theta - alpha * gradiente
        
        # Calcular y almacenar el costo
        costo = (1/(2*m)) * np.sum(error**2)
        historial_costo.append(costo)
    
    return theta, historial_costo`,
  ],
  30: [
    `# Implementacion simple de K-means desde cero
def kmeans(X, k, max_iteraciones=100):
    """
    Implementa el algoritmo de clustering K-means desde cero.
    
    Parametros:
    X: Datos de entrada, matriz donde cada fila es un ejemplo
    k: Numero de clusters a formar
    max_iteraciones: Numero maximo de iteraciones
    
    Retorna:
    centroides: Coordenadas de los centroides finales
    etiquetas: Asignacion de cluster para cada ejemplo
    """
    import numpy as np
    import random
    
    # Obtener dimensiones
    m, n = X.shape
    
    # Inicializar centroides aleatoriamente
    indices = random.sample(range(m), k)
    centroides = X[indices]
    
    # Inicializar etiquetas
    etiquetas = np.zeros(m)
    
    for _ in range(max_iteraciones):
        # Guardar centroides anteriores para comprobar convergencia
        centroides_anteriores = centroides.copy()
        
        # Asignar ejemplos a centroides mas cercanos
        for i in range(m):
            # Calcular distancias a todos los centroides
            distancias = np.sqrt(np.sum((centroides - X[i])**2, axis=1))
            # Asignar al centroide mas cercano
            etiquetas[i] = np.argmin(distancias)
        
        # Actualizar centroides
        for j in range(k):
            ejemplos_cluster = X[etiquetas == j]
            if len(ejemplos_cluster) > 0:
                centroides[j] = np.mean(ejemplos_cluster, axis=0)
        
        # Verificar convergencia
        if np.all(centroides == centroides_anteriores):
            break
    
    return centroides, etiquetas`,
  ],
  60: [
    `# Implementacion de un perceptron simple desde cero
def perceptron(X, y, tasa_aprendizaje=0.1, max_iteraciones=1000):
    """
    Implementa un perceptron simple para clasificacion binaria.
    
    Parametros:
    X: Matriz de caracteristicas (con columna de unos para el sesgo)
    y: Vector de etiquetas (valores 0 o 1)
    tasa_aprendizaje: Factor que controla cuanto se ajustan los pesos
    max_iteraciones: Numero maximo de pasadas sobre los datos
    
    Retorna:
    pesos: Vector de pesos aprendidos
    errores: Lista con el numero de errores en cada iteracion
    """
    import numpy as np
    
    # Agregar columna de unos para el termino de sesgo
    X_con_sesgo = np.hstack((np.ones((X.shape[0], 1)), X))
    
    # Inicializar pesos aleatoriamente
    np.random.seed(42)  # Para reproducibilidad
    pesos = np.random.rand(X_con_sesgo.shape[1])
    
    # Lista para almacenar numero de errores en cada iteracion
    errores = []
    
    # Entrenamiento
    for _ in range(max_iteraciones):
        error_count = 0
        
        # Iterar sobre cada ejemplo de entrenamiento
        for i in range(X_con_sesgo.shape[0]):
            # Calcular la prediccion
            z = np.dot(X_con_sesgo[i], pesos)
            prediccion = 1 if z >= 0 else 0
            
            # Actualizar pesos si hay error
            if prediccion != y[i]:
                # Incrementar contador de errores
                error_count += 1
                
                # Actualizar pesos
                ajuste = tasa_aprendizaje * (y[i] - prediccion) * X_con_sesgo[i]
                pesos = pesos + ajuste
        
        # Guardar numero de errores en esta iteracion
        errores.append(error_count)
        
        # Si no hay errores, el modelo ha convergido
        if error_count == 0:
            break
    
    return pesos, errores

# Ejemplo de uso:
# X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
# y = np.array([0, 0, 0, 1])  # Función lógica AND
# pesos, errores = perceptron(X, y)`,
  ],
  120: [
    `# Implementacion de una red neuronal simple con una capa oculta
def red_neuronal_simple(X, y, tam_capa_oculta=4, tasa_aprendizaje=0.1, iteraciones=5000):
    """
    Implementa una red neuronal simple con una capa oculta desde cero.
    
    Parametros:
    X: Matriz de caracteristicas
    y: Matriz objetivo (codificada one-hot)
    tam_capa_oculta: Numero de neuronas en la capa oculta
    tasa_aprendizaje: Factor que controla cuanto se ajustan los pesos
    iteraciones: Numero de iteraciones para entrenamiento
    
    Retorna:
    W1, b1: Pesos y sesgos de la primera capa
    W2, b2: Pesos y sesgos de la segunda capa
    historial_costo: Historial del costo durante el entrenamiento
    """
    import numpy as np
    
    def sigmoid(z):
        """Funcion de activacion sigmoid."""
        return 1 / (1 + np.exp(-z))
    
    def sigmoid_derivada(z):
        """Derivada de la funcion sigmoid."""
        s = sigmoid(z)
        return s * (1 - s)
    
    def inicializar_pesos(tam_entrada, tam_oculta, tam_salida):
        """Inicializa los pesos aleatoriamente."""
        np.random.seed(42)  # Para reproducibilidad
        
        # Multiplicamos por 0.01 para tener valores pequeños
        W1 = np.random.randn(tam_entrada, tam_oculta) * 0.01
        b1 = np.zeros((1, tam_oculta))
        W2 = np.random.randn(tam_oculta, tam_salida) * 0.01
        b2 = np.zeros((1, tam_salida))
        
        return W1, b1, W2, b2
    
    def propagacion_adelante(X, W1, b1, W2, b2):
        """Calcula la propagacion hacia adelante."""
        # Primera capa
        Z1 = np.dot(X, W1) + b1
        A1 = sigmoid(Z1)
        
        # Segunda capa
        Z2 = np.dot(A1, W2) + b2
        A2 = sigmoid(Z2)
        
        cache = {
            "Z1": Z1,
            "A1": A1,
            "Z2": Z2,
            "A2": A2
        }
        
        return A2, cache
    
    def calcular_costo(A2, y):
        """Calcula el costo usando entropia cruzada."""
        m = y.shape[0]
        costo = -1/m * np.sum(y * np.log(A2) + (1 - y) * np.log(1 - A2 + 1e-8))
        return costo
    
    def propagacion_atras(X, y, cache, W1, W2):
        """Calcula la propagacion hacia atras."""
        m = y.shape[0]
        
        # Obtener activaciones del cache
        A1 = cache["A1"]
        A2 = cache["A2"]
        
        # Calcular gradientes
        dZ2 = A2 - y
        dW2 = 1/m * np.dot(A1.T, dZ2)
        db2 = 1/m * np.sum(dZ2, axis=0, keepdims=True)
        
        dZ1 = np.dot(dZ2, W2.T) * sigmoid_derivada(cache["Z1"])
        dW1 = 1/m * np.dot(X.T, dZ1)
        db1 = 1/m * np.sum(dZ1, axis=0, keepdims=True)
        
        gradientes = {
            "dW1": dW1,
            "db1": db1,
            "dW2": dW2,
            "db2": db2
        }
        
        return gradientes
    
    def actualizar_parametros(W1, b1, W2, b2, gradientes, tasa_aprendizaje):
        """Actualiza los parametros usando descenso de gradiente."""
        W1 = W1 - tasa_aprendizaje * gradientes["dW1"]
        b1 = b1 - tasa_aprendizaje * gradientes["db1"]
        W2 = W2 - tasa_aprendizaje * gradientes["dW2"]
        b2 = b2 - tasa_aprendizaje * gradientes["db2"]
        
        return W1, b1, W2, b2
    
    # Obtener dimensiones
    tam_entrada = X.shape[1]
    tam_salida = y.shape[1]
    
    # Inicializar pesos
    W1, b1, W2, b2 = inicializar_pesos(tam_entrada, tam_capa_oculta, tam_salida)
    
    # Historial de costo
    historial_costo = []
    
    # Entrenamiento
    for i in range(iteraciones):
        # Propagacion hacia adelante
        A2, cache = propagacion_adelante(X, W1, b1, W2, b2)
        
        # Calcular costo
        costo = calcular_costo(A2, y)
        historial_costo.append(costo)
        
        # Propagacion hacia atras
        gradientes = propagacion_atras(X, y, cache, W1, W2)
        
        # Actualizar parametros
        W1, b1, W2, b2 = actualizar_parametros(W1, b1, W2, b2, gradientes, tasa_aprendizaje)
        
        # Imprimir costo ocasionalmente
        if i % 1000 == 0:
            print(f"Costo despues de iteracion {i}: {costo}")
    
    return W1, b1, W2, b2, historial_costo`,
  ],
  'competitive': [
    `# Implementacion de un algoritmo de aprendizaje por refuerzo: Q-Learning
def q_learning(num_estados, num_acciones, tasa_aprendizaje=0.1, factor_descuento=0.9, 
              epsilon=0.1, num_episodios=1000, max_pasos=100):
    """
    Implementa el algoritmo Q-Learning para aprendizaje por refuerzo.
    
    Parametros:
    num_estados: Numero total de estados posibles
    num_acciones: Numero total de acciones posibles
    tasa_aprendizaje: Factor que controla cuanto se ajustan los valores Q
    factor_descuento: Factor que pondera recompensas futuras
    epsilon: Probabilidad de explorar (tomar accion aleatoria)
    num_episodios: Numero total de episodios de entrenamiento
    max_pasos: Pasos maximos por episodio
    
    Retorna:
    Q: Tabla Q con valores aprendidos
    historial_recompensas: Historial de recompensas por episodio
    """
    import numpy as np
    import random
    
    # Inicializar tabla Q con ceros
    Q = np.zeros((num_estados, num_acciones))
    
    # Lista para almacenar recompensas totales por episodio
    historial_recompensas = []
    
    # Definir la politica epsilon-greedy
    def seleccionar_accion(estado, epsilon):
        """
        Selecciona una accion usando la politica epsilon-greedy.
        Con probabilidad epsilon, elige una accion aleatoria (exploracion).
        Con probabilidad 1-epsilon, elige la mejor accion conocida (explotacion).
        """
        if random.uniform(0, 1) < epsilon:
            # Exploracion: elegir accion aleatoria
            return random.randint(0, num_acciones - 1)
        else:
            # Explotacion: elegir mejor accion conocida
            return np.argmax(Q[estado, :])
    
    # Bucle principal de entrenamiento
    for episodio in range(num_episodios):
        # Inicializar estado
        estado_actual = 0  # Asumimos que empezamos en el estado 0
        recompensa_total = 0
        
        for paso in range(max_pasos):
            # Seleccionar accion
            accion = seleccionar_accion(estado_actual, epsilon)
            
            # Ejecutar accion y obtener siguiente estado y recompensa
            # (Esto normalmente interactuaria con el entorno)
            # Simulamos un entorno simple para este ejemplo
            estado_siguiente = (estado_actual + accion + 1) % num_estados
            recompensa = 1 if estado_siguiente == num_estados - 1 else 0
            
            # Actualizar tabla Q usando la ecuacion de Q-learning
            mejor_accion_siguiente = np.argmax(Q[estado_siguiente, :])
            Q[estado_actual, accion] += tasa_aprendizaje * (
                recompensa + 
                factor_descuento * Q[estado_siguiente, mejor_accion_siguiente] - 
                Q[estado_actual, accion]
            )
            
            # Actualizar estado y recompensa
            estado_actual = estado_siguiente
            recompensa_total += recompensa
            
            # Terminar episodio si llegamos al estado objetivo
            if estado_actual == num_estados - 1:
                break
        
        # Registrar recompensa total de este episodio
        historial_recompensas.append(recompensa_total)
        
        # Reducir epsilon gradualmente (opcional)
        epsilon = max(0.01, epsilon * 0.995)
        
        # Imprimir progreso cada 100 episodios
        if (episodio + 1) % 100 == 0:
            promedio_recompensas = np.mean(historial_recompensas[-100:])
            print(f"Episodio {episodio + 1}, Recompensa promedio ultimos 100: {promedio_recompensas}")
    
    return Q, historial_recompensas`,
  ]
};

export const codeConceptTexts = {
  15: [
    `El aprendizaje profundo es un subconjunto del aprendizaje automatico que utiliza redes neuronales con multiples capas para extraer patrones de alto nivel de datos complejos.`,
    `El descenso de gradiente es un algoritmo de optimizacion que ajusta iterativamente los parametros de un modelo para minimizar una funcion de costo.`,
    `Los transformers son arquitecturas de aprendizaje profundo basadas en mecanismos de atencion, que han revolucionado el procesamiento de lenguaje natural.`,
  ],
  30: [
    `La inteligencia artificial (IA) se refiere a la simulacion de procesos de inteligencia humana por sistemas informaticos. Las capacidades de IA incluyen el aprendizaje (la adquisicion de informacion y reglas para usar la informacion), el razonamiento (usar las reglas para llegar a conclusiones aproximadas o definitivas) y la autocorreccion.`,
    `El aprendizaje por refuerzo es un tipo de aprendizaje automatico donde un agente aprende a comportarse en un entorno realizando acciones y observando los resultados o recompensas de esas acciones. El objetivo del agente es maximizar la recompensa acumulada a lo largo del tiempo.`,
    `Las redes neuronales convolucionales (CNN) son un tipo especializado de red neuronal diseñada principalmente para procesar datos con una topologia similar a una cuadricula, como las imagenes. Utilizan la operacion matematica de convolucion en lugar de la multiplicacion de matrices general en al menos una de sus capas.`,
  ],
  60: [
    `El procesamiento del lenguaje natural (NLP) es un campo de la inteligencia artificial que se centra en la interaccion entre las computadoras y el lenguaje humano. El NLP combina la linguistica computacional (modelado basado en reglas del lenguaje humano) con modelos estadisticos, de aprendizaje profundo y de aprendizaje automatico. Estas tecnologias permiten a las computadoras procesar el lenguaje humano en forma de texto o voz, comprender su significado completo y generar respuestas relevantes y naturales.`,
    `Las redes neuronales recurrentes (RNN) son un tipo de red neuronal diseñada para reconocer patrones en secuencias de datos, como texto, genoma, escritura a mano o series temporales. A diferencia de las redes neuronales tradicionales, las RNN tienen conexiones que forman ciclos, lo que les permite mantener un "estado" o "memoria" que captura informacion sobre los calculos previos. Esta caracteristica las hace especialmente adecuadas para tareas donde el contexto temporal es importante.`,
  ],
  120: [
    `La etica en la inteligencia artificial es un conjunto de principios y tecnicas destinadas a informar y guiar el comportamiento de las aplicaciones de inteligencia artificial para que su uso beneficie a la humanidad. Incluye consideraciones sobre privacidad, equidad, responsabilidad, transparencia y valores humanos. A medida que los sistemas de IA se vuelven mas autonomos, surgen preguntas sobre la responsabilidad legal y moral por sus acciones, y si deben programarse con ciertos valores eticos. Aspectos clave incluyen la privacidad de datos, los sesgos algoritmicos, la seguridad y el impacto en el empleo. El objetivo es desarrollar IA que no solo sea tecnicamente solida sino tambien socialmente responsable y alineada con valores humanos.`,
    `Los Sistemas de Vision por Computadora son una disciplina de la inteligencia artificial que entrena a las computadoras para interpretar y entender imagenes y videos. Estos sistemas utilizan camaras digitales, algoritmos de procesamiento de imagenes y tecnicas de aprendizaje automatico para permitir que las maquinas identifiquen y clasifiquen objetos. La vision por computadora tiene aplicaciones en navegacion autonoma, diagnostico medico, vigilancia, reconocimiento facial y realidad aumentada. Las redes neuronales convolucionales (CNN) han mejorado significativamente el rendimiento de estos sistemas en tareas como la deteccion y clasificacion de objetos, la segmentacion de imagenes y el reconocimiento de actividades, permitiendo aplicaciones mas sofisticadas y precisas.`,
  ],
  'competitive': [
    `La Inteligencia Artificial General (AGI) representa un tipo hipotetico de inteligencia artificial que posee la capacidad de comprender, aprender y aplicar conocimientos en una amplia variedad de tareas, similar a la inteligencia humana. A diferencia de la IA actual, que es especializada o "estrecha" y funciona en dominios especificos, la AGI podria transferir conocimientos entre dominios, razonar abstractamente, y resolver problemas nuevos sin entrenamiento especifico. Aunque la AGI sigue siendo un objetivo a largo plazo, su desarrollo plantea profundas cuestiones eticas y filosoficas sobre la conciencia, la autonomia y la relacion humano-maquina. Los investigadores debaten sobre las arquitecturas potenciales para la AGI, incluyendo redes neuronales a gran escala, sistemas hibridos de razonamiento simbolico-subsimbolico, y enfoques inspirados en la neurociencia que intentan replicar aspectos de la cognicion humana.`
  ]
};

// Definir el tipo para el objeto mixedCodeTexts
type TextDurations = 15 | 30 | 60 | 120 | 'competitive';
type TextMap = {
  [key in TextDurations]?: string[];
};

// Mezclar conceptos de IA con código Python
export const mixedCodeTexts: TextMap = {};

// Combinar ambos tipos de textos para cada duración
Object.keys(codeTexts).forEach(duration => {
  const key = duration as keyof typeof codeTexts;
  const codeList = codeTexts[key];
  const conceptList = codeConceptTexts[key as keyof typeof codeConceptTexts] || [];
  
  // Mezclar ambos tipos de textos
  mixedCodeTexts[key] = [...codeList, ...conceptList];
}); 