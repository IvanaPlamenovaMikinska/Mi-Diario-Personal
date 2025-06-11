<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AuthView',
  data() {
    return {
      nombre: '',
      pin: '',
      error: '',
      modoActual: 'login'
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    cargando() {
      return this.authStore.cargando
    }
  },
  methods: {
    async manejarSubmit() {
      if (!this.nombre || !this.pin) {
        this.error = 'Por favor completa todos los campos'
        return
      }

      if (this.pin.length !== 4 || !/^\d+$/.test(this.pin)) {
        this.error = 'El PIN debe ser de 4 dígitos'
        return
      }

      this.error = ''

      try {
        const resultado = await this.authStore.entrar(this.nombre, this.pin, this.modoActual)

        if (resultado.success) {
          this.$router.push('/')
        } else {
          this.error = resultado.error || 'Error al procesar la solicitud'
        }
      } catch (error) {
        console.error('Error en login:', error)
        this.error = 'Error inesperado, intenta de nuevo'
      }
    }
  },
  mounted() {
    if (this.authStore.estaLogueado) {
      this.$router.push('/')
    }

    this.modoActual = this.authStore.hayUsuariosRegistrados() ? 'login' : 'registro'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <span class="text-3xl">📝</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mi Diario Personal
        </h2>

        <div class="mt-6 flex rounded-md shadow-sm">
          <button @click="modoActual = 'login'" type="button" :class="[
            'w-1/2 py-2 px-4 text-sm font-medium rounded-l-md border border-gray-300',
            modoActual === 'login'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]">
            Iniciar Sesión
          </button>
          <button @click="modoActual = 'registro'" type="button" :class="[
            'w-1/2 py-2 px-4 text-sm font-medium rounded-r-md border border-gray-300',
            modoActual === 'registro'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]">
            Crear Cuenta
          </button>
        </div>

        <p class="mt-3 text-center text-sm text-gray-600">
          {{ modoActual === 'login' ? 'Ingresa tus datos para continuar' : 'Configura tu diario personal' }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="manejarSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="nombre" class="sr-only">Nombre</label>
            <input id="nombre" v-model="nombre" name="nombre" type="text" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Tu nombre" />
          </div>
          <div>
            <label for="pin" class="sr-only">PIN</label>
            <input id="pin" v-model="pin" name="pin" type="password" required pattern="[0-9]{4}"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="PIN de 4 dígitos" maxlength="4" />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>

        <div>
          <button type="submit" :disabled="cargando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50">
            <span v-if="cargando" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ cargando ? 'Cargando...' : (modoActual === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta') }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-xs text-gray-500">
          Guarda tus experiencias y momentos especiales
        </p>
      </div>
    </div>
  </div>
</template>