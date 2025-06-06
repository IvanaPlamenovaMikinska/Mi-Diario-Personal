# Mi Diario Personal 📖

Aplicación web personal para llevar un diario digital con múltiples categorías como comidas, ejercicios, películas, libros, viajes y más.

## 🚀 Características

- ✅ **Sistema de usuarios** con autenticación por PIN
- ✅ **Múltiples categorías** de entradas (comidas, ejercicios, películas, etc.)
- ✅ **Filtros y búsqueda** por categoría y fecha
- ✅ **Estados de ánimo** con emojis
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **Almacenamiento local** y servidor JSON

## 🛠️ Tecnologías

- **Vue 3** con Options API
- **Vue Router** para navegación
- **Pinia** para gestión de estado
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **JSON Server** para datos

## 📋 Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

\`\`\`sh
git clone https://github.com/TU-USUARIO/diario-personal.git
cd diario-personal
\`\`\`

### 2. Instalar dependencias

\`\`\`sh
npm install
\`\`\`

### 3. Iniciar el servidor de datos

\`\`\`sh
# En una terminal separada
npx json-server --watch data/diario-multiusuario.json --port 3000
\`\`\`

### 4. Iniciar la aplicación

\`\`\`sh
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso

### Primera vez
1. Abre la aplicación en tu navegador
2. Crea un nuevo usuario con nombre y PIN
3. ¡Comienza a escribir en tu diario!

### Usuarios existentes
- **Usuario de prueba**: `ivana` (PIN: `1234`)

## 🗂️ Estructura del proyecto

\`\`\`
PROYECTOFINALDAW/
├── .vscode/                # Configuración de VS Code
├── node_modules/          # Dependencias (ignoradas por git)
├── public/                # Archivos públicos
│   ├── images/            # Imágenes estáticas
│   
├── src/                   # Código fuente
│   ├── assets/            # Recursos estáticos
│   │   ├── base.css       # Estilos base
│   │   ├── logo.svg       # Logo de la aplicación
│   │   └── style.css      # Estilos principales
│   ├── components/        # Componentes reutilizables
│   │   ├── FormComidas.vue
│   │   ├── FormCompras.vue
│   │   ├── FormCursos.vue
│   │   ├── FormDiario.vue
│   │   ├── FormEjercicios.vue
│   │   ├── FormEstadoAnimo.vue
│   │   ├── FormEventos.vue
│   │   ├── FormHabitos.vue
│   │   ├── FormLibros.vue
│   │   ├── FormLogros.vue
│   │   ├── FormMetas.vue
│   │   ├── FormMusica.vue
│   │   ├── FormPeliculas.vue
│   │   ├── FormSeries.vue
│   │   ├── FormViajes.vue
│   │   └── FormVideojuegos.vue
│   ├── router/            # Configuración de rutas
│   │   └── index.js       # Definición de rutas
│   ├── stores/            # Gestión de estado con Pinia
│   │   ├── authStore.js   # Autenticación de usuarios
│   │   └── store.js       # Datos de la aplicación
│   ├── views/             # Vistas principales
│   │   ├── AuthView.vue   # Login y registro
│   │   ├── ComidaView.vue
│   │   ├── CompraView.vue
│   │   ├── CursoView.vue
│   │   ├── DiarioView.vue
│   │   ├── EjercicioView.vue
│   │   ├── EstadoAnimoView.vue
│   │   ├── EventoView.vue
│   │   ├── HabitoView.vue
│   │   ├── HomeView.vue   # Vista principal
│   │   ├── LibroView.vue
│   │   ├── LogroView.vue
│   │   ├── MetaView.vue
│   │   ├── MusicaView.vue
│   │   ├── PeliculaView.vue
│   │   ├── SerieView.vue
│   │   ├── ViajeView.vue
│   │   └── VideojuegoView.vue
│   ├── App.vue            # Componente raíz
│   ├── diario-multiusuario.json # Datos de la aplicación
│   └── main.js            # Punto de entrada
└── ... otros archivos de configuración
\`\`\`

## 📱 Categorías disponibles

- 🍽️ **Comidas** - Registra tus comidas favoritas
- 🏃‍♂️ **Ejercicios** - Lleva control de tu actividad física
- 🎬 **Películas** - Anota las películas que ves
- 📚 **Libros** - Registra tus lecturas
- ✈️ **Viajes** - Documenta tus aventuras
- 🎵 **Música** - Guarda tus canciones favoritas
- 🎯 **Metas** - Define y sigue tus objetivos
- 🏆 **Logros** - Celebra tus éxitos
- 🔄 **Hábitos** - Rastrea tus rutinas diarias
- 🎉 **Eventos** - Recuerda momentos especiales
- 🛒 **Compras** - Lista de compras y gastos
- 📝 **Diario** - Entradas de diario personal

## 👤 Autor

Ivana - [@IvanaPlamenovaMikinska](https://github.com/IvanaPlamenovaMikinska)

---

⭐ ¡Dale una estrella al proyecto si te ha gustado!
