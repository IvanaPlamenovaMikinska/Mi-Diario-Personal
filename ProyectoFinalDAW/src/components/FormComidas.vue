<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { UtensilsCrossed, MapPin, Star, Camera, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormComidas",
    components: {
        Form,
        Field,
        ErrorMessage,
        UtensilsCrossed,
        MapPin,
        Star,
        Camera,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        comidaToEdit: {
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
            comida: {
                id: this.comidaToEdit?.id || null,
                plato: this.comidaToEdit?.plato || '',
                restaurante: this.comidaToEdit?.restaurante || '',
                ubicacion: this.comidaToEdit?.ubicacion || '',
                puntuacion: this.comidaToEdit?.puntuacion || null,
                comentario: this.comidaToEdit?.comentario || '',
                imagen: this.comidaToEdit?.imagen || '',
                imagenPreview: this.comidaToEdit?.imagen ? `/images/${this.comidaToEdit.imagen}` : '',
                fecha: this.comidaToEdit?.fecha || ''
            },
            isSubmitting: false,
            isEditing: !!this.comidaToEdit,
            mySchema: yup.object({
                plato: yup.string().required("El nombre del plato es obligatorio"),
                restaurante: yup.string().required("El restaurante es obligatorio"),
                ubicacion: yup.string().required("La ubicación es obligatoria"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(5, "La puntuación máxima es 5"),
                comentario: yup.string(),
                imagen: yup.string(),
                fecha: yup.date().required("La fecha es obligatoria")
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addComida', 'updateComida']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.comida.imagen = file.name;
                this.comida.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }

                values.imagen = this.comida.imagen;
                values.fecha = this.comida.fecha;

                let comidaGuardada;
                if (this.isEditing) {
                    values.id = this.comida.id;
                    if (!values.fecha) values.fecha = new Date().toISOString().split('T')[0];
                    comidaGuardada = await this.updateComida(values);
                    this.toast.success(`¡${values.plato} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🍽️"
                    });
                } else {
                    if (!values.fecha) values.fecha = new Date().toISOString().split('T')[0];
                    comidaGuardada = await this.addComida(values);
                    this.toast.success(`¡${values.plato} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🍽️"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetComida();
                }

                this.$emit('guardado', comidaGuardada);

            } catch (error) {
                console.error("Error al guardar la comida:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la comida. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetComida() {
            this.comida = {
                id: null,
                plato: '',
                restaurante: '',
                ubicacion: '',
                puntuacion: null,
                comentario: '',
                imagen: '',
                imagenPreview: '',
                fecha: ''
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.comida.plato && !this.isEditing) ||
                (this.isEditing && (
                    this.comida.plato !== this.comidaToEdit.plato ||
                    this.comida.restaurante !== this.comidaToEdit.restaurante ||
                    this.comida.ubicacion !== this.comidaToEdit.ubicacion ||
                    this.comida.puntuacion !== this.comidaToEdit.puntuacion ||
                    this.comida.comentario !== this.comidaToEdit.comentario ||
                    this.comida.imagen !== this.comidaToEdit.imagen ||
                    this.comida.fecha !== this.comidaToEdit.fecha
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },
        setPuntuacion(rating) {
            this.comida.puntuacion = Number(rating);
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
            <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <UtensilsCrossed class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Comida' : 'Nueva Comida' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-orange-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <UtensilsCrossed class="h-5 w-5 text-orange-500 mr-2" />
                                Información del Plato
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="plato" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Plato *
                                    </label>
                                    <Field name="plato" v-model="comida.plato" v-slot="{ field, meta, errors }">
                                        <input id="plato" v-bind="field" type="text" placeholder="Ej: Paella Valenciana"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="restaurante" class="block text-sm font-medium text-gray-700 mb-2">
                                        Restaurante *
                                    </label>
                                    <Field name="restaurante" v-model="comida.restaurante"
                                        v-slot="{ field, meta, errors }">
                                        <input id="restaurante" v-bind="field" type="text"
                                            placeholder="Nombre del restaurante"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>
                            </div>

                            <div class="mt-4">
                                <label for="ubicacion"
                                    class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <MapPin class="h-4 w-4 text-gray-500 mr-1" />
                                    Ubicación *
                                </label>
                                <Field name="ubicacion" v-model="comida.ubicacion" v-slot="{ field, meta, errors }">
                                    <input id="ubicacion" v-bind="field" type="text"
                                        placeholder="Ciudad, país o dirección"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                        :class="{ 'border-red-500': meta.touched && errors.length }" />
                                    <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                        {{ errors[0] }}
                                    </span>
                                </Field>
                            </div>
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
                                        :class="star <= comida.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="comida.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ comida.puntuacion }} de 5 estrellas
                                </span>
                            </div>

                            <Field name="puntuacion" v-model.number="comida.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span class="h-5 w-5 text-blue-500 mr-2">📅</span>
                                Fecha de la Comida
                            </h3>
                            <Field name="fecha" v-model="comida.fecha" v-slot="{ field, meta, errors }">
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
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="comida.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Describe tu experiencia, sabores, presentación, servicio..."
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

                                <div v-if="comida.imagenPreview" class="relative">
                                    <img :src="comida.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="comida.imagenPreview = ''; comida.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Comida' : 'Guardar Comida') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>