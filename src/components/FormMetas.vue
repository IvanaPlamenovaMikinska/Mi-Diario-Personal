<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Target, Calendar, TrendingUp, FileText, Save, X, Flag } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormMetas",
    components: {
        Form,
        Field,
        ErrorMessage,
        Target,
        Calendar,
        TrendingUp,
        FileText,
        Save,
        X,
        Flag
    },
    emits: ['cerrar', 'guardado'],
    props: {
        metaToEdit: {
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
            meta: {
                id: this.metaToEdit?.id || null,
                meta: this.metaToEdit?.meta || '',
                inicio: this.metaToEdit?.inicio || '',
                limite: this.metaToEdit?.limite || '',
                progreso: this.metaToEdit?.progreso || '',
                notas: this.metaToEdit?.notas || ''
            },
            isSubmitting: false,
            isEditing: !!this.metaToEdit,
            mySchema: yup.object({
                meta: yup.string().required("La meta es obligatoria"),
                inicio: yup.date()
                    .required("La fecha de inicio es obligatoria")
                    .typeError("Fecha de inicio inválida"),
                limite: yup.date()
                    .required("La fecha límite es obligatoria")
                    .typeError("Fecha límite inválida")
                    .min(yup.ref('inicio'), "La fecha límite debe ser posterior a la fecha de inicio"),
                progreso: yup.string(),
                notas: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addMeta', 'updateMeta']),
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                let metaGuardada;
                if (this.isEditing) {
                    values.id = this.meta.id;
                    metaGuardada = await this.updateMeta(values);
                    this.toast.success(`¡${values.meta} actualizada exitosamente!`, {
                        timeout: 3000,
                        icon: "🎯"
                    });
                } else {
                    metaGuardada = await this.addMeta(values);
                    this.toast.success(`¡${values.meta} guardada exitosamente!`, {
                        timeout: 3000,
                        icon: "🎯"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetMeta();
                }

                this.$emit('guardado', metaGuardada);

            } catch (error) {
                console.error("Error al guardar la meta:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la meta. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetMeta() {
            this.meta = {
                id: null,
                meta: '',
                inicio: '',
                limite: '',
                progreso: '',
                notas: ''
            };
        },
        cerrarFormulario() {
            if ((this.meta.meta && !this.isEditing) ||
                (this.isEditing && (
                    this.meta.meta !== this.metaToEdit.meta ||
                    this.meta.inicio !== this.metaToEdit.inicio ||
                    this.meta.limite !== this.metaToEdit.limite ||
                    this.meta.progreso !== this.metaToEdit.progreso ||
                    this.meta.notas !== this.metaToEdit.notas
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
            <div class="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Target class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Meta' : 'Nueva Meta' }}</h1>
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
                                <Flag class="h-5 w-5 text-blue-500 mr-2" />
                                Información de la Meta
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="meta" class="block text-sm font-medium text-gray-700 mb-2">
                                        Meta u Objetivo *
                                    </label>
                                    <Field name="meta" v-model="meta.meta" v-slot="{ field, meta, errors }">
                                        <input id="meta" v-bind="field" type="text"
                                            placeholder="Ej: Aprender francés, Correr 10km, Ahorrar €5000"
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
                                        <label for="inicio"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                            Fecha de Inicio *
                                        </label>
                                        <Field name="inicio" v-model="meta.inicio" v-slot="{ field, meta, errors }">
                                            <input id="inicio" v-bind="field" type="date"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="limite"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                            Fecha Límite *
                                        </label>
                                        <Field name="limite" v-model="meta.limite" v-slot="{ field, meta, errors }">
                                            <input id="limite" v-bind="field" type="date"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                                Progreso Actual
                            </h3>

                            <Field name="progreso" as="textarea" v-model="meta.progreso"
                                v-slot="{ field, meta, errors }">
                                <textarea id="progreso" v-bind="field" rows="3"
                                    placeholder="Describe tu progreso actual, pasos completados, obstáculos encontrados..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                                    :class="{ 'border-red-500': meta.touched && errors.length }"></textarea>
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText class="h-5 w-5 text-purple-500 mr-2" />
                                Notas Adicionales
                            </h3>

                            <Field name="notas" as="textarea" v-model="meta.notas" v-slot="{ field, meta, errors }">
                                <textarea id="notas" v-bind="field" rows="3"
                                    placeholder="Estrategias, recursos necesarios, motivación, recordatorios..."
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
                                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Meta' : 'Guardar Meta') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
