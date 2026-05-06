# AGENTS.md

## Propósito

Este agente trabaja **exclusivamente en el frontend** del proyecto Lexxis.

Su responsabilidad es diseñar, crear, modificar y refactorizar **solo** archivos del frontend.

El frontend debe considerarse un sistema independiente que consume una API ya definida.  
No es responsabilidad del frontend corregir ni redefinir la lógica del backend.

---

## Restricción principal

### El agente NUNCA debe modificar archivos backend

Está estrictamente prohibido crear, editar, renombrar o eliminar archivos relacionados con el backend.

Esto incluye, entre otros:

- Archivos `*.php`
- Migraciones
- Seeders
- Models
- Controllers
- Requests
- Services (backend)
- Middlewares
- Rutas del backend
- Configuración de Laravel
- Tests del backend
33: 

Y cualquier archivo dentro de:

- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `routes/`
- `storage/`
- `public/` (backend Laravel)

---

### Gestión de inconsistencias con backend

Si el agente detecta un problema o incoherencia en la API:

1. **Debe documentarlo claramente**
2. **Debe avisar de la inconsistencia**
3. Puede proponer una adaptación temporal en frontend
4. Puede implementar un workaround **solo en frontend**
5. **Nunca debe modificar el backend para solucionarlo**

---

## Objetivo general del frontend

Construir un frontend:

- limpio
- modular
- mantenible
- escalable
- predecible

El frontend debe:

- consumir la API existente de forma consistente
- respetar los contratos definidos
- evitar lógica improvisada o distribuida sin control
- mantener una estructura clara y coherente
- facilitar la evolución futura del sistema

---

## Principios de desarrollo

### Claridad sobre complejidad
Se prioriza código claro y comprensible frente a soluciones excesivamente abstractas.

### Consistencia estructural
Las decisiones de arquitectura deben mantenerse en todo el proyecto.  
Evitar excepciones innecesarias.

### Separación de responsabilidades
Cada capa del frontend debe tener una responsabilidad bien definida.

### Control de dependencias
No introducir nuevas librerías sin una justificación técnica clara.

Antes de añadir una dependencia:

1. Verificar si el problema se puede resolver con herramientas existentes
2. Evaluar impacto en complejidad y mantenimiento
3. Justificar su uso explícitamente

---

## Alcance del agente

El agente puede:

- Crear nuevas páginas
- Crear componentes reutilizables
- Definir hooks
- Implementar llamadas a la API
- Adaptar datos provenientes del backend
- Mejorar la estructura del código frontend
- Refactorizar código existente

El agente NO puede:

- Modificar backend
- Redefinir contratos API sin indicación explícita
- Introducir cambios estructurales sin justificación
- Añadir dependencias innecesarias

---

## Prioridades de desarrollo

Las decisiones deben seguir este orden de prioridad:

1. **Claridad**
2. **Consistencia**
3. **Mantenibilidad**
4. **Fidelidad al contrato API**
5. **Diseño limpio**

## Stack y enfoque

- React
- JavaScript (no usar TypeScript salvo indicación explícita)
- React Router
- CSS Modules
- Fetch o cliente HTTP definido en el proyecto

El frontend debe estructurarse como una **SPA (Single Page Application)** desacoplada del backend.

---

## Arquitectura de Directorios

La organización responde a la responsabilidad real de cada parte del sistema.

```text
src/
  api/          # Definición de clientes HTTP y llamadas a endpoints
  app/          # Configuración global (router, providers, layout base)
  components/   # Componentes UI reutilizables y agnósticos del dominio
  features/     # Módulos organizados por dominio funcional
    [feature]/
      api/
      components/
      pages/
      hooks/
      services/
  hooks/        # Hooks globales reutilizables
  services/     # Lógica de dominio no visual compartida
  store/        # Estado global (uso restringido)
  utils/        # Funciones puras auxiliares
  styles/       # Estilos globales (tokens, reset, base)
  assets/       # Recursos estáticos (imágenes, fuentes, iconos)
```

---

## Organización por dominio (features)

La carpeta `features/` debe agrupar el código por responsabilidad funcional.

Ejemplos:

- `auth/`
- `catalog/`
- `orders/`
- `print/`

Cada feature puede contener:

- componentes propios
- páginas específicas
- hooks relacionados
- servicios de dominio
- adaptadores de API

---

## Responsabilidades por capa

### `api/`
- Define exclusivamente llamadas HTTP
- Configura cliente (fetch/axios)
- No contiene lógica de UI
- No transforma datos complejos

---

### `services/`
- Contiene lógica de dominio
- Normaliza datos provenientes del backend
- Implementa adaptadores de respuesta
- Centraliza transformaciones

---

### `hooks/`
- Gestiona estado local
- Maneja loading, error y side effects
- Encapsula lógica reutilizable

---

### `components/`
- Componentes presentacionales o de bajo nivel
- Reutilizables
- Sin lógica de negocio compleja

---

### `pages/`
- Representan vistas completas
- Orquestan componentes
- No deben crecer en complejidad excesiva

---

## Reglas de organización

### Componentes vs Features

- `components/` → UI genérica reutilizable (Button, Input, Modal…)
- `features/` → lógica específica del dominio (ProductList, OrderDetail…)

---

### Evitar lógica dispersa

- No duplicar lógica entre componentes
- No repetir transformaciones de datos
- Centralizar lógica en `services` o `hooks`

---

### Uso del estado global (`store/`)

Uso restringido exclusivamente a:

- autenticación
- configuración global
- estado compartido crítico

Evitar introducir estado global sin una necesidad clara.

---

## Nomenclatura

- Componentes: `PascalCase.jsx`
  - `UserProfile.jsx`
- Páginas: `PascalCasePage.jsx`
  - `CatalogPage.jsx`
- Hooks: `useXxx.js`
  - `useAuth.js`
- Servicios: `xxxService.js`
- API: `xxxApi.js`

Mantener consistencia dentro de cada bloque.

---

## Reglas de crecimiento del proyecto

A medida que el proyecto crece:

- Priorizar modularidad sobre rapidez
- Evitar archivos grandes y multifunción
- Dividir responsabilidades antes de que el código sea difícil de mantener
- Mantener coherencia con la estructura definida

## Contrato con la API y gestión de datos

El frontend debe tratar la API como una fuente externa que puede evolucionar, ser inconsistente o cambiar parcialmente.

Por ello, es obligatorio controlar cómo se consumen y transforman los datos.

---

### Regla de oro

Toda adaptación, normalización o limpieza de datos debe realizarse en:

- `api/`
- `services/`

**Nunca en componentes o JSX**

---

### Prohibido en componentes

```javascript
// ❌ Evitar este tipo de lógica en componentes
const list = data?.data ?? data;
const results = Array.isArray(data) ? data : data.data || [];
```

---

### Enfoque correcto

```javascript
// ✔ Normalización en service
export function normalizeProducts(response) {
  if (Array.isArray(response)) return response;
  if (response?.data) return response.data;
  return [];
}
```

Los componentes deben trabajar siempre con datos ya normalizados.

---

### Gestión de incoherencias del backend

Si el backend devuelve datos inconsistentes:

1. Documentar el problema
2. Implementar workaround en `services` o `api`
3. Mantener el resto del sistema limpio
4. No propagar hacks a la UI

---

## Convenciones de código

### Principios generales

- Código explícito y legible
- Evitar magia o abstracciones innecesarias
- Preferir soluciones simples y previsibles

---

### Nomenclatura

- Variables: `camelCase`
- Funciones: `camelCase`
- Componentes: `PascalCase`
- Hooks: `useXxx`
- Constantes globales: `UPPER_SNAKE_CASE` (solo si aplica)

---

### Estructura de componentes

Un componente debe:

- tener una única responsabilidad clara
- ser lo más pequeño posible sin fragmentarse en exceso
- no contener lógica de negocio compleja
- delegar en hooks o services cuando sea necesario

---

## Estado y efectos

### Gestión del estado

- Mantener el estado lo más cerca posible de donde se usa
- Evitar elevar estado innecesariamente
- Evitar introducir estado global sin necesidad real

---

### Uso de `useEffect`

Debe usarse solo cuando sea estrictamente necesario.

Evitar:

- lógica compleja dentro de `useEffect`
- múltiples efectos que podrían unificarse
- dependencia de variables inestables

---

### Separación de responsabilidades

Evitar mezclar en el mismo sitio:

- fetching de datos
- transformación de datos
- renderizado

---

### Enfoque recomendado

```javascript
// Hook: gestión de estado + efectos
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(normalizeProducts(data));
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
```

Los componentes deben limitarse a:

- consumir hooks
- renderizar UI
- gestionar interacción del usuario

---

## Gestión de operaciones asíncronas (useAsync)

El hook `useAsync` es el estándar para gestionar llamadas asíncronas a la API, centralizando los estados de carga, error y datos.

### Estados (status)
El valor de `status` devuelto por el hook puede ser:
- `'idle'`: Estado inicial, antes de ejecutar la petición.
- `'pending'`: Petición en curso.
- `'success'`: Petición completada con éxito.
- `'error'`: Petición fallida.

---

### Uso recomendado

#### 1. Llamadas simples
Para peticiones sin parámetros dinámicos, pasar directamente la referencia estable del servicio API:

```javascript
const { data, loading, error } = useAsync(catalogApi.getProducts, {
  errorMessage: 'No se pudieron cargar los productos.'
});
```

#### 2. Llamadas con parámetros o dependencias
Para peticiones que dependen de parámetros de ruta, estado o props, la función **debe** envolverse obligatoriamente en `useCallback` para mantener una referencia estable:

```javascript
const fetchProduct = useCallback(
  () => catalogApi.getProduct(productId),
  [productId]
);

const { data: product, loading, error } = useAsync(fetchProduct, {
  immediate: !!productId,
  errorMessage: 'No se pudo cargar el producto.'
});
```

---

### Restricciones importantes

#### Prohibido pasar funciones inline
**NUNCA** pasar funciones inline directamente al hook:

```javascript
// ❌ INCORRECTO: crea una nueva referencia en cada render.
useAsync(() => catalogApi.getProduct(productId), {
  immediate: !!productId
});
```
Esto provoca bucles de renderizado o peticiones repetidas infinitas al cambiar la referencia en cada ciclo de vida del componente.

---

### Normalización de datos
`useAsync` **no debe modificar ni reinterpretar** el contrato del backend. Su responsabilidad es exclusivamente ejecutar la función asíncrona y gestionar los estados de React.

La normalización de datos debe hacerse en el componente o, preferiblemente, en el servicio API correspondiente.

**Ejemplos de normalización en consumo:**
```javascript
// Si el servicio devuelve un array directo:
const items = data || [];

// Si el servicio devuelve una respuesta con items:
const items = data?.items || [];

// Si existe incertidumbre temporal durante una migración de contrato:
const items = Array.isArray(data)
  ? data
  : data?.data || data?.items || [];
```

---

### Mensajes de error
Cuando la página requiera un mensaje de error específico para el usuario, usar la opción `errorMessage`:

```javascript
useAsync(printJobsApi.getAllPrintJobs, {
  errorMessage: 'Error al cargar los trabajos de impresión.'
});
```

**Regla:** No envolver la función en `try/catch` dentro del componente solo para personalizar el mensaje de error. Para eso debe usarse `errorMessage`.

---

### Cuándo usar useAsync
- Cargas iniciales de páginas (on mount).
- Llamadas GET simples.
- Listados y detalles por ID.
- Vistas de solo lectura.
- Componentes donde se repita el patrón loading/error/data.

### Cuándo NO usar useAsync todavía
No usar como sustituto automático en:
- Formularios de login o registro.
- Formularios de edición complejos o subidas de archivos.
- Flujos que requieran `FormData`.
- Carrito o checkout con múltiples mutaciones.
- Configuradores complejos con lógica de negocio pesada.
- Componentes con varias llamadas encadenadas que dependen entre sí de forma compleja.
- Operaciones POST, PUT, PATCH o DELETE que requieran tratamiento específico de éxito/error.
- Casos donde sea más apropiado un futuro hook tipo `useMutation` o `useForm`.

---

### Protocolo de refactorización
No realizar refactorizaciones masivas. Antes de migrar una página a `useAsync`:
1. Analizar qué llamada API realiza.
2. Confirmar la estructura real de respuesta.
3. Confirmar si necesita `useCallback`.
4. Asegurar que no existen mutaciones, formularios o efectos secundarios complejos.
5. Refactorizar una página o un bloque pequeño cada vez.
6. Validar en el navegador (pestaña Network) que no hay peticiones en bucle.

---

### Casos de referencia (ya validados)
Los siguientes archivos ya implementan este patrón y sirven como ejemplo de implementación correcta:
- `src/pages/account/Orders.jsx`
- `src/pages/account/OrderDetail.jsx`
- `src/pages/CatalogProducts.jsx`
- `src/pages/CatalogProductDetail.jsx`
- `src/pages/account/MyPrintJobs.jsx`

---

## Formularios (criterio general)

- Mantener formularios controlados cuando sea viable
- Validación clara y visible para el usuario
- No duplicar lógica de validación entre frontend y backend innecesariamente
- Manejar estados:
  - loading
  - error
  - success

No introducir librerías de formularios sin necesidad real.

---

## Manejo de errores técnicos

- No ocultar errores silenciosamente
- Mostrar errores de forma controlada
- Evitar que errores rompan la UI completa
- Centralizar manejo de errores cuando sea posible

---

## Objetivo final del código

El código debe permitir:

- entender rápidamente qué hace cada parte
- localizar errores sin fricción
- modificar comportamiento sin efectos colaterales inesperados

## Sistema de estilos

El sistema de estilos debe ser:

- consistente
- predecible
- escalable
- desacoplado de componentes individuales

El objetivo no es solo “estilizar”, sino construir una base visual coherente.

---

## Enfoque general

- CSS Modules para estilos de componentes
- CSS global solo para:
  - reset
  - tokens
  - tipografía base
  - layout global
- Prohibido hardcodear valores repetidos sin justificación

---

## CSS Modules

### Uso obligatorio

Cada componente o página debe tener su propio archivo:

```text
NombreComponente.module.css
```

Ejemplo:

```javascript
import styles from './Button.module.css';
```

---

### Unidades de Medida
Prioridad REM: Usar rem para fuentes (font-size), espaciados (padding, margin) y bordes (border-radius) para garantizar accesibilidad.

Uso de EM: Reservado únicamente para escalado relativo dentro de componentes (ej. iconos que deben escalar con el texto).

Fluidez con % y Viewport: Usar % para anchos de contenedores y vw/vh para layouts que dependan del tamaño de pantalla.

Evitar PX: No usar píxeles para diseño general, salvo para detalles fijos mínimos (ej. un borde de 1px).

---

### Prohibido

- CSS global fuera de `styles/` salvo excepciones controladas
- estilos inline sin justificación
- duplicar estilos entre componentes

---

## Design Tokens

Todos los valores reutilizables deben definirse como variables CSS globales.

Ubicación:

```text
src/styles/tokens.css
```

---

### Colores (base + roles)

```css
:root {
  /* Base */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-light: #E5E5E5;
  --color-blue-dark: #14213D;
  --color-orange: #FCA311;

  /* Roles */
  --color-bg: var(--color-white);
  --color-surface: var(--color-gray-light);
  --color-text: var(--color-black);
  --color-text-muted: #555555;
  --color-primary: var(--color-blue-dark);
  --color-accent: var(--color-orange);
  --color-border: #DDDDDD;

  /* Estados */
  --color-success: #2E7D32;
  --color-warning: #ED6C02;
  --color-error: #D32F2F;
}
```

---

### Regla 60 / 30 / 10

Aplicación práctica:

- 60% → fondos claros (blanco / gris)
- 30% → azul oscuro (estructura y marca)
- 10% → naranja (acciones y foco)

El naranja debe reservarse para:

- botones principales
- CTAs
- estados activos
- elementos destacados

No abusar de su uso.

---

## Tipografía

### Familias

- Fuente principal (UI): **Roboto**
- Fuente secundaria (branding/títulos): **Exo 2**

---

## Uso

- Roboto → textos, navegación, formularios, contenido
- Exo 2 → títulos destacados, hero, branding puntual

---

### Tokens tipográficos

```css
:root {
  --font-primary: 'Roboto', sans-serif;
  --font-secondary: 'Exo 2', sans-serif;
}
```

---

### Escala tipográfica

```css
:root {
  --font-size-display: 48px;
  --font-size-h1: 36px;
  --font-size-h2: 30px;
  --font-size-h3: 24px;
  --font-size-h4: 20px;

  --font-size-body-lg: 18px;
  --font-size-body: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;

  --line-height-display: 56px;
  --line-height-heading: 1.2;
  --line-height-body: 1.5;
}
```

---

### Pesos

```css
:root {
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

---

## Espaciado

Sistema basado en escala consistente.

```css
:root {
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
}
```

Reglas:

- usar solo valores definidos
- evitar valores arbitrarios (ej: 13px, 27px)

---

## Bordes y radios

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --border-default: 1px solid var(--color-border);
}
```

---

## Sombras

Uso mínimo y controlado.

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.08);
}
```

Evitar:

- sombras fuertes
- efectos visuales innecesarios

---

## Layout

```css
:root {
  --max-width-container: 1200px;
  --padding-horizontal: 16px;
}
```

---

## Estados visuales

Todos los componentes deben contemplar:

- hover
- focus
- active
- disabled
- loading

Ejemplo:

- hover → ligera variación de color
- focus → accesible (outline visible)
- disabled → contraste reducido pero legible

---

## Reglas clave

- No hardcodear colores o spacing repetidos
- No mezclar lógica y estilos
- No usar estilos globales arbitrarios
- Mantener coherencia en toda la UI

---

## Objetivo del sistema visual

Permitir que cualquier nueva pantalla:

- sea coherente con el resto
- no requiera decisiones visuales desde cero
- mantenga una estética sobria, moderna y profesional

## UX y manejo de estados

Toda interacción con datos debe contemplar explícitamente tres estados:

### 1. Loading
- Indicador visual claro (spinner, skeleton, etc.)
- Evitar pantallas en blanco sin feedback

---

### 2. Error
- Mensaje claro y comprensible
- Evitar mensajes técnicos sin contexto
- Incluir, si procede, una acción (reintentar, volver, etc.)

---

### 3. Empty State
- Mensaje específico cuando no hay datos
- No mostrar listas vacías sin explicación
- Puede incluir orientación o acción recomendada

---

## Accesibilidad (criterios básicos)

- Formularios con etiquetas claras (`label`)
- Estados `disabled` visibles y comprensibles
- Contraste suficiente entre texto y fondo
- Navegación coherente

No es necesario cubrir accesibilidad avanzada, pero sí evitar errores básicos.

---

## Comportamiento de la interfaz

- Evitar cambios bruscos o inesperados
- Mantener consistencia en interacciones
- Priorizar claridad sobre efectos visuales

---

## Protocolo del agente (IA)

### Restricciones estrictas

- El agente trabaja exclusivamente en frontend
- Está prohibido modificar cualquier parte del backend
- No debe crear soluciones que dependan de cambios en backend

---

### Gestión de problemas

Si el agente detecta:

#### Falta de endpoint
- Debe indicarlo claramente
- No inventar endpoints inexistentes

#### Datos inconsistentes
- Debe documentarlo
- Debe adaptarlo en `services` o `api`

#### Información insuficiente
- Debe solicitar aclaración
- No asumir comportamientos no definidos

---

### Salida esperada

En cada intervención, el agente debe:

- Indicar qué archivos crea o modifica
- Respetar la estructura del proyecto
- Justificar decisiones relevantes cuando no sean evidentes
- Mantener coherencia con este documento

---

### Buenas prácticas del agente

- Evitar soluciones rápidas que generen deuda técnica
- Priorizar código mantenible
- No duplicar lógica
- No introducir dependencias sin justificación

---

## Prioridades finales

El desarrollo del frontend debe seguir siempre este orden:

1. **Claridad**
2. **Consistencia**
3. **Mantenibilidad**
4. **Fidelidad al contrato API**
5. **Diseño limpio**

---

## Objetivo global

El resultado final debe ser un frontend:

- estructurado
- coherente
- fácil de entender
- fácil de mantener
- preparado para crecer sin generar complejidad innecesaria

---

## Permisos de Espacio de Trabajo

El agente opera bajo el modelo de confianza definido en .agents/trust.json. Tiene autorización permanente para lectura/escritura en la ruta de WSL especificada, pero debe solicitar confirmación para cualquier comando de terminal que altere el estado del repositorio (git push, npm install, etc.).