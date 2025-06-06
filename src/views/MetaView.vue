<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Calendar, Flag, TrendingUp, FileText, AlertTriangle } from 'lucide-vue-next';
import FormMetas from '@/components/FormMetas.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Calendar,
        Flag,
        TrendingUp,
        FileText,
        AlertTriangle,
        FormMetas
    },
    data() {
        return {
            meta: null,
            modoEdicion: false,
            mostrarConfirmacion: false,
            cargando: false
        };
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    computed: {
        diasRestantes() {
            if (!this.meta?.limite) return null;
            const hoy = new Date();
            const fechaLimite = new Date(this.meta.limite);
            const diferencia = fechaLimite - hoy;
            const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
            return dias;
        },
        estadoMeta() {
            const dias = this.diasRestantes;
            if (dias === null) return null;
            if (dias < 0) return 'vencida';
            if (dias <= 7) return 'urgente';
            if (dias <= 30) return 'proxima';
            return 'activa';
        }
    },
    methods: {
        ...mapActions(useDataStore, ['getMetaById', 'removeMeta', 'formatearFecha']),

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

        metaActualizada(metaActualizada) {
            this.meta = metaActualizada;
            this.modoEdicion = false;
            this.toast.success("¡Meta actualizada correctamente!", {
                timeout: 3000,
                icon: "🎯"
            });
        },

        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },

        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },

        async eliminarMeta() {
            this.cargando = true;
            try {
                await this.removeMeta(this.meta.id);
                this.toast.success("Meta eliminada correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar la meta:", error);
                this.toast.error("Error al eliminar la meta", {
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
        this.meta = await this.getMetaById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <!-- Modo edición -->
            <FormMetas v-if="modoEdicion && meta" :meta-to-edit="meta" @cerrar="cancelarEdicion"
                @guardado="metaActualizada" />

            <!-- Modo visualización -->
            <div v-else-if="meta" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <Flag class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">{{ meta.meta }}</h1>
                        </div>
                        <div
                            class="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Flag class="h-4 w-4 mr-1" />
                            Meta
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <!-- Estado de la meta -->
                    <div v-if="diasRestantes !== null" class="mb-6">
                        <div class="rounded-lg p-4 border text-center" :class="{
                            'bg-red-50 border-red-200': estadoMeta === 'vencida',
                            'bg-orange-50 border-orange-200': estadoMeta === 'urgente',
                            'bg-yellow-50 border-yellow-200': estadoMeta === 'proxima',
                            'bg-green-50 border-green-200': estadoMeta === 'activa'
                        }">
                            <div class="flex items-center justify-center mb-2">
                                <Calendar class="h-5 w-5 mr-2" :class="{
                                    'text-red-600': estadoMeta === 'vencida',
                                    'text-orange-600': estadoMeta === 'urgente',
                                    'text-yellow-600': estadoMeta === 'proxima',
                                    'text-green-600': estadoMeta === 'activa'
                                }" />
                                <h3 class="font-semibold text-gray-900">Estado de la Meta</h3>
                            </div>
                            <p class="font-medium" :class="{
                                'text-red-700': estadoMeta === 'vencida',
                                'text-orange-700': estadoMeta === 'urgente',
                                'text-yellow-700': estadoMeta === 'proxima',
                                'text-green-700': estadoMeta === 'activa'
                            }">
                                <span v-if="estadoMeta === 'vencida'">⚠️ Meta vencida ({{ Math.abs(diasRestantes) }}
                                    días de retraso)</span>
                                <span v-else-if="estadoMeta === 'urgente'">🔥 ¡Urgente! {{ diasRestantes }} días
                                    restantes</span>
                                <span v-else-if="estadoMeta === 'proxima'">⏰ {{ diasRestantes }} días restantes</span>
                                <span v-else>✅ {{ diasRestantes }} días restantes</span>
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div class="flex items-center mb-2">
                                <Calendar class="h-5 w-5 text-blue-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Fecha de Inicio</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ formatoFecha(meta.inicio) }}</p>
                        </div>

                        <div class="bg-red-50 rounded-lg p-4 border border-red-100">
                            <div class="flex items-center mb-2">
                                <Calendar class="h-5 w-5 text-red-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Fecha Límite</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ formatoFecha(meta.limite) }}</p>
                        </div>
                    </div>

                    <div v-if="meta.progreso" class="mb-6">
                        <div class="flex items-center mb-3">
                            <TrendingUp class="h-5 w-5 text-green-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Progreso</h2>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ meta.progreso }}</p>
                        </div>
                    </div>

                    <div v-if="meta.notas" class="mb-6">
                        <div class="flex items-center mb-3">
                            <FileText class="h-5 w-5 text-purple-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Notas</h2>
                        </div>
                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ meta.notas }}</p>
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
                        ¿Estás seguro de que deseas eliminar <strong>{{ meta.meta }}</strong>? Esta acción no se puede
                        deshacer.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button @click="eliminarMeta" :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!meta" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-blue-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-blue-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando información de la meta...</p>
            </div>
        </div>
    </div>
</template>
