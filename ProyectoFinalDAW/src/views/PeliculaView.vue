<script>
import { mapActions } from 'pinia';
import { useDataStore } from '@/stores/store';
import { ArrowLeft, Calendar, Star, Film, User, Tag, MessageCircle, Camera, AlertTriangle } from 'lucide-vue-next';
import FormPeliculas from '@/components/FormPeliculas.vue';
import { useToast } from "vue-toastification";

export default {
    components: {
        ArrowLeft,
        Calendar,
        Star,
        Film,
        User,
        Tag,
        MessageCircle,
        Camera,
        AlertTriangle,
        FormPeliculas
    },
    data() {
        return {
            pelicula: null,
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
        ...mapActions(useDataStore, ['getPeliculaById', 'removePelicula', 'formatearFecha']),
        
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
        
        peliculaActualizada(peliculaActualizada) {
            this.pelicula = peliculaActualizada;
            this.modoEdicion = false;
            this.toast.success("¡Película actualizada correctamente!", {
                timeout: 3000,
                icon: "🎬"
            });
        },
        
        confirmarEliminacion() {
            this.mostrarConfirmacion = true;
        },
        
        cancelarEliminacion() {
            this.mostrarConfirmacion = false;
        },
        
        async eliminarPelicula() {
            this.cargando = true;
            try {
                await this.removePelicula(this.pelicula.id);
                this.toast.success("Película eliminada correctamente", {
                    timeout: 3000,
                    icon: "🗑️"
                });
                this.$router.push('/');
            } catch (error) {
                console.error("Error al eliminar la película:", error);
                this.toast.error("Error al eliminar la película", {
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
        this.pelicula = await this.getPeliculaById(id);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <button @click="volver"
                class="mb-6 flex items-center text-red-600 hover:text-red-800 transition-colors font-medium">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al inicio
            </button>

            <!-- Modo edición -->
            <FormPeliculas 
                v-if="modoEdicion && pelicula" 
                :pelicula-to-edit="pelicula"
                @cerrar="cancelarEdicion"
                @guardado="peliculaActualizada"
            />

            <!-- Modo visualización -->
            <div v-else-if="pelicula" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center">
                            <Film class="h-8 w-8 mr-3" />
                            <h1 class="text-3xl font-bold">{{ pelicula.titulo }}</h1>
                        </div>
                        <div
                            class="bg-white text-red-600 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                            <Film class="h-4 w-4 mr-1" />
                            Película
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div class="flex items-center mb-2">
                                <User class="h-5 w-5 text-blue-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Director</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ pelicula.director }}</p>
                        </div>

                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div class="flex items-center mb-2">
                                <Tag class="h-5 w-5 text-purple-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Género</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ pelicula.genero }}</p>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div class="flex items-center mb-2">
                                <Calendar class="h-5 w-5 text-green-600 mr-2" />
                                <h3 class="font-semibold text-gray-900">Fecha de Visualización</h3>
                            </div>
                            <p class="text-gray-700 font-medium">{{ formatoFecha(pelicula.fecha_vista) }}</p>
                        </div>
                    </div>

                    <div v-if="pelicula.puntuacion" class="mb-6">
                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                            <div class="flex items-center justify-center mb-2">
                                <Star class="h-6 w-6 text-yellow-500 fill-current mr-2" />
                                <h3 class="font-semibold text-gray-900">Puntuación</h3>
                            </div>
                            <div class="text-3xl font-bold text-yellow-600">{{ pelicula.puntuacion }}/5</div>
                        </div>
                    </div>

                    <div v-if="pelicula.comentario" class="mb-6">
                        <div class="flex items-center mb-3">
                            <MessageCircle class="h-5 w-5 text-indigo-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Comentario</h2>
                        </div>
                        <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ pelicula.comentario }}</p>
                        </div>
                    </div>

                    <div v-if="pelicula.imagen" class="mb-6">
                        <div class="flex items-center mb-4">
                            <Camera class="h-5 w-5 text-pink-600 mr-2" />
                            <h2 class="text-xl font-semibold text-gray-900">Póster de la Película</h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                class="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <img :src="`/images/${pelicula.imagen}`"
                                    :alt="`Póster de la película ${pelicula.titulo}`"
                                    class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                                <div class="p-2 text-center">
                                    <span class="text-sm text-gray-600">{{ pelicula.titulo }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-6 flex justify-between">
                        <button
                            @click="activarEdicion"
                            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                            ✏️ Editar
                        </button>
                        <button
                            @click="confirmarEliminacion"
                            class="px-6 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de confirmación de eliminación -->
            <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                    <div class="flex items-center mb-4 text-red-600">
                        <AlertTriangle class="h-6 w-6 mr-2" />
                        <h3 class="text-xl font-bold">Confirmar eliminación</h3>
                    </div>
                    
                    <p class="mb-6 text-gray-700">
                        ¿Estás seguro de que deseas eliminar <strong>{{ pelicula.titulo }}</strong>? Esta acción no se puede deshacer.
                    </p>
                    
                    <div class="flex justify-end space-x-3">
                        <button 
                            @click="cancelarEliminacion"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            @click="eliminarPelicula"
                            :disabled="cargando"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-else-if="!pelicula" class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="animate-pulse flex flex-col items-center">
                    <div class="h-12 w-12 bg-red-200 rounded-full mb-4"></div>
                    <div class="h-4 w-32 bg-red-200 rounded mb-3"></div>
                    <div class="h-3 w-24 bg-red-100 rounded"></div>
                </div>
                <p class="mt-4 text-gray-600 font-medium">Cargando información de la película...</p>
            </div>
        </div>
    </div>
</template>
