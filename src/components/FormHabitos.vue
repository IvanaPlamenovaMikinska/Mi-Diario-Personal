<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Target, Clock, Calendar, TrendingUp, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormHabitos",
    components: {
        Form,
        Field,
        ErrorMessage,
        Target,
        Clock,
        Calendar,
        TrendingUp,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        habitoToEdit: {
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
            habito: {
                id: this.habitoToEdit?.id || null,
                habito: this.habitoToEdit?.habito || '',
                duracion: this.habitoToEdit?.duracion || '',
                fecha: this.habitoToEdit?.fecha || '',
                cambios: this.habitoToEdit?.cambios || ''
            },
            isSubmitting: false,
            isEditing: !!this.habitoToEdit,
            mySchema: yup.object({
                habito: yup.string().required("El hábito es obligatorio"),
                duracion: yup.string().required("La duración es obligatoria"),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida"),
                cambios: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addHabito', 'updateHabito']),

        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                let habitoGuardado;
                if (this.isEditing) {
                    values.id = this.habito.id;
                    habitoGuardado = await this.updateHabito(values);
                    this.toast.success(`¡${values.habito} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🔄"
                    });
                } else {
                    habitoGuardado = await this.addHabito(values);
                    this.toast.success(`¡${values.habito} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🔄"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetHabito();
                }

                this.$emit('guardado', habitoGuardado);

            } catch (error) {
                console.error("Error al guardar el hábito:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el hábito. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },

        resetHabito() {
            this.habito = {
                id: null,
                habito: '',
                duracion: '',
                fecha: '',
                cambios: ''
            };
        },

        cerrarFormulario() {
            if ((this.habito.habito && !this.isEditing) ||
                (this.isEditing && (
                    this.habito.habito !== this.habitoToEdit.habito ||
                    this.habito.duracion !== this.habitoToEdit.duracion ||
                    this.habito.fecha !== this.habitoToEdit.fecha ||
                    this.habito.cambios !== this.habitoToEdit.cambios
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
            <div class="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Target class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Hábito' : 'Nuevo Hábito' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-teal-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Target class="h-5 w-5 text-teal-500 mr-2" />
                                Información del Hábito
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="habito" class="block text-sm font-medium text-gray-700 mb-2">
                                        Hábito *
                                    </label>
                                    <Field name="habito" v-model="habito.habito" v-slot="{ field, meta, errors }">
                                        <input id="habito" v-bind="field" type="text"
                                            placeholder="Ej: Meditar 10 minutos diarios"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="duracion"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Clock class="h-4 w-4 text-gray-500 mr-1" />
                                            Duración *
                                        </label>
                                        <Field name="duracion" v-model="habito.duracion"
                                            v-slot="{ field, meta, errors }">
                                            <input id="duracion" v-bind="field" type="text"
                                                placeholder="Ej: 3 semanas, 30 días"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="fecha"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                            Fecha de Inicio *
                                        </label>
                                        <Field name="fecha" v-model="habito.fecha" v-slot="{ field, meta, errors }">
                                            <input id="fecha" v-bind="field" type="date"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <TrendingUp class="h-5 w-5 text-green-500 mr-2" />
                                Cambios y Progreso
                            </h3>

                            <Field name="cambios" as="textarea" v-model="habito.cambios"
                                v-slot="{ field, meta, errors }">
                                <textarea id="cambios" v-bind="field" rows="4"
                                    placeholder="Describe los cambios que has notado, beneficios, dificultades, progreso..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
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
                                class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Hábito' : 'Guardar Hábito') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
