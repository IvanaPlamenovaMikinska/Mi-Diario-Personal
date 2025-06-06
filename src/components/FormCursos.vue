<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { GraduationCap, BookOpen, Calendar, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormCursos",
    components: {
        Form,
        Field,
        ErrorMessage,
        GraduationCap,
        BookOpen,
        Calendar,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        cursoToEdit: {
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
            curso: {
                id: this.cursoToEdit?.id || null,
                nombre: this.cursoToEdit?.nombre || '',
                plataforma: this.cursoToEdit?.plataforma || '',
                inicio: this.cursoToEdit?.inicio || '',
                fin: this.cursoToEdit?.fin || '',
                opinion: this.cursoToEdit?.opinion || ''
            },
            isSubmitting: false,
            isEditing: !!this.cursoToEdit,
            mySchema: yup.object({
                nombre: yup.string().required("El nombre del curso es obligatorio"),
                plataforma: yup.string().required("La plataforma es obligatoria"),
                inicio: yup.date()
                    .required("La fecha de inicio es obligatoria")
                    .typeError("Fecha inválida"),
                fin: yup.date()
                    .required("La fecha de fin es obligatoria")
                    .min(yup.ref('inicio'), "La fecha de fin debe ser igual o posterior a la fecha de inicio")
                    .typeError("Fecha inválida"),
                opinion: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addCurso', 'updateCurso']),
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                let cursoGuardado;
                if (this.isEditing) {
                    values.id = this.curso.id;
                    cursoGuardado = await this.updateCurso(values);
                    this.toast.success(`¡${values.nombre} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎓"
                    });
                } else {
                    cursoGuardado = await this.addCurso(values);
                    this.toast.success(`¡${values.nombre} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎓"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetCurso();
                }

                this.$emit('guardado', cursoGuardado);

            } catch (error) {
                console.error("Error al guardar el curso:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el curso. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetCurso() {
            this.curso = {
                id: null,
                nombre: '',
                plataforma: '',
                inicio: '',
                fin: '',
                opinion: ''
            };
        },
        cerrarFormulario() {
            if ((this.curso.nombre && !this.isEditing) ||
                (this.isEditing && (
                    this.curso.nombre !== this.cursoToEdit.nombre ||
                    this.curso.plataforma !== this.cursoToEdit.plataforma ||
                    this.curso.inicio !== this.cursoToEdit.inicio ||
                    this.curso.fin !== this.cursoToEdit.fin ||
                    this.curso.opinion !== this.cursoToEdit.opinion
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
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <GraduationCap class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}</h1>
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
                                <BookOpen class="h-5 w-5 text-blue-500 mr-2" />
                                Información del Curso
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Curso *
                                    </label>
                                    <Field name="nombre" v-model="curso.nombre" v-slot="{ field, meta, errors }">
                                        <input id="nombre" v-bind="field" type="text"
                                            placeholder="Ej: Desarrollo Web con Vue.js"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                                        <BookOpen class="h-4 w-4 text-gray-500 mr-1" />
                                        Plataforma *
                                    </label>
                                    <Field name="plataforma" v-model="curso.plataforma"
                                        v-slot="{ field, meta, errors }">
                                        <input id="plataforma" v-bind="field" type="text"
                                            placeholder="Ej: Udemy, Coursera, Platzi"
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

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar class="h-5 w-5 text-green-500 mr-2" />
                                Fechas del Curso
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="inicio" class="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Inicio *
                                    </label>
                                    <Field name="inicio" v-model="curso.inicio" v-slot="{ field, meta, errors }">
                                        <input id="inicio" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="fin" class="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Finalización *
                                    </label>
                                    <Field name="fin" v-model="curso.fin" v-slot="{ field, meta, errors }">
                                        <input id="fin" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                                Opinión
                            </h3>

                            <Field name="opinion" as="textarea" v-model="curso.opinion"
                                v-slot="{ field, meta, errors }">
                                <textarea id="opinion" v-bind="field" rows="4"
                                    placeholder="Comparte tu experiencia, lo que aprendiste, calidad del contenido, instructor..."
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
                                    'Actualizar Curso' : 'Guardar Curso') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>