<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { BookOpen, User, Tag, Star, Camera, MessageSquare, Save, X, Calendar } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormLibros",
    components: {
        Form,
        Field,
        ErrorMessage,
        BookOpen,
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
        libroToEdit: {
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
            libro: {
                id: this.libroToEdit?.id || null,
                titulo: this.libroToEdit?.titulo || '',
                autor: this.libroToEdit?.autor || '',
                genero: this.libroToEdit?.genero || '',
                puntuacion: this.libroToEdit?.puntuacion || null,
                comentario: this.libroToEdit?.comentario || '',
                fecha_lectura: this.libroToEdit?.fecha_lectura || '',
                imagen: this.libroToEdit?.imagen || '',
                imagenPreview: this.libroToEdit?.imagen ? `/images/${this.libroToEdit.imagen}` : ''
            },
            isSubmitting: false,
            isEditing: !!this.libroToEdit,
            mySchema: yup.object({
                titulo: yup.string().required("El título es obligatorio"),
                autor: yup.string().required("El autor es obligatorio"),
                genero: yup.string().required("El género es obligatorio"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(10, "La puntuación máxima es 5"),
                comentario: yup.string(),
                fecha_lectura: yup.date()
                    .required("La fecha de lectura es obligatoria")
                    .typeError("Fecha inválida"),
                imagen: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addLibro', 'updateLibro']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.libro.imagen = file.name;
                this.libro.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }

                values.imagen = this.libro.imagen;

                let libroGuardado;
                if (this.isEditing) {
                    values.id = this.libro.id;
                    libroGuardado = await this.updateLibro(values);
                    this.toast.success(`¡${values.titulo} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "📚"
                    });
                } else {
                    libroGuardado = await this.addLibro(values);
                    this.toast.success(`¡${values.titulo} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "📚"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetLibro();
                }

                this.$emit('guardado', libroGuardado);

            } catch (error) {
                console.error("Error al guardar el libro:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el libro. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetLibro() {
            this.libro = {
                id: null,
                titulo: '',
                autor: '',
                genero: '',
                puntuacion: null,
                comentario: '',
                fecha_lectura: '',
                imagen: '',
                imagenPreview: ''
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.libro.titulo && !this.isEditing) ||
                (this.isEditing && (
                    this.libro.titulo !== this.libroToEdit.titulo ||
                    this.libro.autor !== this.libroToEdit.autor ||
                    this.libro.genero !== this.libroToEdit.genero ||
                    this.libro.puntuacion !== this.libroToEdit.puntuacion ||
                    this.libro.comentario !== this.libroToEdit.comentario ||
                    this.libro.fecha_lectura !== this.libroToEdit.fecha_lectura ||
                    this.libro.imagen !== this.libroToEdit.imagen
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },
        setPuntuacion(rating) {
            this.libro.puntuacion = Number(rating);
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
            <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <BookOpen class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Libro' : 'Nuevo Libro' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-amber-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <BookOpen class="h-5 w-5 text-amber-500 mr-2" />
                                Información del Libro
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
                                        Título *
                                    </label>
                                    <Field name="titulo" v-model="libro.titulo" v-slot="{ field, meta, errors }">
                                        <input id="titulo" v-bind="field" type="text"
                                            placeholder="Ej: Cien años de soledad"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="autor"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <User class="h-4 w-4 text-gray-500 mr-1" />
                                            Autor *
                                        </label>
                                        <Field name="autor" v-model="libro.autor" v-slot="{ field, meta, errors }">
                                            <input id="autor" v-bind="field" type="text" placeholder="Nombre del autor"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="genero"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Tag class="h-4 w-4 text-gray-500 mr-1" />
                                            Género *
                                        </label>
                                        <Field name="genero" v-model="libro.genero" v-slot="{ field, meta, errors }">
                                            <input id="genero" v-bind="field" type="text"
                                                placeholder="Ej: Ficción, Biografía"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label for="fecha_lectura"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                        Fecha de Lectura *
                                    </label>
                                    <Field name="fecha_lectura" v-model="libro.fecha_lectura"
                                        v-slot="{ field, meta, errors }">
                                        <input id="fecha_lectura" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
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
                                <button v-for="star in 5" :key="star" type="button" @click="setPuntuacion(star)"
                                    class="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition-transform hover:scale-110">
                                    <Star class="h-6 w-6 transition-colors"
                                        :class="star <= libro.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="libro.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ libro.puntuacion }} de 5
                                </span>
                            </div>

                            <!-- Campo oculto para la validación -->
                            <Field name="puntuacion" v-model.number="libro.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="libro.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Comparte tu opinión sobre el libro, personajes favoritos, momentos destacados..."
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
                                Portada (Opcional)
                            </h3>

                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full">
                                    <label for="imagen"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera class="w-8 h-8 mb-2 text-gray-400" />
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold">Haz clic para subir</span> la portada
                                            </p>
                                            <p class="text-xs text-gray-500">PNG, JPG o JPEG</p>
                                        </div>
                                        <input id="imagen" type="file" accept="image/*" @change="onFileChange"
                                            ref="imagenInput" class="hidden" />
                                    </label>
                                </div>

                                <div v-if="libro.imagenPreview" class="relative">
                                    <img :src="libro.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="libro.imagenPreview = ''; libro.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Libro' : 'Guardar Libro') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
