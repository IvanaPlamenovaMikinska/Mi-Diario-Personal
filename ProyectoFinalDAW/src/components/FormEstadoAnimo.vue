<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Smile, Heart, Calendar, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormEstadoAnimo",
    components: {
        Form,
        Field,
        ErrorMessage,
        Smile,
        Heart,
        Calendar,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        estadoToEdit: {
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
            estado: {
                id: this.estadoToEdit?.id || null,
                nivel_felicidad: this.estadoToEdit?.nivel_felicidad || null,
                reflexion: this.estadoToEdit?.reflexion || '',
                fecha: this.estadoToEdit?.fecha || ''
            },
            isSubmitting: false,
            isEditing: !!this.estadoToEdit,
            mySchema: yup.object({
                nivel_felicidad: yup
                    .number()
                    .required("El nivel de felicidad es obligatorio")
                    .min(1, "Mínimo 1")
                    .max(10, "Máximo 10"),
                reflexion: yup.string(),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida")
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addEstadoAnimo', 'updateEstadoAnimo']),

        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                values.nivel_felicidad = Number(values.nivel_felicidad);

                let estadoGuardado;
                if (this.isEditing) {
                    values.id = this.estado.id;
                    estadoGuardado = await this.updateEstadoAnimo(values);
                    this.toast.success("¡Estado de ánimo actualizado exitosamente!", {
                        timeout: 3000,
                        icon: "😊"
                    });
                } else {
                    estadoGuardado = await this.addEstadoAnimo(values);
                    this.toast.success("¡Estado de ánimo guardado exitosamente!", {
                        timeout: 3000,
                        icon: "😊"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetEstado();
                }

                this.$emit('guardado', estadoGuardado);

            } catch (error) {
                console.error("Error al guardar el estado de ánimo:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el estado de ánimo. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },

        resetEstado() {
            this.estado = {
                id: null,
                nivel_felicidad: null,
                reflexion: '',
                fecha: ''
            };
        },

        cerrarFormulario() {
            if ((this.estado.nivel_felicidad && !this.isEditing) ||
                (this.isEditing && (
                    this.estado.nivel_felicidad !== this.estadoToEdit.nivel_felicidad ||
                    this.estado.reflexion !== this.estadoToEdit.reflexion ||
                    this.estado.fecha !== this.estadoToEdit.fecha
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },

        setNivelFelicidad(nivel) {
            this.estado.nivel_felicidad = Number(nivel);
            this.toast.info(`Nivel de felicidad: ${nivel}/10`, {
                timeout: 1500,
                hideProgressBar: true
            });
        },

        getEmojiForLevel(level) {
            if (!level) return '😐';
            if (level >= 9) return '😄';
            if (level >= 7) return '🙂';
            if (level >= 5) return '😐';
            if (level >= 3) return '🙁';
            return '😢';
        }
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Smile class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Estado de Ánimo' : 'Nuevo Estado de Ánimo'
                            }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-yellow-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar class="h-5 w-5 text-yellow-500 mr-2" />
                                Fecha
                            </h3>

                            <div>
                                <label for="fecha" class="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha *
                                </label>
                                <Field name="fecha" v-model="estado.fecha" v-slot="{ field, meta, errors }">
                                    <input id="fecha" v-bind="field" type="date"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                                        :class="{ 'border-red-500': meta.touched && errors.length }" />
                                    <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                        {{ errors[0] }}
                                    </span>
                                </Field>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Heart class="h-5 w-5 text-pink-500 mr-2" />
                                Nivel de Felicidad
                            </h3>

                            <div class="text-center mb-4">
                                <div class="text-6xl mb-2">{{ getEmojiForLevel(estado.nivel_felicidad) }}</div>
                                <div v-if="estado.nivel_felicidad" class="text-2xl font-bold text-yellow-600">
                                    {{ estado.nivel_felicidad }}/10
                                </div>
                            </div>

                            <Field name="nivel_felicidad" v-model.number="estado.nivel_felicidad"
                                v-slot="{ meta, errors }">
                                <div class="flex justify-center items-center space-x-2 mb-4">
                                    <button v-for="n in 10" :key="n" type="button" @click="setNivelFelicidad(n)"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        :class="{
                                            'bg-yellow-400 border-yellow-500 text-white': n <= estado.nivel_felicidad,
                                            'bg-gray-100 border-gray-300 text-gray-400': n > estado.nivel_felicidad
                                        }">
                                        {{ n }}
                                    </button>
                                </div>
                                <div class="text-center text-sm text-gray-600 mb-2">
                                    Haz clic en un número para seleccionar tu nivel de felicidad
                                </div>
                                <span v-if="meta.touched && errors.length"
                                    class="text-red-500 text-sm block text-center">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Reflexión
                            </h3>

                            <Field name="reflexion" as="textarea" v-model="estado.reflexion"
                                v-slot="{ field, meta, errors }">
                                <textarea id="reflexion" v-bind="field" rows="4"
                                    placeholder="Comparte tus pensamientos, qué te hizo sentir así, eventos del día..."
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
                                class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Estado' : 'Guardar Estado') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>