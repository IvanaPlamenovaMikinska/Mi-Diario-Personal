<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { BookOpen, Calendar, FileText, Camera, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormDiario",
    components: {
        Form,
        Field,
        ErrorMessage,
        BookOpen,
        Calendar,
        FileText,
        Camera,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        diarioToEdit: {
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
            entrada: {
                id: this.diarioToEdit?.id || null,
                texto: this.diarioToEdit?.texto || '',
                fecha: this.diarioToEdit?.fecha || '',
                imagen: this.diarioToEdit?.imagen || '',
                imagenPreview: this.diarioToEdit?.imagen ? `/images/${this.diarioToEdit.imagen}` : ''
            },
            isSubmitting: false,
            isEditing: !!this.diarioToEdit,
            mySchema: yup.object({
                texto: yup.string().required("El texto es obligatorio"),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida"),
                imagen: yup.string()
            }),
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addDiario', 'updateDiario']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.entrada.imagen = file.name;
                this.entrada.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                values.imagen = this.entrada.imagen;

                let entradaGuardada;
                if (this.isEditing) {
                    values.id = this.entrada.id;
                    entradaGuardada = await this.updateDiario(values);
                    this.toast.success("¡Entrada del diario actualizada exitosamente!", {
                        timeout: 3000,
                        icon: "📝"
                    });
                } else {
                    entradaGuardada = await this.addDiario(values);
                    this.toast.success("¡Entrada del diario guardada exitosamente!", {
                        timeout: 3000,
                        icon: "📝"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetEntrada();
                }

                this.$emit('guardado', entradaGuardada);

            } catch (error) {
                console.error("Error al guardar la entrada:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la entrada. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetEntrada() {
            this.entrada = {
                id: null,
                texto: '',
                fecha: '',
                imagen: '',
                imagenPreview: ''
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.entrada.texto && !this.isEditing) ||
                (this.isEditing && (
                    this.entrada.texto !== this.diarioToEdit.texto ||
                    this.entrada.fecha !== this.diarioToEdit.fecha ||
                    this.entrada.imagen !== this.diarioToEdit.imagen
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
            <div class="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <BookOpen class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Entrada' : 'Nueva Entrada del Diario' }}
                        </h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-purple-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar class="h-5 w-5 text-purple-500 mr-2" />
                                Fecha de la Entrada
                            </h3>

                            <div>
                                <label for="fecha" class="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha *
                                </label>
                                <Field name="fecha" v-model="entrada.fecha" v-slot="{ field, meta, errors }">
                                    <input id="fecha" v-bind="field" type="date"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        :class="{ 'border-red-500': meta.touched && errors.length }" />
                                    <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                        {{ errors[0] }}
                                    </span>
                                </Field>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText class="h-5 w-5 text-blue-500 mr-2" />
                                Contenido
                            </h3>

                            <Field name="texto" as="textarea" v-model="entrada.texto" v-slot="{ field, meta, errors }">
                                <textarea id="texto" v-bind="field" rows="8"
                                    placeholder="Escribe sobre tu día, pensamientos, experiencias, reflexiones..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    :class="{ 'border-red-500': meta.touched && errors.length }"></textarea>
                                <span v-if="meta.touched && errors.length" class="text-red-500 text-sm mt-1 block">
                                    {{ errors[0] }}
                                </span>
                            </Field>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Camera class="h-5 w-5 text-pink-500 mr-2" />
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

                                <div v-if="entrada.imagenPreview" class="relative">
                                    <img :src="entrada.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="entrada.imagenPreview = ''; entrada.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Entrada' : 'Guardar Entrada') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
