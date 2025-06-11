<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Film, User, Tag, Star, Camera, MessageSquare, Save, X, Calendar } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormPeliculas",
    components: {
        Form,
        Field,
        ErrorMessage,
        Film,
        User,
        Tag,
        Star,
        Camera,
        MessageSquare,
        Save,
        X,
        Calendar
    },
    emits: ['cerrar', 'guardado'],
    props: {
        peliculaToEdit: {
            type: Object,
            default: null
        }
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            pelicula: {
                id: this.peliculaToEdit?.id || null,
                titulo: this.peliculaToEdit?.titulo || '',
                genero: this.peliculaToEdit?.genero || '',
                director: this.peliculaToEdit?.director || '',
                puntuacion: this.peliculaToEdit?.puntuacion || null,
                comentario: this.peliculaToEdit?.comentario || '',
                fecha_vista: this.peliculaToEdit?.fecha_vista || '',
                imagen: this.peliculaToEdit?.imagen || '',
                imagenPreview: this.peliculaToEdit?.imagen ? `/images/${this.peliculaToEdit.imagen}` : ''
            },
            isSubmitting: false,
            isEditing: !!this.peliculaToEdit,
            mySchema: yup.object({
                titulo: yup.string().required("El título es obligatorio"),
                genero: yup.string().required("El género es obligatorio"),
                director: yup.string().required("El director es obligatorio"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(5, "La puntuación máxima es 5"),
                comentario: yup.string(),
                fecha_vista: yup.date()
                    .required("La fecha de vista es obligatoria")
                    .typeError("Fecha inválida"),
                imagen: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addPelicula', 'updatePelicula']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.pelicula.imagen = file.name;
                this.pelicula.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }
                
                values.imagen = this.pelicula.imagen;

                let peliculaGuardada;
                if (this.isEditing) {
                    values.id = this.pelicula.id;
                    peliculaGuardada = await this.updatePelicula(values);
                    this.toast.success(`¡${values.titulo} actualizada exitosamente!`, {
                        timeout: 3000,
                        icon: "🎬"
                    });
                } else {
                    peliculaGuardada = await this.addPelicula(values);
                    this.toast.success(`¡${values.titulo} guardada exitosamente!`, {
                        timeout: 3000,
                        icon: "🎬"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetPelicula();
                }

                this.$emit('guardado', peliculaGuardada);

            } catch (error) {
                console.error("Error al guardar la película:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la película. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetPelicula() {
            this.pelicula = {
                id: null,
                titulo: '',
                genero: '',
                director: '',
                puntuacion: null,
                comentario: '',
                fecha_vista: '',
                imagen: '',
                imagenPreview: ''
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.pelicula.titulo && !this.isEditing) || 
                (this.isEditing && (
                    this.pelicula.titulo !== this.peliculaToEdit.titulo ||
                    this.pelicula.genero !== this.peliculaToEdit.genero ||
                    this.pelicula.director !== this.peliculaToEdit.director ||
                    this.pelicula.puntuacion !== this.peliculaToEdit.puntuacion ||
                    this.pelicula.comentario !== this.peliculaToEdit.comentario ||
                    this.pelicula.fecha_vista !== this.peliculaToEdit.fecha_vista ||
                    this.pelicula.imagen !== this.peliculaToEdit.imagen
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },
        setPuntuacion(rating) {
            this.pelicula.puntuacion = Number(rating);
            this.toast.info(`Puntuación: ${rating} de 5`, {
                timeout: 1500,
                hideProgressBar: true
            });
        }
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Film class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Película' : 'Nueva Película' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-red-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Film class="h-5 w-5 text-red-500 mr-2" />
                                Información de la Película
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
                                        Título *
                                    </label>
                                    <Field name="titulo" v-model="pelicula.titulo" v-slot="{ field, meta, errors }">
                                        <input id="titulo" v-bind="field" type="text" placeholder="Ej: El Padrino, Titanic"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="director" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <User class="h-4 w-4 text-gray-500 mr-1" />
                                            Director *
                                        </label>
                                        <Field name="director" v-model="pelicula.director" v-slot="{ field, meta, errors }">
                                            <input id="director" v-bind="field" type="text" placeholder="Nombre del director"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="genero" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Tag class="h-4 w-4 text-gray-500 mr-1" />
                                            Género *
                                        </label>
                                        <Field name="genero" v-model="pelicula.genero" v-slot="{ field, meta, errors }">
                                            <input id="genero" v-bind="field" type="text" placeholder="Ej: Drama, Comedia, Acción"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label for="fecha_vista" class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                        Fecha de Visualización *
                                    </label>
                                    <Field name="fecha_vista" v-model="pelicula.fecha_vista" v-slot="{ field, meta, errors }">
                                        <input id="fecha_vista" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Star class="h-5 w-5 text-yellow-500 mr-2" />
                                Puntuación (1-5)
                            </h3>

                            <div class="flex items-center space-x-1">
                                <button
                                    v-for="star in 5"
                                    :key="star"
                                    type="button"
                                    @click="setPuntuacion(star)"
                                    class="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition-transform hover:scale-110"
                                >
                                    <Star 
                                        class="h-8 w-8 transition-colors"
                                        :class="star <= pelicula.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                                    />
                                </button>
                                <span v-if="pelicula.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ pelicula.puntuacion }} de 5 estrellas
                                </span>
                            </div>
                            
                            <!-- Campo oculto para la validación -->
                            <Field name="puntuacion" v-model.number="pelicula.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="pelicula.comentario" v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Comparte tu opinión sobre la película, personajes favoritos, momentos destacados..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    :class="{ 'border-red-500': meta.touched && errors.length }"></textarea>
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Camera class="h-5 w-5 text-purple-500 mr-2" />
                                Póster de la Película (Opcional)
                            </h3>

                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full">
                                    <label for="imagen"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera class="w-8 h-8 mb-2 text-gray-400" />
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold">Haz clic para subir</span> el póster
                                            </p>
                                            <p class="text-xs text-gray-500">PNG, JPG o JPEG</p>
                                        </div>
                                        <input id="imagen" type="file" accept="image/*" @change="onFileChange" ref="imagenInput"
                                            class="hidden" />
                                    </label>
                                </div>

                                <div v-if="pelicula.imagenPreview" class="relative">
                                    <img :src="pelicula.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="pelicula.imagenPreview = ''; pelicula.imagen = ''; $refs.imagenInput.value = ''"
                                        class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                                        <X class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-6">
                            <button type="button" @click="cerrarFormulario"
                                class="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Película' : 'Guardar Película') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
