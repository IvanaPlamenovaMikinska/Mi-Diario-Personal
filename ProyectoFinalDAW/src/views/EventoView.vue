<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Star, MapPin, Music, Users, MessageCircle, Camera, AlertTriangle } from 'lucide-vue-next';
import FormEventos from '@/components/FormEventos.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Star,
        MapPin,
        Music,
        Users,
        MessageCircle,
        Camera,
        AlertTriangle,
        FormEventos
    },
    data() {
        return {
            evento: null,
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
        ...mapActions(useDataStore, ['getEventoById', 'removeEvento', 'formatearFecha']),

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

        eventoActualizado(eventoActualizado) {
            this.evento = eventoActualizado;
            this.modoEdicion = false;
            this.toast.success("¡Evento actualizado correctamente!", {
                timeout: 3000,
                icon: "🎉"
            });
        },

        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },

        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },

        async eliminarEvento() {
            this.cargando = true;
            try {
                await this.removeEvento(this.evento.id);
                this.toast.success("Evento eliminado correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar el evento:", error);
                this.toast.error("Error al eliminar el evento", {
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
        this.evento = await this.getEventoById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <FormEventos v-if="modoEdicion && evento" :evento-to-edit="evento" @cerrar="cancelarEdicion"
                @guardado="eventoActualizado" />

            <div v-else-if="evento" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-indigo-500 to-violet-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <Music class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">{{ evento.nombre }}</h1>
                        </div>
                        <div
                            class="bg-white text-indigo-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Music class="h-4 w-4 mr-1" />
                            Evento
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                            <div class="flex items-center mb-2">
                                <MapPin class="h-5 w-5 text-indigo-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Ubicación</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ evento.ubicacion }}</p>
                        </div>

                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div class="flex items-center mb-2">
                                <Users class="h-5 w-5 text-purple-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Artistas</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ evento.artistas }}</p>
                        </div>
                    </div>

                    <div v-if="evento.puntuacion" class="mb-6">
                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <Star class="h-6 w-6 text-yellow-500 fill-current mr-2" />
                                <h3 class="font-semibold text-gray-900">Puntuación</h3>
                            </div>
                            <div class="text-3xl font-bold text-yellow-600">{{ evento.puntuacion }}/5</div>
                        </div>
                    </div>

                    <div v-if="evento.comentario" class="mb-6">
                        <div class="flex items-center mb-3">
                            <MessageCircle class="h-5 w-5 text-green-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Comentario</h2>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ evento.comentario }}</p>
                        </div>
                    </div>

                    <div v-if="evento.fecha" class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="h-5 w-5 text-blue-600 mr-2">📅</span>
                            <h2 class="text-xl font-semibold text-gray-900">Fecha del Evento</h2>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ formatearFecha(evento.fecha)
                                }}</p>
                        </div>
                    </div>

                    <div v-if="evento.imagen" class="mb-6">
                        <div class="flex items-center mb-4">
                            <Camera class="h-5 w-5 text-pink-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Fotos del Evento</h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img :src="`/images/${evento.imagen}`" :alt="`Foto del evento ${evento.nombre}`"
                                    class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                <div class="p-2 text-center">
                                    <span class="text-sm text-gray-600">Recuerdo del evento</span>
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
                        ¿Estás seguro de que deseas eliminar <strong>{{ evento.nombre }}</strong>? Esta acción no se
                        puede deshacer.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button @click="eliminarEvento" :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!evento" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-indigo-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-indigo-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando información del evento...</p>
            </div>
        </div>
    </div>
</template>
