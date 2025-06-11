<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store'
import { mapActions } from 'pinia';
import { MapPin, Calendar, Plane, Clock, Star, Camera, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormViajes",
    components: {
        Form,
        Field,
        ErrorMessage,
        MapPin,
        Calendar,
        Plane,
        Clock,
        Star,
        Camera,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        viajeToEdit: {
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
            viaje: {
                id: this.viajeToEdit?.id || null,
                destino: this.viajeToEdit?.destino || '',
                fecha_inicio: this.viajeToEdit?.fechas ? this.viajeToEdit.fechas.split(' al ')[0] : '',
                fecha_fin: this.viajeToEdit?.fechas ? this.viajeToEdit.fechas.split(' al ')[1] : '',
                transporte: this.viajeToEdit?.transporte || '',
                actividades: this.viajeToEdit?.actividades || '',
                puntuacion: this.viajeToEdit?.puntuacion || null,
                fotos: this.viajeToEdit?.fotos || [],
                fotosPreview: this.viajeToEdit?.fotos ? this.viajeToEdit.fotos.map(foto => `/images/${foto}`) : []
            },
            isSubmitting: false,
            isEditing: !!this.viajeToEdit,
            mySchema: yup.object({
                destino: yup.string().required("El destino es obligatorio"),
                fecha_inicio: yup.date()
                    .required("La fecha de inicio es obligatoria")
                    .typeError("Fecha de inicio inválida"),
                fecha_fin: yup.date()
                    .required("La fecha de fin es obligatoria")
                    .typeError("Fecha de fin inválida")
                    .min(yup.ref('fecha_inicio'), "La fecha de fin debe ser posterior a la de inicio"),
                transporte: yup.string().required("El transporte es obligatorio"),
                actividades: yup.string().required("Las actividades son obligatorias"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(5, "La puntuación máxima es 5"),
                fotos: yup.array().of(yup.string())
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addViaje', 'updateViaje']),
        onFileChange(event) {
            const files = Array.from(event.target.files);
            this.viaje.fotos = files.map(file => file.name);
            this.viaje.fotosPreview = files.map(file => URL.createObjectURL(file));
            this.toast.info(`${files.length} foto(s) cargada(s) correctamente`);
        },
        removePhoto(index) {
            this.viaje.fotos.splice(index, 1);
            this.viaje.fotosPreview.splice(index, 1);
            this.toast.info("Foto eliminada");
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }

                values.fotos = this.viaje.fotos;
                values.fechas = `${values.fecha_inicio} al ${values.fecha_fin}`;
                delete values.fecha_inicio;
                delete values.fecha_fin;

                let viajeGuardado;
                if (this.isEditing) {
                    values.id = this.viaje.id;
                    viajeGuardado = await this.updateViaje(values);
                    this.toast.success(`¡Viaje a ${values.destino} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "✈️"
                    });
                } else {
                    viajeGuardado = await this.addViaje(values);
                    this.toast.success(`¡Viaje a ${values.destino} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "✈️"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetViaje();
                }

                this.$emit('guardado', viajeGuardado);

            } catch (error) {
                console.error("Error al guardar el viaje:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el viaje. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetViaje() {
            this.viaje = {
                id: null,
                destino: '',
                fecha_inicio: '',
                fecha_fin: '',
                transporte: '',
                actividades: '',
                puntuacion: null,
                fotos: [],
                fotosPreview: []
            };
            if (this.$refs.fotosInput) {
                this.$refs.fotosInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.viaje.destino && !this.isEditing) ||
                (this.isEditing && (
                    this.viaje.destino !== this.viajeToEdit.destino ||
                    this.viaje.transporte !== this.viajeToEdit.transporte ||
                    this.viaje.actividades !== this.viajeToEdit.actividades ||
                    this.viaje.puntuacion !== this.viajeToEdit.puntuacion ||
                    JSON.stringify(this.viaje.fotos) !== JSON.stringify(this.viajeToEdit.fotos)
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },

        setPuntuacion(rating) {
            this.viaje.puntuacion = Number(rating);
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
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <MapPin class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Viaje' : 'Nuevo Viaje' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-blue-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin class="h-5 w-5 text-blue-500 mr-2" />
                                Información del Viaje
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="destino" class="block text-sm font-medium text-gray-700 mb-2">
                                        Destino *
                                    </label>
                                    <Field name="destino" v-model="viaje.destino" v-slot="{ field, meta, errors }">
                                        <input id="destino" v-bind="field" type="text"
                                            placeholder="Ej: París, Francia"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="fecha_inicio"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                            Fecha de Inicio *
                                        </label>
                                        <Field name="fecha_inicio" v-model="viaje.fecha_inicio"
                                            v-slot="{ field, meta, errors }">
                                            <input id="fecha_inicio" v-bind="field" type="date"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="fecha_fin"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                            Fecha de Fin *
                                        </label>
                                        <Field name="fecha_fin" v-model="viaje.fecha_fin"
                                            v-slot="{ field, meta, errors }">
                                            <input id="fecha_fin" v-bind="field" type="date"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label for="transporte"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Plane class="h-4 w-4 text-gray-500 mr-1" />
                                        Transporte *
                                    </label>
                                    <Field name="transporte" v-model="viaje.transporte"
                                        v-slot="{ field, meta, errors }">
                                        <select id="transporte" v-bind="field"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }">
                                            <option value="" disabled>Selecciona un transporte</option>
                                            <option value="Avión">✈️ Avión</option>
                                            <option value="Tren">🚆 Tren</option>
                                            <option value="Coche">🚗 Coche</option>
                                            <option value="Autobús">🚌 Autobús</option>
                                            <option value="Bicicleta">🚴 Bicicleta</option>
                                            <option value="A pie">🚶 A pie</option>
                                            <option value="Barco">🚢 Barco</option>
                                            <option value="Otro">🔄 Otro</option>
                                        </select>
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
                                        :class="star <= viaje.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="viaje.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ viaje.puntuacion }} de 5
                                </span>
                            </div>

                            <!-- Campo oculto para la validación -->
                            <Field name="puntuacion" v-model.number="viaje.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Clock class="h-5 w-5 text-purple-500 mr-2" />
                                Actividades Realizadas
                            </h3>

                            <Field name="actividades" as="textarea" v-model="viaje.actividades"
                                v-slot="{ field, meta, errors }">
                                <textarea id="actividades" v-bind="field" rows="4"
                                    placeholder="Describe las actividades que realizaste durante el viaje: lugares visitados, experiencias, comidas típicas..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                                    :class="{ 'border-red-500': meta.touched && errors.length }"></textarea>
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Camera class="h-5 w-5 text-pink-500 mr-2" />
                                Fotos del Viaje (Opcional)
                            </h3>

                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full">
                                    <label for="fotos"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera class="w-8 h-8 mb-2 text-gray-400" />
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold">Haz clic para subir</span> fotos del viaje
                                            </p>
                                            <p class="text-xs text-gray-500">PNG, JPG o JPEG (múltiples archivos)</p>
                                        </div>
                                        <input id="fotos" type="file" accept="image/*" multiple @change="onFileChange"
                                            ref="fotosInput" class="hidden" />
                                    </label>
                                </div>

                                <div v-if="viaje.fotosPreview.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div v-for="(src, index) in viaje.fotosPreview" :key="index" class="relative">
                                        <img :src="src" :alt="`Foto ${index + 1} del viaje`"
                                            class="w-full h-32 object-cover rounded-lg border" />
                                        <button type="button" @click="removePhoto(index)"
                                            class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-6">
                            <button type="button" @click="cerrarFormulario"
                                class="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Viaje' : 'Guardar Viaje') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
