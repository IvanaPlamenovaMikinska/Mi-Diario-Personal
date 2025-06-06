<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Calendar, Star, MapPin, Plane, Clock, Camera, AlertTriangle } from 'lucide-vue-next';
import FormViajes from '@/components/FormViajes.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Calendar,
        Star,
        MapPin,
        Plane,
        Clock,
        Camera,
        AlertTriangle,
        FormViajes
    },
    data() {
        return {
            viaje: null,
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
        ...mapActions(useDataStore, ['getViajeById', 'removeViaje', 'formatearFecha']),

        formatearFechas(fechas) {
            if (!fechas) return '';
            const partes = fechas.split(' al ');
            if (partes.length !== 2) return fechas;
            const inicioFormateado = this.formatearFecha(partes[0]);
            const finFormateado = this.formatearFecha(partes[1]);
            return `${inicioFormateado} al ${finFormateado}`;
        },

        volver() {
            this.$router.push('/');
        },

        activarEdicion() {
            this.modoEdicion = true;
        },

        cancelarEdicion() {
            this.modoEdicion = false;
        },

        viajeActualizado(viajeActualizado) {
            this.viaje = viajeActualizado;
            this.modoEdicion = false;
            this.toast.success("¡Viaje actualizado correctamente!", {
                timeout: 3000,
                icon: "✈️"
            });
        },

        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },

        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },

        async eliminarViaje() {
            this.cargando = true;
            try {
                await this.removeViaje(this.viaje.id);
                this.toast.success("Viaje eliminado correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar el viaje:", error);
                this.toast.error("Error al eliminar el viaje", {
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
        this.viaje = await this.getViajeById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <!-- Modo edición -->
            <FormViajes v-if="modoEdicion && viaje" :viaje-to-edit="viaje" @cerrar="cancelarEdicion"
                @guardado="viajeActualizado" />

            <!-- Modo visualización -->
            <div v-else-if="viaje" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <MapPin class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">{{ viaje.destino }}</h1>
                        </div>
                        <div
                            class="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Plane class="h-4 w-4 mr-1" />
                            Viaje
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div class="flex items-center mb-2">
                                <Calendar class="h-5 w-5 text-blue-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Fechas del Viaje</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ formatearFechas(viaje.fechas) }}</p>
                        </div>

                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div class="flex items-center mb-2">
                                <Plane class="h-5 w-5 text-purple-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Transporte</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ viaje.transporte }}</p>
                        </div>
                    </div>

                    <div v-if="viaje.puntuacion" class="mb-6">
                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <Star class="h-6 w-6 text-yellow-500 fill-current mr-2" />
                                <h3 class="font-semibold text-gray-900">Puntuación del Viaje</h3>
                            </div>
                            <div class="text-3xl font-bold text-yellow-600">{{ viaje.puntuacion }}/5</div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <Clock class="h-5 w-5 text-green-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Actividades Realizadas</h2>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ viaje.actividades }}</p>
                        </div>
                    </div>

                    <div v-if="viaje.fotos && viaje.fotos.length" class="mb-6">
                        <div class="flex items-center mb-4">
                            <Camera class="h-5 w-5 text-indigo-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Fotos del Viaje ({{ viaje.fotos.length }})
                            </h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="(foto, index) in viaje.fotos" :key="index"
                                class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img :src="`/images/${foto}`" :alt="`Foto ${index + 1} del viaje a ${viaje.destino}`"
                                    class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                <div class="p-2 text-center">
                                    <span class="text-sm text-gray-600">Foto {{ index + 1 }}</span>
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
                        ¿Estás seguro de que deseas eliminar el viaje a <strong>{{ viaje.destino }}</strong>? Esta
                        acción no se puede deshacer.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button @click="eliminarViaje" :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!viaje" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-blue-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-blue-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando información del viaje...</p>
            </div>
        </div>
    </div>
</template>
