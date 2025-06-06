import { defineStore } from "pinia"
import { useDataStore } from "@/stores/store"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    usuario: null,
    cargando: false,
  }),

  actions: {
    inicializar() {
      const sesionActiva = localStorage.getItem("sesion_activa")
      const dataStore = useDataStore()

      if (sesionActiva) {
        try {
          this.usuario = JSON.parse(sesionActiva)

          dataStore.recargarDatosUsuario()
        } catch (error) {
          console.error("Error al cargar sesión:", error)
          localStorage.removeItem("sesion_activa")
        }
      }
    },

    async entrar(nombre, pin, modo) {
      this.cargando = true
      const dataStore = useDataStore()

      await new Promise((resolve) => setTimeout(resolve, 500))

      const usuariosRegistrados = this.obtenerUsuariosRegistrados()
      const usuarioExiste = !!usuariosRegistrados[nombre]

      if (modo === "login") {
        if (!usuarioExiste) {
          this.cargando = false
          return {
            success: false,
            error: "El usuario no existe. Por favor, crea una cuenta primero.",
          }
        }

        const usuario = usuariosRegistrados[nombre]
        if (usuario.pin !== pin) {
          this.cargando = false
          return { success: false, error: "PIN incorrecto" }
        }

        this.usuario = usuario
        localStorage.setItem("sesion_activa", JSON.stringify(usuario))

        dataStore.recargarDatosUsuario()
        this.cargando = false

        return { success: true, mensaje: "¡Bienvenido de nuevo!" }
      } else if (modo === "registro") {
        if (usuarioExiste) {
          this.cargando = false
          return {
            success: false,
            error: "Este nombre de usuario ya existe. Por favor, elige otro o inicia sesión.",
          }
        }

        const nuevoUsuario = {
          nombre,
          pin,
          fechaRegistro: new Date().toISOString(),
        }

        usuariosRegistrados[nombre] = nuevoUsuario
        localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosRegistrados))

        this.usuario = nuevoUsuario
        localStorage.setItem("sesion_activa", JSON.stringify(nuevoUsuario))

        dataStore.recargarDatosUsuario()

        this.cargando = false
        return { success: true, mensaje: "¡Cuenta creada con éxito!" }
      }
    },

    salir() {
      this.usuario = null
      localStorage.removeItem("sesion_activa")

      const dataStore = useDataStore()
      dataStore.recargarDatosUsuario()
    },

    hayUsuariosRegistrados() {
      const usuariosRegistrados = this.obtenerUsuariosRegistrados()
      return Object.keys(usuariosRegistrados).length > 0
    },

    existeUsuario(nombre) {
      if (!nombre) return this.hayUsuariosRegistrados()
      const usuariosRegistrados = this.obtenerUsuariosRegistrados()
      return !!usuariosRegistrados[nombre]
    },

    obtenerUsuariosRegistrados() {
      const usuarios = localStorage.getItem("usuarios_registrados")
      return usuarios ? JSON.parse(usuarios) : {}
    },

    obtenerListaUsuarios() {
      const usuariosRegistrados = this.obtenerUsuariosRegistrados()
      return Object.keys(usuariosRegistrados)
    },
  },

  getters: {
    estaLogueado: (state) => !!state.usuario,
    nombreUsuario: (state) => state.usuario?.nombre || "",
  },
})
