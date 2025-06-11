<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { ShoppingBag, Store, Euro, Star, Camera, MessageSquare, Save, X } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormCompras",
    components: {
        Form,
        Field,
        ErrorMessage,
        ShoppingBag,
        Store,
        Euro,
        Star,
        Camera,
        MessageSquare,
        Save,
        X
    },
    emits: ['cerrar', 'guardado'],
    props: {
        compraToEdit: {
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
            compra: {
                id: this.compraToEdit?.id || null,
                producto: this.compraToEdit?.producto || '',
                tienda: this.compraToEdit?.tienda || '',
                precio: this.compraToEdit?.precio || null,
                puntuacion: this.compraToEdit?.puntuacion || null,
                comentario: this.compraToEdit?.comentario || '',
                imagen: this.compraToEdit?.imagen || '',
                imagenPreview: this.compraToEdit?.imagen ? `/images/${this.compraToEdit.imagen}` : '',
                fecha: this.compraToEdit?.fecha || ''
            },
            isSubmitting: false,
            isEditing: !!this.compraToEdit,
            mySchema: yup.object({
                producto: yup.string().required("El nombre del producto es obligatorio"),
                tienda: yup.string().required("La tienda es obligatoria"),
                precio: yup
                    .number()
                    .typeError("El precio debe ser un número")
                    .required("El precio es obligatorio")
                    .min(0, "El precio no puede ser negativo"),
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
        ...mapActions(useDataStore, ['addCompra', 'updateCompra']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.compra.imagen = file.name;
                this.compra.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }
                if (values.precio) {
                    values.precio = Number(values.precio);
                }

                values.imagen = this.compra.imagen;
                values.fecha = this.compra.fecha;

                let compraGuardada;
                if (this.isEditing) {
                    values.id = this.compra.id;
                    if (!values.fecha) values.fecha = new Date().toISOString().split('T')[0];
                    compraGuardada = await this.updateCompra(values);
                    this.toast.success(`¡${values.producto} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🛍️"
                    });
                } else {
                    if (!values.fecha) values.fecha = new Date().toISOString().split('T')[0];
                    compraGuardada = await this.addCompra(values);
                    this.toast.success(`¡${values.producto} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🛍️"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetCompra();
                }

                this.$emit('guardado', compraGuardada);

            } catch (error) {
                console.error("Error al guardar la compra:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} la compra. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetCompra() {
            this.compra = {
                id: null,
                producto: '',
                tienda: '',
                precio: null,
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
            if ((this.compra.producto && !this.isEditing) ||
                (this.isEditing && (
                    this.compra.producto !== this.compraToEdit.producto ||
                    this.compra.tienda !== this.compraToEdit.tienda ||
                    this.compra.precio !== this.compraToEdit.precio ||
                    this.compra.puntuacion !== this.compraToEdit.puntuacion ||
                    this.compra.comentario !== this.compraToEdit.comentario ||
                    this.compra.imagen !== this.compraToEdit.imagen ||
                    this.compra.fecha !== this.compraToEdit.fecha
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },
        setPuntuacion(rating) {
            this.compra.puntuacion = Number(rating);
            this.toast.info(`Puntuación: ${rating} estrella${rating > 1 ? 's' : ''}`, {
                timeout: 1500,
                hideProgressBar: true
            });
        },
        formatPrecio(event) {
            let value = event.target.value;
            if (value && !isNaN(value)) {
                this.compra.precio = parseFloat(value);
            }
        }
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <ShoppingBag class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Compra' : 'Nueva Compra' }}</h1>
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
                                <ShoppingBag class="h-5 w-5 text-green-500 mr-2" />
                                Información del Producto
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="producto" class="block text-sm font-medium text-gray-700 mb-2">
                                        Producto *
                                    </label>
                                    <Field name="producto" v-model="compra.producto" v-slot="{ field, meta, errors }">
                                        <input id="producto" v-bind="field" type="text" placeholder="Ej: iPhone 15 Pro"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div>
                                    <label for="tienda"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Store class="h-4 w-4 text-gray-500 mr-1" />
                                        Tienda *
                                    </label>
                                    <Field name="tienda" v-model="compra.tienda" v-slot="{ field, meta, errors }">
                                        <input id="tienda" v-bind="field" type="text" placeholder="Nombre de la tienda"
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
                                <label for="precio"
                                    class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Euro class="h-4 w-4 text-gray-500 mr-1" />
                                    Precio *
                                </label>
                                <Field name="precio" v-model.number="compra.precio" v-slot="{ field, meta, errors }">
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 sm:text-sm">€</span>
                                        </div>
                                        <input id="precio" v-bind="field" type="number" step="0.01" min="0"
                                            placeholder="0.00" @input="formatPrecio"
                                            class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                    </div>
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
                                        :class="star <= compra.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="compra.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ compra.puntuacion }} de 5 estrellas
                                </span>
                            </div>

                            <Field name="puntuacion" v-model.number="compra.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span class="h-5 w-5 text-blue-500 mr-2">📅</span>
                                Fecha de la Compra
                            </h3>
                            <Field name="fecha" v-model="compra.fecha" v-slot="{ field, meta, errors }">
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

                            <Field name="comentario" as="textarea" v-model="compra.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Describe tu experiencia de compra, calidad del producto, relación calidad-precio..."
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

                                <div v-if="compra.imagenPreview" class="relative">
                                    <img :src="compra.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="compra.imagenPreview = ''; compra.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Compra' : 'Guardar Compra') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>