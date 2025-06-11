<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Star, MapPin, Utensils, MessageCircle, Camera, AlertTriangle } from 'lucide-vue-next';
import FormComidas from '@/components/FormComidas.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Star,
        MapPin,
        Utensils,
        MessageCircle,
        Camera,
        AlertTriangle,
        FormComidas
    },
    data() {
        return {
            comida: null,
            modoEdicion: false,
            mostrarConfirmacion: false,
            cargando: false
        };
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    methods: {
        ...mapActions(useDataStore, ['getComidaById', 'removeComida', 'formatearFecha']),

        volver() {
            this.$router.push('/');
        },

        activarEdicion() {
            this.modoEdicion = true;
        },

        cancelarEdicion() {
            this.modoEdicion = false;
        },

        formatoFecha(fecha) {
            if (!fecha) return 'Fecha no disponible';
            try {
                return this.formatearFecha(fecha);
            } catch (error) {
                console.error("Error al formatear fecha:", error);
                return fecha;
            }
        },

        comidaActualizada(comidaActualizada) {
            this.comida = comidaActualizada;
            this.modoEdicion = false;
            this.toast.success("¡Comida actualizada correctamente!", {
                timeout: 3000,
                icon: "🍽️"
            });
        },

        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },

        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },

        async eliminarComida() {
            this.cargando = true;
            try {
                await this.removeComida(this.comida.id);
                this.toast.success("Comida eliminada correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar la comida:", error);
                this.toast.error("Error al eliminar la comida", {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.cargando = false;
                this.mostrarConfirmacion = false;
            }
        }
    },

    async mounted() {
        const id = parseInt(this.$route.params.id);
        this.comida = await this.getComidaById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-orange-600 hover:text-orange-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <FormComidas v-if="modoEdicion && comida" :comida-to-edit="comida" @cerrar="cancelarEdicion"
                @guardado="comidaActualizada" />

            <div v-else-if="comida" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <Utensils class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">{{ comida.plato }}</h1>
                        </div>
                        <div
                            class="bg-white text-orange-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Utensils class="h-4 w-4 mr-1" />
                            Comida
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <div class="flex items-center mb-2">
                                <Utensils class="h-5 w-5 text-orange-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Restaurante</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ comida.restaurante }}</p>
                        </div>

                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div class="flex items-center mb-2">
                                <MapPin class="h-5 w-5 text-blue-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Ubicación</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ comida.ubicacion }}</p>
                        </div>
                    </div>

                    <div v-if="comida.puntuacion" class="mb-6">
                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <Star class="h-6 w-6 text-yellow-500 fill-current mr-2" />
                                <h3 class="font-semibold text-gray-900">Puntuación</h3>
                            </div>
                            <div class="text-3xl font-bold text-yellow-600">{{ comida.puntuacion }}/5</div>
                        </div>
                    </div>

                    <div v-if="comida.fecha" class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="h-5 w-5 text-blue-600 mr-2">📅</span>
                            <h2 class="text-xl font-semibold text-gray-900">Fecha de la Comida</h2>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p class="text-gray-700 leading-relaxed">{{ formatoFecha(comida.fecha) }}</p>
                        </div>
                    </div>

                    <div v-if="comida.comentario" class="mb-6">
                        <div class="flex items-center mb-3">
                            <MessageCircle class="h-5 w-5 text-green-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Comentario</h2>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p class="text-gray-700 leading-relaxed">{{ comida.comentario }}</p>
                        </div>
                    </div>

                    <div v-if="comida.imagen" class="mb-6">
                        <div class="flex items-center mb-4">
                            <Camera class="h-5 w-5 text-pink-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Fotos del Plato</h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img :src="`/images/${comida.imagen}`" :alt="`Foto del plato ${comida.plato}`"
                                    class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                <div class="p-2 text-center">
                                    <span class="text-sm text-gray-600">{{ comida.plato }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-6 flex justify-between">
                        <button @click="activarEdicion"
                            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                            ✏️ Editar
                        </button>
                        <button @click="confirmarEliminacion"
                            class="px-6 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de confirmación de eliminación -->
            <div v-if="mostrarConfirmacion"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                    <div class="flex items-center mb-4 text-red-600">
                        <AlertTriangle class="h-6 w-6 mr-2" />
                        <h3 class="text-xl font-bold">Confirmar eliminación</h3>
                    </div>

                    <p class="mb-6 text-gray-700">
                        ¿Estás seguro de que deseas eliminar <strong>{{ comida.plato }}</strong>? Esta acción no se
                        puede deshacer.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button @click="eliminarComida" :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!comida" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-orange-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-orange-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-orange-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando información de la comida...</p>
            </div>
        </div>
    </div>
</template>