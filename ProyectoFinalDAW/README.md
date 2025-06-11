# PROYECTOFINALDAW - Mi Diario Personal 📖

Aplicación web personal para llevar un diario digital con múltiples categorías como comidas, ejercicios, películas, libros, viajes y más.

## 🚀 Características

- ✅ *Sistema de usuarios* con autenticación por PIN
- ✅ *Múltiples categorías* de entradas (comidas, ejercicios, películas, etc.)
- ✅ *Filtros y búsqueda* por categoría y fecha
- ✅ *Estados de ánimo* con emojis
- ✅ *Interfaz responsive* con Tailwind CSS
- ✅ *Almacenamiento local* y servidor JSON

## 🛠️ Tecnologías

- *Vue 3* con Options API
- *Vue Router* para navegación
- *Pinia* para gestión de estado
- *Tailwind CSS* para estilos
- *Vite* como bundler
- *JSON Server* para datos

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

git clone https://github.com/TU-USUARIO/PROYECTOFINALDAW.git
cd PROYECTOFINALDAW

### 2. Instalar dependencias

npm install


### 3. Iniciar el servidor de datos

# En una terminal separada
json-server diario-multiusuario.json


### 4. Iniciar la aplicación

npm run dev

La aplicación estará disponible en http://localhost:5173/login

## 📖 Uso

### Primera vez
1. Abre la aplicación en tu navegador
2. Crea un nuevo usuario con nombre y PIN
3. ¡Comienza a escribir en tu diario!

### Usuarios existentes
- *Usuario de prueba*: ivana (PIN: 1234)
- Hay que volver a crearlo en vuestro ordenador ya que se guarda e el localStorage

## 🗂️ Estructura del proyecto

\\\`
PROYECTOFINALDAW/
├── .vscode/                # Configuración de VS Code
├── node_modules/          # Dependencias (ignoradas por git)
├── public/                # Archivos públicos
│   ├── images/            # Imágenes estáticas
│   └── favicon.ico        # Icono de la aplicación
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
\\\`

## 👤 Autor

Ivana Plamenova Mikinska - [@IvanaPlamenovaMikinska](https://github.com/IvanaPlamenovaMikinska)
