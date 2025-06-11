<script>
import axios from 'axios';
import { mapActions, mapState } from 'pinia';
import { useDataStore } from '@/stores/store';
import { useAuthStore } from '@/stores/authStore';
import { BookOpen, Plus, Search, Calendar, TrendingUp, Star, Grid, Clock } from 'lucide-vue-next';

import FormPeliculas from '@/components/FormPeliculas.vue'
import FormSeries from '@/components/FormSeries.vue'
import FormLibros from '@/components/FormLibros.vue'
import FormVideojuegos from '@/components/FormVideojuegos.vue'
import FormMusica from '@/components/FormMusica.vue'
import FormViajes from '@/components/FormViajes.vue'
import FormEventos from '@/components/FormEventos.vue'
import FormComidas from '@/components/FormComidas.vue'
import FormCompras from '@/components/FormCompras.vue'
import FormEjercicios from '@/components/FormEjercicios.vue'
import FormHabitos from '@/components/FormHabitos.vue'
import FormEstadoAnimo from '@/components/FormEstadoAnimo.vue'
import FormMetas from '@/components/FormMetas.vue'
import FormCursos from '@/components/FormCursos.vue'
import FormLogros from '@/components/FormLogros.vue'
import FormDiario from '@/components/FormDiario.vue'

export default {
  components: {
    BookOpen,
    Plus,
    Search,
    Calendar,
    TrendingUp,
    Star,
    Grid,
    Clock,
    FormPeliculas,
    FormSeries,
    FormLibros,
    FormVideojuegos,
    FormMusica,
    FormViajes,
    FormEventos,
    FormComidas,
    FormCompras,
    FormEjercicios,
    FormHabitos,
    FormEstadoAnimo,
    FormMetas,
    FormCursos,
    FormLogros,
    FormDiario
  },
  data() {
    return {
      consultaBusqueda: '',
      categoriaSeleccionada: '',
      ordenarPor: 'fecha',
      mostrarAgregarEntrada: false,
      pasoModal: 'seleccion',
      tipoFormularioSeleccionado: '',
      actualizacionForzada: 0,
      authStore: useAuthStore(),
      categorias: [
        { id: 'entretenimiento', nombre: 'Entretenimiento', icono: '🎬' },
        { id: 'experiencias_ocio', nombre: 'Experiencias y Ocio', icono: '✈️' },
        { id: 'bienestar_salud', nombre: 'Bienestar y Salud', icono: '💪' },
        { id: 'crecimiento_personal', nombre: 'Crecimiento Personal', icono: '📚' }
      ],
      tiposFormularios: [
        { id: 'peliculas', nombre: 'Película', icono: '🎬', categoria: 'entretenimiento', componente: 'FormPeliculas' },
        { id: 'series', nombre: 'Serie', icono: '📺', categoria: 'entretenimiento', componente: 'FormSeries' },
        { id: 'libros', nombre: 'Libro', icono: '📚', categoria: 'entretenimiento', componente: 'FormLibros' },
        { id: 'videojuegos', nombre: 'Videojuego', icono: '🎮', categoria: 'entretenimiento', componente: 'FormVideojuegos' },
        { id: 'musica', nombre: 'Música', icono: '🎵', categoria: 'entretenimiento', componente: 'FormMusica' },

        { id: 'viajes', nombre: 'Viaje', icono: '✈️', categoria: 'experiencias_ocio', componente: 'FormViajes' },
        { id: 'eventos', nombre: 'Evento', icono: '🎉', categoria: 'experiencias_ocio', componente: 'FormEventos' },
        { id: 'comidas', nombre: 'Comida', icono: '🍽️', categoria: 'experiencias_ocio', componente: 'FormComidas' },
        { id: 'compras', nombre: 'Compra', icono: '🛍️', categoria: 'experiencias_ocio', componente: 'FormCompras' },

        { id: 'ejercicios', nombre: 'Ejercicio', icono: '💪', categoria: 'bienestar_salud', componente: 'FormEjercicios' },
        { id: 'habitos', nombre: 'Hábito', icono: '🔄', categoria: 'bienestar_salud', componente: 'FormHabitos' },
        { id: 'estado_animo', nombre: 'Estado de Ánimo', icono: '😊', categoria: 'bienestar_salud', componente: 'FormEstadoAnimo' },

        { id: 'metas', nombre: 'Meta', icono: '🎯', categoria: 'crecimiento_personal', componente: 'FormMetas' },
        { id: 'cursos', nombre: 'Curso', icono: '🎓', categoria: 'crecimiento_personal', componente: 'FormCursos' },
        { id: 'logros', nombre: 'Logro', icono: '🏆', categoria: 'crecimiento_personal', componente: 'FormLogros' },
        { id: 'diario', nombre: 'Entrada de Diario', icono: '📝', categoria: 'crecimiento_personal', componente: 'FormDiario' }
      ],
      componenteActivo: null,
    }
  },
  computed: {
    ...mapState(useDataStore, ['peliculas', 'series', 'libros', 'videojuegos', 'musica', 'viajes',
      'eventos', 'comidas', 'compras', 'ejercicios', 'habitos', 'estado_animo', 'metas', 'cursos',
      'logros', 'diario']),

    nombreUsuario() {
      return this.authStore.nombreUsuario
    },

    todasLasEntradas() {
      this.actualizacionForzada;

      const entradas = []

      this.peliculas.forEach(item => {
        entradas.push(this.crearEntrada(item, 'entretenimiento', 'peliculas', {
          titulo: item.titulo,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha_vista),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha_vista || new Date()).getTime()
        }))
      })

      this.series.forEach(item => {
        entradas.push(this.crearEntrada(item, 'entretenimiento', 'series', {
          titulo: item.nombre,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha_vista),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha_vista || new Date()).getTime()
        }))
      })

      this.libros.forEach(item => {
        entradas.push(this.crearEntrada(item, 'entretenimiento', 'libros', {
          titulo: item.titulo,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha_lectura),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha_lectura || new Date()).getTime()
        }))
      })

      this.videojuegos.forEach(item => {
        entradas.push(this.crearEntrada(item, 'entretenimiento', 'videojuegos', {
          titulo: item.nombre,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.musica.forEach(item => {
        entradas.push(this.crearEntrada(item, 'entretenimiento', 'musica', {
          titulo: item.nombre,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.viajes.forEach(item => {
        const fechaViaje = item.fechas ? item.fechas.split(' al ')[0] : item.fecha_inicio;
        entradas.push(this.crearEntrada(item, 'experiencias_ocio', 'viajes', {
          titulo: item.destino,
          comentario: item.actividades,
          fecha: this.normalizarFecha(fechaViaje),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(fechaViaje || new Date()).getTime()
        }))
      })

      this.eventos.forEach(item => {
        entradas.push(this.crearEntrada(item, 'experiencias_ocio', 'eventos', {
          titulo: item.nombre,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.comidas.forEach(item => {
        entradas.push(this.crearEntrada(item, 'experiencias_ocio', 'comidas', {
          titulo: item.plato,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.compras.forEach(item => {
        entradas.push(this.crearEntrada(item, 'experiencias_ocio', 'compras', {
          titulo: item.producto,
          comentario: item.comentario,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.puntuacion),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.ejercicios.forEach(item => {
        entradas.push(this.crearEntrada(item, 'bienestar_salud', 'ejercicios', {
          titulo: item.actividad,
          comentario: item.progreso,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: null,
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.habitos.forEach(item => {
        entradas.push(this.crearEntrada(item, 'bienestar_salud', 'habitos', {
          titulo: item.habito,
          comentario: item.cambios,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: null,
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.estado_animo.forEach(item => {
        entradas.push(this.crearEntrada(item, 'bienestar_salud', 'estado_animo', {
          titulo: 'Estado de ánimo',
          comentario: item.reflexion,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: this.normalizarPuntuacion(item.nivel_felicidad),
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.metas.forEach(item => {
        entradas.push(this.crearEntrada(item, 'crecimiento_personal', 'metas', {
          titulo: item.meta,
          comentario: item.notas,
          fecha: this.normalizarFecha(item.inicio),
          puntuacion: null,
          timestamp: new Date(item.inicio || new Date()).getTime()
        }))
      })

      this.cursos.forEach(item => {
        entradas.push(this.crearEntrada(item, 'crecimiento_personal', 'cursos', {
          titulo: item.nombre,
          comentario: item.opinion,
          fecha: this.normalizarFecha(item.inicio),
          puntuacion: null,
          timestamp: new Date(item.inicio || new Date()).getTime()
        }))
      })

      this.logros.forEach(item => {
        entradas.push(this.crearEntrada(item, 'crecimiento_personal', 'logros', {
          titulo: item.nombre,
          comentario: item.reflexion,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: null,
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      this.diario.forEach(item => {
        entradas.push(this.crearEntrada(item, 'crecimiento_personal', 'diario', {
          titulo: 'Entrada de diario',
          comentario: item.texto,
          fecha: this.normalizarFecha(item.fecha),
          puntuacion: null,
          timestamp: new Date(item.fecha || new Date()).getTime()
        }))
      })

      return entradas
    },

    totalEntradas() {
      return this.todasLasEntradas.length
    },

    entradasEsteMes() {
      const mesActual = new Date().getMonth()
      const añoActual = new Date().getFullYear()
      return this.todasLasEntradas.filter(entrada => {
        if (!entrada.fecha) return false
        const fechaEntrada = new Date(entrada.fecha)
        return fechaEntrada.getMonth() === mesActual && fechaEntrada.getFullYear() === añoActual
      }).length
    },

    puntuacionMedia() {
      const entradasConPuntuacion = this.todasLasEntradas.filter(entrada =>
        entrada.puntuacion !== null && entrada.puntuacion !== undefined && entrada.puntuacion > 0
      )
      if (entradasConPuntuacion.length === 0) return 0
      const suma = entradasConPuntuacion.reduce((acc, entrada) => acc + entrada.puntuacion, 0)
      return suma / entradasConPuntuacion.length
    },

    categoriasUnicas() {
      const cats = new Set(this.todasLasEntradas.map(entrada => entrada.categoria))
      return cats.size
    },

    entradasFiltradas() {
      let filtradas = [...this.todasLasEntradas]

      if (this.categoriaSeleccionada) {
        filtradas = filtradas.filter(entrada => entrada.categoria === this.categoriaSeleccionada)
      }

      if (this.consultaBusqueda) {
        const consulta = this.consultaBusqueda.toLowerCase().trim()
        filtradas = filtradas.filter(entrada =>
          (entrada.titulo && entrada.titulo.toLowerCase().includes(consulta)) ||
          (entrada.comentario && entrada.comentario.toLowerCase().includes(consulta)) ||
          (entrada.subcategoria && entrada.subcategoria.toLowerCase().includes(consulta))
        )
      }

      filtradas.sort((a, b) => {
        switch (this.ordenarPor) {
          case 'fecha':
            return b.timestamp - a.timestamp
          case 'puntuacion':
            return this.compararPuntuaciones(a, b)
          case 'titulo':
            return this.compararTitulos(a, b)
          default:
            return 0
        }
      })

      return filtradas
    }
  },
  methods: {
    ...mapActions(useDataStore, ['getPeliculas', 'getSeries', 'getLibros', 'getVideojuegos',
      'getMusica', 'getViajes', 'getEventos', 'getComidas', 'getCompras', 'getEjercicios',
      'getHabitos', 'getEstadoAnimo', 'getMetas', 'getCursos', 'getLogros', 'getDiario', 'formatearFecha']),

    salir() {
      this.authStore.salir()

      const dataStore = useDataStore()
      dataStore.recargarDatosUsuario()

      this.$router.push('/login')
    },

    forzarActualizacion() {
      this.actualizacionForzada++
    },

    normalizarFecha(fecha) {
      if (!fecha) {
        return new Date().toISOString().split('T')[0]
      }

      if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha
      }

      try {
        const fechaObj = new Date(fecha)
        if (isNaN(fechaObj.getTime())) {
          return new Date().toISOString().split('T')[0]
        }
        return fechaObj.toISOString().split('T')[0]
      } catch (error) {
        console.warn('Error al normalizar fecha:', fecha, error)
        return new Date().toISOString().split('T')[0]
      }
    },

    normalizarPuntuacion(puntuacion) {
      if (puntuacion === null || puntuacion === undefined || puntuacion === '') {
        return null
      }
      const num = Number(puntuacion)
      return isNaN(num) ? null : num
    },

    compararFechas(a, b) {
      if (a.timestamp && b.timestamp) {
        return b.timestamp - a.timestamp
      }

      if (!a.fecha && !b.fecha) return 0
      if (!a.fecha) return 1
      if (!b.fecha) return -1

      const fechaA = new Date(a.fecha)
      const fechaB = new Date(b.fecha)

      if (isNaN(fechaA.getTime()) && isNaN(fechaB.getTime())) return 0
      if (isNaN(fechaA.getTime())) return 1
      if (isNaN(fechaB.getTime())) return -1

      return fechaB.getTime() - fechaA.getTime()
    },

    compararPuntuaciones(a, b) {
      const puntuacionA = a.puntuacion || 0
      const puntuacionB = b.puntuacion || 0

      if (puntuacionB !== puntuacionA) {
        return puntuacionB - puntuacionA
      }

      return b.timestamp - a.timestamp
    },

    compararTitulos(a, b) {
      const tituloA = (a.titulo || '').toLowerCase().trim()
      const tituloB = (b.titulo || '').toLowerCase().trim()

      const comparacion = tituloA.localeCompare(tituloB, 'es', {
        numeric: true,
        sensitivity: 'base'
      })

      if (comparacion === 0) {
        return b.timestamp - a.timestamp
      }

      return comparacion
    },

    formatoFecha(fecha) {
      return this.formatearFecha(fecha);
    },

    crearEntrada(itemOriginal, categoria, subcategoria, camposMapeados) {
      return {
        id: itemOriginal.id,
        categoria,
        subcategoria,
        datosOriginales: itemOriginal,
        ...camposMapeados
      }
    },

    seleccionarCategoria(idCategoria) {
      if (this.categoriaSeleccionada === idCategoria) {
        this.categoriaSeleccionada = ''
      } else {
        this.categoriaSeleccionada = idCategoria
      }

      this.consultaBusqueda = ''
    },

    contarCategoria(idCategoria) {
      return this.todasLasEntradas.filter(entrada => entrada.categoria === idCategoria).length
    },

    obtenerNombreCategoria(idCategoria) {
      const categoria = this.categorias.find(cat => cat.id === idCategoria)
      return categoria ? categoria.nombre : ''
    },

    obtenerIconoCategoria(idCategoria) {
      const categoria = this.categorias.find(cat => cat.id === idCategoria)
      return categoria ? categoria.icono : '📝'
    },

    obtenerEmojiEstadoAnimo(nivel) {
      if (nivel >= 9) return '😄'
      if (nivel >= 7) return '🙂'
      if (nivel >= 5) return '😐'
      if (nivel >= 3) return '🙁'
      return '😢'
    },

    formatearFecha(fechaString) {
      if (!fechaString) return 'Sin fecha'
      try {
        const fecha = new Date(fechaString)
        if (isNaN(fecha.getTime())) return 'Fecha inválida'
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        return 'Fecha inválida'
      }
    },

    tiempoTranscurrido(fechaString) {
      if (!fechaString) return 'Sin fecha'
      try {
        const fecha = new Date(fechaString)
        if (isNaN(fecha.getTime())) return 'Fecha inválida'

        const ahora = new Date()
        const tiempoDiff = Math.abs(ahora - fecha)
        const diasDiff = Math.ceil(tiempoDiff / (1000 * 60 * 60 * 24))

        if (diasDiff === 0) return 'Hoy'
        if (diasDiff === 1) return 'Ayer'
        if (diasDiff < 7) return `Hace ${diasDiff} días`
        if (diasDiff < 30) return `Hace ${Math.ceil(diasDiff / 7)} semanas`
        if (diasDiff < 365) return `Hace ${Math.ceil(diasDiff / 30)} meses`
        return `Hace ${Math.ceil(diasDiff / 365)} años`
      } catch (error) {
        return 'Fecha inválida'
      }
    },

    verEntrada(entrada) {
      let ruta = '';

      switch (entrada.subcategoria) {
        case 'peliculas':
          ruta = `/pelicula/${entrada.datosOriginales.id}`;
          break;
        case 'series':
          ruta = `/serie/${entrada.datosOriginales.id}`;
          break;
        case 'libros':
          ruta = `/libro/${entrada.datosOriginales.id}`;
          break;
        case 'videojuegos':
          ruta = `/videojuego/${entrada.datosOriginales.id}`;
          break;
        case 'musica':
          ruta = `/music/${entrada.datosOriginales.id}`;
          break;
        case 'viajes':
          ruta = `/viaje/${entrada.datosOriginales.id}`;
          break;
        case 'eventos':
          ruta = `/evento/${entrada.datosOriginales.id}`;
          break;
        case 'comidas':
          ruta = `/comida/${entrada.datosOriginales.id}`;
          break;
        case 'compras':
          ruta = `/compra/${entrada.datosOriginales.id}`;
          break;
        case 'ejercicios':
          ruta = `/ejercicio/${entrada.datosOriginales.id}`;
          break;
        case 'habitos':
          ruta = `/habito/${entrada.datosOriginales.id}`;
          break;
        case 'estado_animo':
          ruta = `/estado-animo/${entrada.datosOriginales.id}`;
          break;
        case 'metas':
          ruta = `/meta/${entrada.datosOriginales.id}`;
          break;
        case 'cursos':
          ruta = `/curso/${entrada.datosOriginales.id}`;
          break;
        case 'logros':
          ruta = `/logro/${entrada.datosOriginales.id}`;
          break;
        case 'diario':
          ruta = `/diario/${entrada.datosOriginales.id}`;
          break;
        default:
          console.error('Tipo de entrada desconocido:', entrada.subcategoria);
          return;
      }

      this.$router.push(ruta);
    },

    async cargarTodosDatos() {
      try {
        await Promise.all([
          this.getPeliculas(),
          this.getSeries(),
          this.getLibros(),
          this.getVideojuegos(),
          this.getMusica(),
          this.getViajes(),
          this.getEventos(),
          this.getComidas(),
          this.getCompras(),
          this.getEjercicios(),
          this.getHabitos(),
          this.getEstadoAnimo(),
          this.getMetas(),
          this.getCursos(),
          this.getLogros(),
          this.getDiario()
        ])
        this.forzarActualizacion()
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    },

    async cerrarModal() {
      this.mostrarAgregarEntrada = false
      this.pasoModal = 'seleccion'
      this.tipoFormularioSeleccionado = ''
      this.componenteActivo = null

      await this.cargarTodosDatos()
    },

    seleccionarTipoFormulario(tipo) {
      this.tipoFormularioSeleccionado = tipo.id
      this.componenteActivo = tipo.componente
      this.pasoModal = 'formulario'
    },

    obtenerFormulariosPorCategoria(categoriaId) {
      return this.tiposFormularios.filter(form => form.categoria === categoriaId)
    },
  },
  watch: {
    peliculas() { this.forzarActualizacion() },
    series() { this.forzarActualizacion() },
    libros() { this.forzarActualizacion() },
    videojuegos() { this.forzarActualizacion() },
    musica() { this.forzarActualizacion() },
    viajes() { this.forzarActualizacion() },
    eventos() { this.forzarActualizacion() },
    comidas() { this.forzarActualizacion() },
    compras() { this.forzarActualizacion() },
    ejercicios() { this.forzarActualizacion() },
    habitos() { this.forzarActualizacion() },
    estado_animo() { this.forzarActualizacion() },
    metas() { this.forzarActualizacion() },
    cursos() { this.forzarActualizacion() },
    logros() { this.forzarActualizacion() },
    diario() { this.forzarActualizacion() }
  },
  async mounted() {
    await this.cargarTodosDatos()
    console.log('Componente montado, datos cargados')
  },
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <BookOpen class="h-8 w-8 text-purple-600" />
            <h1 class="text-2xl font-bold text-gray-900">Mi Diario Personal</h1>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 font-medium text-sm">
                  {{ nombreUsuario.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-gray-700 font-medium">Hola, {{ nombreUsuario }}</span>
            </div>

            <button @click="salir"
              class="text-gray-500 hover:text-red-600 text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors">
              Salir
            </button>

            <button @click="mostrarAgregarEntrada = true"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
              <Plus class="h-4 w-4" />
              <span>Nueva Entrada</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Entradas</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalEntradas }}</p>
            </div>
            <Calendar class="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Este Mes</p>
              <p class="text-2xl font-bold text-gray-900">{{ entradasEsteMes }}</p>
            </div>
            <TrendingUp class="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Puntuación Media</p>
              <p class="text-2xl font-bold text-gray-900">{{ puntuacionMedia.toFixed(1) }}</p>
            </div>
            <Star class="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Categorías</p>
              <p class="text-2xl font-bold text-gray-900">{{ categoriasUnicas }}</p>
            </div>
            <Grid class="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input v-model="consultaBusqueda" type="text" placeholder="Buscar en tu diario..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
          <select v-model="categoriaSeleccionada"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Todas las categorías</option>
            <option value="entretenimiento">🎬 Entretenimiento</option>
            <option value="experiencias_ocio">✈️ Experiencias y Ocio</option>
            <option value="bienestar_salud">💪 Bienestar y Salud</option>
            <option value="crecimiento_personal">📚 Crecimiento Personal</option>
          </select>
          <select v-model="ordenarPor"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="fecha">Más recientes</option>
            <option value="puntuacion">Mejor puntuación</option>
            <option value="titulo">Alfabético</option>
          </select>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Explorar por Categorías</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button v-for="categoria in categorias" :key="categoria.id" @click="seleccionarCategoria(categoria.id)"
            class="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow text-center group"
            :class="{ 'ring-2 ring-purple-500 bg-purple-50': categoriaSeleccionada === categoria.id }">
            <div class="text-2xl mb-2">{{ categoria.icono }}</div>
            <p class="text-sm font-medium text-gray-900">{{ categoria.nombre }}</p>
            <p class="text-xs text-gray-500">{{ contarCategoria(categoria.id) }} entradas</p>
          </button>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ categoriaSeleccionada ? `Entradas de ${obtenerNombreCategoria(categoriaSeleccionada)}` : 'Entradas Recientes' }}
          </h2>
          <button v-if="categoriaSeleccionada" @click="categoriaSeleccionada = ''"
            class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Ver todas
          </button>
        </div>

        <div v-if="entradasFiltradas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          :key="categoriaSeleccionada + '-' + consultaBusqueda + '-' + ordenarPor + '-' + actualizacionForzada">
          <div v-for="entrada in entradasFiltradas" :key="entrada.id"
            class="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
            @click="verEntrada(entrada)">
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ obtenerIconoCategoria(entrada.categoria) }}</span>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {{ entrada.subcategoria }}
                  </span>
                </div>
                <div v-if="entrada.puntuacion" class="flex items-center space-x-1">
                  <template v-if="entrada.subcategoria === 'estado_animo'">
                    <span class="text-lg">{{ obtenerEmojiEstadoAnimo(entrada.puntuacion) }}</span>
                    <span class="text-sm font-medium text-gray-700">{{ entrada.puntuacion }}/10</span>
                  </template>
                  <template v-else>
                    <Star class="h-4 w-4 text-yellow-400 fill-current" />
                    <span class="text-sm font-medium text-gray-700">{{ entrada.puntuacion }}</span>
                  </template>
                </div>
              </div>

              <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {{ entrada.titulo }}
              </h3>

              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ entrada.comentario }}
              </p>

              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>{{ formatearFecha(entrada.fecha) }}</span>
                <div class="flex items-center space-x-1">
                  <Clock class="h-3 w-3" />
                  <span>{{ tiempoTranscurrido(entrada.fecha) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ categoriaSeleccionada ? 'No hay entradas en esta categoría' : 'No hay entradas aún' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ categoriaSeleccionada ? 'Prueba con otra categoría o crea una nueva entrada.' : 'Comienza tu diario personal agregando tu primera experiencia.' }}
          </p>
          <button @click="mostrarAgregarEntrada = true"
            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2">
            <Plus class="h-4 w-4" />
            <span>Crear Primera Entrada</span>
          </button>
        </div>
      </div>
    </main>

    <div v-if="mostrarAgregarEntrada"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ pasoModal === 'seleccion' ? '¿Qué quieres agregar a tu diario?' : 'Nueva entrada' }}
            </h3>
            <button @click="cerrarModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p v-if="pasoModal === 'seleccion'" class="text-gray-600 mt-1">Selecciona el tipo de entrada que deseas crear
          </p>
        </div>

        <div class="p-6">
          <div v-if="pasoModal === 'seleccion'">
            <div v-for="categoria in categorias" :key="categoria.id" class="mb-8 last:mb-0">
              <div class="flex items-center space-x-3 mb-4">
                <span class="text-2xl">{{ categoria.icono }}</span>
                <h4 class="text-lg font-semibold text-gray-900">{{ categoria.nombre }}</h4>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <button v-for="formulario in obtenerFormulariosPorCategoria(categoria.id)" :key="formulario.id"
                  @click="seleccionarTipoFormulario(formulario)"
                  class="bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg p-4 text-center transition-all duration-200 group">
                  <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ formulario.icono }}</div>
                  <p class="text-sm font-medium text-gray-900 group-hover:text-purple-700">{{ formulario.nombre }}</p>
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="pasoModal === 'formulario' && componenteActivo">
            <component :is="componenteActivo" @cerrar="cerrarModal" @guardado="cerrarModal"></component>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t">
          <div class="flex justify-end">
            <button v-if="pasoModal === 'seleccion'" @click="cerrarModal()"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
              Cancelar
            </button>
            <button v-else-if="pasoModal === 'formulario'" @click="pasoModal = 'seleccion'"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
