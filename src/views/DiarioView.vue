<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Calendar, BookOpen, FileText, Camera, AlertTriangle } from 'lucide-vue-next';
import FormDiario from '@/components/FormDiario.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Calendar,
        BookOpen,
        FileText,
        Camera,
        AlertTriangle,
        FormDiario
    },
    data() {
        return {
            entrada: null,
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
        ...mapActions(useDataStore, ['getDiarioById', 'removeDiario', 'formatearFecha']),

        formatoFecha(fecha) {
            return this.formatearFecha(fecha);
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

        entradaActualizada(entradaActualizada) {
            this.entrada = entradaActualizada;
            this.modoEdicion = false;
            this.toast.success("¡Entrada del diario actualizada correctamente!", {
                timeout: 3000,
                icon: "📝"
            });
        },

        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },

        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },

        async eliminarEntrada() {
            this.cargando = true;
            try {
                await this.removeDiario(this.entrada.id);
                this.toast.success("Entrada del diario eliminada correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar la entrada:", error);
                this.toast.error("Error al eliminar la entrada del diario", {
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
        this.entrada = await this.getDiarioById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <!-- Modo edición -->
            <FormDiario v-if="modoEdicion && entrada" :diario-to-edit="entrada" @cerrar="cancelarEdicion"
                @guardado="entradaActualizada" />

            <!-- Modo visualización -->
            <div v-else-if="entrada" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <BookOpen class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">Entrada del Diario</h1>
                        </div>
                        <div
                            class="bg-white text-purple-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <FileText class="h-4 w-4 mr-1" />
                            Diario
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="mb-6">
                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div class="flex items-center mb-2">
                                <Calendar class="h-5 w-5 text-purple-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Fecha</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ formatoFecha(entrada.fecha) }}</p>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <FileText class="h-5 w-5 text-blue-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Contenido</h2>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ entrada.texto }}</p>
                        </div>
                    </div>

                    <div v-if="entrada.imagen" class="mb-6">
                        <div class="flex items-center mb-4">
                            <Camera class="h-5 w-5 text-pink-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Imagen de la Entrada</h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img :src="`/images/${entrada.imagen}`" :alt="`Imagen de la entrada del diario`"
                                    class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                <div class="p-2 text-center">
                                    <span class="text-sm text-gray-600">Recuerdo del día</span>
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
                        ¿Estás seguro de que deseas eliminar esta <strong>entrada del diario</strong>? Esta acción no se
                        puede deshacer.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button @click="eliminarEntrada" :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!entrada" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-purple-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-purple-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-purple-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando entrada del diario...</p>
            </div>
        </div>
    </div>
</template>
