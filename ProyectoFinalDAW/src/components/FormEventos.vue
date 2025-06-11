<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Music, MapPin, Users, Star, Camera, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormEventos",
    components: {
        Form,
        Field,
        ErrorMessage,
        Music,
        MapPin,
        Users,
        Star,
        Camera,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        eventoToEdit: {
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
            evento: {
                id: this.eventoToEdit?.id || null,
                nombre: this.eventoToEdit?.nombre || '',
                ubicacion: this.eventoToEdit?.ubicacion || '',
                artistas: this.eventoToEdit?.artistas || '',
                puntuacion: this.eventoToEdit?.puntuacion || null,
                comentario: this.eventoToEdit?.comentario || '',
                imagen: this.eventoToEdit?.imagen || '',
                imagenPreview: this.eventoToEdit?.imagen ? `/images/${this.eventoToEdit.imagen}` : '',
                fecha: this.eventoToEdit?.fecha || ''
            },
            isSubmitting: false,
            isEditing: !!this.eventoToEdit,
            mySchema: yup.object({
                nombre: yup.string().required("El nombre del evento es obligatorio"),
                ubicacion: yup.string().required("La ubicación es obligatoria"),
                artistas: yup.string().required("Los artistas son obligatorios"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(5, "La puntuación máxima es 5"),
                comentario: yup.string(),
                fecha: yup.date().required("La fecha del evento es obligatoria"),
                imagen: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addEvento', 'updateEvento']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.evento.imagen = file.name;
                this.evento.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }

                values.imagen = this.evento.imagen;
                values.fecha = this.evento.fecha;

                let eventoGuardado;
                if (this.isEditing) {
                    values.id = this.evento.id;
                    eventoGuardado = await this.updateEvento(values);
                    this.toast.success(`¡${values.nombre} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎉"
                    });
                } else {
                    if (!values.fecha) values.fecha = new Date().toISOString().split('T')[0];
                    eventoGuardado = await this.addEvento(values);
                    this.toast.success(`¡${values.nombre} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎉"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetEvento();
                }

                this.$emit('guardado', eventoGuardado);

            } catch (error) {
                console.error("Error al guardar el evento:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el evento. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetEvento() {
            this.evento = {
                id: null,
                nombre: '',
                ubicacion: '',
                artistas: '',
                puntuacion: null,
                comentario: '',
                imagen: '',
                imagenPreview: '',
                fecha: '',
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.evento.nombre && !this.isEditing) ||
                (this.isEditing && (
                    this.evento.nombre !== this.eventoToEdit.nombre ||
                    this.evento.ubicacion !== this.eventoToEdit.ubicacion ||
                    this.evento.artistas !== this.eventoToEdit.artistas ||
                    this.evento.puntuacion !== this.eventoToEdit.puntuacion ||
                    this.evento.comentario !== this.eventoToEdit.comentario ||
                    this.evento.imagen !== this.eventoToEdit.imagen ||
                    this.evento.fecha !== this.eventoToEdit.fecha
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },
        setPuntuacion(rating) {
            this.evento.puntuacion = Number(rating);
            this.toast.info(`Puntuación: ${rating} estrella${rating > 1 ? 's' : ''}`, {
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
            <div class="bg-gradient-to-r from-indigo-500 to-violet-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Music class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Evento' : 'Nuevo Evento' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-indigo-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Music class="h-5 w-5 text-indigo-500 mr-2" />
                                Información del Evento
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Evento *
                                    </label>
                                    <Field name="nombre" v-model="evento.nombre" v-slot="{ field, meta, errors }">
                                        <input id="nombre" v-bind="field" type="text"
                                            placeholder="Ej: Concierto de Coldplay"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="ubicacion"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <MapPin class="h-4 w-4 text-gray-500 mr-1" />
                                        Ubicación *
                                    </label>
                                    <Field name="ubicacion" v-model="evento.ubicacion" v-slot="{ field, meta, errors }">
                                        <input id="ubicacion" v-bind="field" type="text"
                                            placeholder="Estadio, ciudad, país"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="artistas"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Users class="h-4 w-4 text-gray-500 mr-1" />
                                        Artistas *
                                    </label>
                                    <Field name="artistas" v-model="evento.artistas" v-slot="{ field, meta, errors }">
                                        <input id="artistas" v-bind="field" type="text"
                                            placeholder="Nombres de los artistas o bandas"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                                <span class="h-5 w-5 text-blue-500 mr-2">📅</span>
                                Fecha del Evento
                            </h3>
                            <Field name="fecha" v-model="evento.fecha" v-slot="{ field, meta, errors }">
                                <input id="fecha" v-bind="field" type="date"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    :class="{ 'border-red-500': meta.touched && errors.length }" />
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Star class="h-5 w-5 text-yellow-500 mr-2" />
                                Puntuación
                            </h3>

                            <div class="flex items-center space-x-1">
                                <button v-for="star in 5" :key="star" type="button" @click="setPuntuacion(star)"
                                    class="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition-transform hover:scale-110">
                                    <Star class="h-8 w-8 transition-colors"
                                        :class="star <= evento.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="evento.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ evento.puntuacion }} de 5 estrellas
                                </span>
                            </div>

                            <Field name="puntuacion" v-model.number="evento.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="evento.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Describe tu experiencia, la música, el ambiente, los momentos destacados..."
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
                                Imagen (Opcional)
                            </h3>

                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full">
                                    <label for="imagen"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera class="w-8 h-8 mb-2 text-gray-400" />
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold">Haz clic para subir</span> una imagen
                                            </p>
                                            <p class="text-xs text-gray-500">PNG, JPG o JPEG</p>
                                        </div>
                                        <input id="imagen" type="file" accept="image/*" @change="onFileChange"
                                            ref="imagenInput" class="hidden" />
                                    </label>
                                </div>

                                <div v-if="evento.imagenPreview" class="relative">
                                    <img :src="evento.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="evento.imagenPreview = ''; evento.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Evento' : 'Guardar Evento') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
