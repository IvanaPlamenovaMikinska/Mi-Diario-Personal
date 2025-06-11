<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store'
import { mapActions } from 'pinia';
import { Tv, User, Tag, Star, Camera, MessageSquare, Save, X, Calendar, Monitor } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormSeries",
    components: {
        Form,
        Field,
        ErrorMessage,
        Tv,
        User,
        Tag,
        Star,
        Camera,
        MessageSquare,
        Save,
        X,
        Calendar,
        Monitor
    },
    emits: ['cerrar', 'guardado'],
    props: {
        serieToEdit: {
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
            serie: {
                id: this.serieToEdit?.id || null,
                nombre: this.serieToEdit?.nombre || '',
                temporada: this.serieToEdit?.temporada || null,
                plataforma: this.serieToEdit?.plataforma || '',
                puntuacion: this.serieToEdit?.puntuacion || null,
                comentario: this.serieToEdit?.comentario || '',
                fecha_vista: this.serieToEdit?.fecha_vista || '',
                imagen: this.serieToEdit?.imagen || '',
                imagenPreview: this.serieToEdit?.imagen ? `/images/${this.serieToEdit.imagen}` : ''
            },
            isSubmitting: false,
            isEditing: !!this.serieToEdit,
            mySchema: yup.object({
                nombre: yup.string().required("El nombre es obligatorio"),
                temporada: yup
                    .number()
                    .required("La temporada es obligatoria")
                    .min(1, "Debe tener al menos una temporada"),
                plataforma: yup.string().required("La plataforma es obligatoria"),
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
        ...mapActions(useDataStore, ['addSerie', 'updateSerie']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.serie.imagen = file.name;
                this.serie.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }

                values.imagen = this.serie.imagen;

                let serieGuardada;
                if (this.isEditing) {
                    values.id = this.serie.id;
                    serieGuardada = await this.updateSerie(values);
                    this.toast.success(`¡${values.nombre} actualizada exitosamente!`, {
                        timeout: 3000,
                        icon: "📺"
                    });
                } else {
                    serieGuardada = await this.addSerie(values);
                    this.toast.success(`¡${values.nombre} guardada exitosamente!`, {
                        timeout: 3000,
                        icon: "📺"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetSerie();
                }

                this.$emit('guardado', serieGuardada);

            } catch (error) {
                console.error("Error al guardar la serie:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la serie. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetSerie() {
            this.serie = {
                id: null,
                nombre: '',
                temporada: null,
                plataforma: '',
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
            if ((this.serie.nombre && !this.isEditing) ||
                (this.isEditing && (
                    this.serie.nombre !== this.serieToEdit.nombre ||
                    this.serie.temporada !== this.serieToEdit.temporada ||
                    this.serie.plataforma !== this.serieToEdit.plataforma ||
                    this.serie.puntuacion !== this.serieToEdit.puntuacion ||
                    this.serie.comentario !== this.serieToEdit.comentario ||
                    this.serie.fecha_vista !== this.serieToEdit.fecha_vista ||
                    this.serie.imagen !== this.serieToEdit.imagen
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },

        setPuntuacion(rating) {
            this.serie.puntuacion = Number(rating);
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
            <div class="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Tv class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Serie' : 'Nueva Serie' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-violet-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Tv class="h-5 w-5 text-violet-500 mr-2" />
                                Información de la Serie
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la Serie *
                                    </label>
                                    <Field name="nombre" v-model="serie.nombre" v-slot="{ field, meta, errors }">
                                        <input id="nombre" v-bind="field" type="text"
                                            placeholder="Ej: Breaking Bad, Stranger Things"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="temporada"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <User class="h-4 w-4 text-gray-500 mr-1" />
                                            Temporada *
                                        </label>
                                        <Field name="temporada" v-model.number="serie.temporada"
                                            v-slot="{ field, meta, errors }">
                                            <input id="temporada" v-bind="field" type="number" min="1" placeholder="1"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="plataforma"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Monitor class="h-4 w-4 text-gray-500 mr-1" />
                                            Plataforma *
                                        </label>
                                        <Field name="plataforma" v-model="serie.plataforma"
                                            v-slot="{ field, meta, errors }">
                                            <input id="plataforma" v-bind="field" type="text"
                                                placeholder="Ej: Netflix, HBO, Disney+"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label for="fecha_vista"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                        Fecha de Visualización *
                                    </label>
                                    <Field name="fecha_vista" v-model="serie.fecha_vista"
                                        v-slot="{ field, meta, errors }">
                                        <input id="fecha_vista" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
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
                                        :class="star <= serie.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="serie.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ serie.puntuacion }} de 5
                                </span>
                            </div>

                            <!-- Campo oculto para la validación -->
                            <Field name="puntuacion" v-model.number="serie.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="serie.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Comparte tu opinión sobre la serie, momentos favoritos, personajes que te gustaron..."
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
                                Póster de la Serie (Opcional)
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
                                        <input id="imagen" type="file" accept="image/*" @change="onFileChange"
                                            ref="imagenInput" class="hidden" />
                                    </label>
                                </div>

                                <div v-if="serie.imagenPreview" class="relative">
                                    <img :src="serie.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="serie.imagenPreview = ''; serie.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Serie' : 'Guardar Serie') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
