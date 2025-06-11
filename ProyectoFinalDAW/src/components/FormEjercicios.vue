<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Activity, Clock, Calendar, TrendingUp, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormEjercicios",
    components: {
        Form,
        Field,
        ErrorMessage,
        Activity,
        Clock,
        Calendar,
        TrendingUp,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        ejercicioToEdit: {
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
            ejercicio: {
                id: this.ejercicioToEdit?.id || null,
                actividad: this.ejercicioToEdit?.actividad || '',
                duracion: this.ejercicioToEdit ? this.convertirDuracionATime(this.ejercicioToEdit.duracion) : '',
                fecha: this.ejercicioToEdit?.fecha || '',
                progreso: this.ejercicioToEdit?.progreso || ''
            },
            isSubmitting: false,
            isEditing: !!this.ejercicioToEdit,
            mySchema: yup.object({
                actividad: yup.string().required("La actividad es obligatoria"),
                duracion: yup.string().required("La duración es obligatoria"),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida"),
                progreso: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addEjercicio', 'updateEjercicio']),

        convertirDuracionATime(duracionTexto) {
            if (!duracionTexto) return '';

            const horasMatch = duracionTexto.match(/(\d+)h/);
            const minutosMatch = duracionTexto.match(/(\d+)min/);

            const horas = horasMatch ? parseInt(horasMatch[1]) : 0;
            const minutos = minutosMatch ? parseInt(minutosMatch[1]) : 0;

            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        },

        convertirTimeADuracion(timeValue) {
            if (!timeValue) return '';

            const [hours, minutes] = timeValue.split(':');
            let duracionTexto = '';

            if (+hours > 0) duracionTexto += `${+hours}h `;
            if (+minutes > 0) duracionTexto += `${+minutes}min`;

            return duracionTexto.trim();
        },

        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                values.duracion = this.convertirTimeADuracion(values.duracion);

                let ejercicioGuardado;
                if (this.isEditing) {
                    values.id = this.ejercicio.id;
                    ejercicioGuardado = await this.updateEjercicio(values);
                    this.toast.success(`¡${values.actividad} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "💪"
                    });
                } else {
                    ejercicioGuardado = await this.addEjercicio(values);
                    this.toast.success(`¡${values.actividad} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "💪"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetEjercicio();
                }

                this.$emit('guardado', ejercicioGuardado);

            } catch (error) {
                console.error("Error al guardar el ejercicio:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el ejercicio. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },

        resetEjercicio() {
            this.ejercicio = {
                id: null,
                actividad: '',
                duracion: '',
                fecha: '',
                progreso: ''
            };
        },

        cerrarFormulario() {
            if ((this.ejercicio.actividad && !this.isEditing) ||
                (this.isEditing && (
                    this.ejercicio.actividad !== this.ejercicioToEdit.actividad ||
                    this.convertirTimeADuracion(this.ejercicio.duracion) !== this.ejercicioToEdit.duracion ||
                    this.ejercicio.fecha !== this.ejercicioToEdit.fecha ||
                    this.ejercicio.progreso !== this.ejercicioToEdit.progreso
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        }
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Activity class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-green-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Activity class="h-5 w-5 text-green-500 mr-2" />
                                Información del Ejercicio
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="actividad" class="block text-sm font-medium text-gray-700 mb-2">
                                        Actividad *
                                    </label>
                                    <Field name="actividad" v-model="ejercicio.actividad"
                                        v-slot="{ field, meta, errors }">
                                        <input id="actividad" v-bind="field" type="text"
                                            placeholder="Ej: Correr, Natación, Yoga"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="duracion"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Clock class="h-4 w-4 text-gray-500 mr-1" />
                                        Duración *
                                    </label>
                                    <Field name="duracion" v-model="ejercicio.duracion"
                                        v-slot="{ field, meta, errors }">
                                        <input id="duracion" v-bind="field" type="time" step="60"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>
                            </div>

                            <div class="mt-4">
                                <label for="fecha"
                                    class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                    Fecha *
                                </label>
                                <Field name="fecha" v-model="ejercicio.fecha" v-slot="{ field, meta, errors }">
                                    <input id="fecha" v-bind="field" type="date"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        :class="{ 'border-red-500': meta.touched && errors.length }" />
                                    <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                        {{ errors[0] }}
                                    </span>
                                </Field>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <TrendingUp class="h-5 w-5 text-blue-500 mr-2" />
                                Progreso y Notas
                            </h3>

                            <Field name="progreso" as="textarea" v-model="ejercicio.progreso"
                                v-slot="{ field, meta, errors }">
                                <textarea id="progreso" v-bind="field" rows="4"
                                    placeholder="Describe tu progreso, sensaciones, logros, dificultades..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    :class="{ 'border-red-500': meta.touched && errors.length }"></textarea>
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="flex justify-end space-x-3 pt-6">
                            <button type="button" @click="cerrarFormulario"
                                class="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Ejercicio' : 'Guardar Ejercicio') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>