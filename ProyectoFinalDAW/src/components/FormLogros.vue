<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Trophy, Calendar, MessageSquare, Save, X, Award } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormLogros",
    components: {
        Form,
        Field,
        ErrorMessage,
        Trophy,
        Calendar,
        MessageSquare,
        Save,
        X,
        Award
    },
    emits: ['cerrar', 'guardado'],
    props: {
        logroToEdit: {
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
            logro: {
                id: this.logroToEdit?.id || null,
                nombre: this.logroToEdit?.nombre || '',
                fecha: this.logroToEdit?.fecha || '',
                reflexion: this.logroToEdit?.reflexion || '',
            },
            isSubmitting: false,
            isEditing: !!this.logroToEdit,
            mySchema: yup.object({
                nombre: yup.string().required("El nombre del logro es obligatorio"),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida"),
                reflexion: yup.string(),
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addLogro', 'updateLogro']),
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                let logroGuardado;
                if (this.isEditing) {
                    values.id = this.logro.id;
                    logroGuardado = await this.updateLogro(values);
                    this.toast.success(`¡${values.nombre} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🏆"
                    });
                } else {
                    logroGuardado = await this.addLogro(values);
                    this.toast.success(`¡${values.nombre} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🏆"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetLogro();
                }

                this.$emit('guardado', logroGuardado);

            } catch (error) {
                console.error("Error al guardar el logro:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el logro. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetLogro() {
            this.logro = {
                id: null,
                nombre: '',
                fecha: '',
                reflexion: '',
            };
        },
        cerrarFormulario() {
            if ((this.logro.nombre && !this.isEditing) ||
                (this.isEditing && (
                    this.logro.nombre !== this.logroToEdit.nombre ||
                    this.logro.fecha !== this.logroToEdit.fecha ||
                    this.logro.reflexion !== this.logroToEdit.reflexion
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
            <div class="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Trophy class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Logro' : 'Nuevo Logro' }}</h1>
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
                                <Award class="h-5 w-5 text-yellow-500 mr-2" />
                                Información del Logro
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Logro *
                                    </label>
                                    <Field name="nombre" v-model="logro.nombre" v-slot="{ field, meta, errors }">
                                        <input id="nombre" v-bind="field" type="text"
                                            placeholder="Ej: Completé mi primera maratón"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
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
                                        Fecha del Logro *
                                    </label>
                                    <Field name="fecha" v-model="logro.fecha" v-slot="{ field, meta, errors }">
                                        <input id="fecha" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
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
                                <MessageSquare class="h-5 w-5 text-purple-500 mr-2" />
                                Reflexión
                            </h3>

                            <Field name="reflexion" as="textarea" v-model="logro.reflexion"
                                v-slot="{ field, meta, errors }">
                                <textarea id="reflexion" v-bind="field" rows="4"
                                    placeholder="Reflexiona sobre este logro: ¿cómo te sientes? ¿qué aprendiste? ¿qué significó para ti?"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
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
                                    'Actualizar Logro' : 'Guardar Logro') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
