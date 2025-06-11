<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useDataStore } from '@/stores/store';
import { mapActions } from 'pinia';
import { Gamepad2, Monitor, Clock, Star, Camera, MessageSquare, Save, X, Calendar } from 'lucide-vue-next';
import { useToast } from "vue-toastification";

export default {
    name: "FormVideojuegos",
    components: {
        Form,
        Field,
        ErrorMessage,
        Gamepad2,
        Monitor,
        Clock,
        Star,
        Camera,
        MessageSquare,
        Save,
        X,
        Calendar
    },
    emits: ['cerrar', 'guardado'],
    props: {
        videojuegoToEdit: {
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
            videojuego: {
                id: this.videojuegoToEdit?.id || null,
                nombre: this.videojuegoToEdit?.nombre || '',
                plataforma: this.videojuegoToEdit?.plataforma || '',
                horas_jugadas: this.videojuegoToEdit?.horas_jugadas || null,
                puntuacion: this.videojuegoToEdit?.puntuacion || null,
                comentario: this.videojuegoToEdit?.comentario || '',
                fecha: this.videojuegoToEdit?.fecha || '',
                imagen: this.videojuegoToEdit?.imagen || '',
                imagenPreview: this.videojuegoToEdit?.imagen ? `/images/${this.videojuegoToEdit.imagen}` : ''
            },
            isSubmitting: false,
            isEditing: !!this.videojuegoToEdit,
            mySchema: yup.object({
                nombre: yup.string().required("El nombre del videojuego es obligatorio"),
                plataforma: yup.string().required("La plataforma es obligatoria"),
                horas_jugadas: yup
                    .number()
                    .required("Las horas jugadas son obligatorias")
                    .min(0, "Debe ser un número positivo"),
                puntuacion: yup
                    .number()
                    .required("La puntuación es obligatoria")
                    .min(1, "La puntuación mínima es 1")
                    .max(5, "La puntuación máxima es 5"),
                comentario: yup.string(),
                fecha: yup.date()
                    .required("La fecha es obligatoria")
                    .typeError("Fecha inválida"),
                imagen: yup.string()
            }),
            plataformas: [
                { valor: 'PlayStation 5', emoji: '🎮' },
                { valor: 'PlayStation 4', emoji: '🎮' },
                { valor: 'Xbox Series X', emoji: '🎮' },
                { valor: 'Xbox One', emoji: '🎮' },
                { valor: 'Nintendo Switch', emoji: '🎮' },
                { valor: 'PC', emoji: '💻' },
                { valor: 'Steam Deck', emoji: '🎮' },
                { valor: 'Mobile', emoji: '📱' },
                { valor: 'Otra', emoji: '🕹️' }
            ]
        };
    },
    methods: {
        ...mapActions(useDataStore, ['addVideojuego', 'updateVideojuego']),
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.videojuego.imagen = file.name;
                this.videojuego.imagenPreview = URL.createObjectURL(file);
                this.toast.info("Imagen cargada correctamente");
            }
        },
        async onSubmit(values, { resetForm }) {
            this.isSubmitting = true;
            try {
                if (values.puntuacion) {
                    values.puntuacion = Number(values.puntuacion);
                }
                if (values.horas_jugadas) {
                    values.horas_jugadas = Number(values.horas_jugadas);
                }

                values.imagen = this.videojuego.imagen;

                let videojuegoGuardado;
                if (this.isEditing) {
                    values.id = this.videojuego.id;
                    videojuegoGuardado = await this.updateVideojuego(values);
                    this.toast.success(`¡${values.nombre} actualizado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎮"
                    });
                } else {
                    videojuegoGuardado = await this.addVideojuego(values);
                    this.toast.success(`¡${values.nombre} guardado exitosamente!`, {
                        timeout: 3000,
                        icon: "🎮"
                    });
                }

                if (!this.isEditing) {
                    resetForm();
                    this.resetVideojuego();
                }

                this.$emit('guardado', videojuegoGuardado);

            } catch (error) {
                console.error("Error al guardar el videojuego:", error);
                this.toast.error(`Error al ${this.isEditing ? 'actualizar' : 'guardar'} el videojuego. Inténtalo de nuevo.`, {
                    timeout: 5000,
                    icon: "❌"
                });
            } finally {
                this.isSubmitting = false;
            }
        },
        resetVideojuego() {
            this.videojuego = {
                id: null,
                nombre: '',
                plataforma: '',
                horas_jugadas: null,
                puntuacion: null,
                comentario: '',
                fecha: '',
                imagen: '',
                imagenPreview: ''
            };
            if (this.$refs.imagenInput) {
                this.$refs.imagenInput.value = '';
            }
        },
        cerrarFormulario() {
            if ((this.videojuego.nombre && !this.isEditing) ||
                (this.isEditing && (
                    this.videojuego.nombre !== this.videojuegoToEdit.nombre ||
                    this.videojuego.plataforma !== this.videojuegoToEdit.plataforma ||
                    this.videojuego.horas_jugadas !== this.videojuegoToEdit.horas_jugadas ||
                    this.videojuego.puntuacion !== this.videojuegoToEdit.puntuacion ||
                    this.videojuego.comentario !== this.videojuegoToEdit.comentario ||
                    this.videojuego.fecha !== this.videojuegoToEdit.fecha ||
                    this.videojuego.imagen !== this.videojuegoToEdit.imagen
                ))) {
                this.toast.warning("¿Estás seguro? Se perderán los cambios no guardados");
            }
            this.$emit('cerrar');
        },

        setPuntuacion(rating) {
            this.videojuego.puntuacion = Number(rating);
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
            <div class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <Gamepad2 class="h-8 w-8 mr-3" />
                        <h1 class="text-3xl font-bold">{{ isEditing ? 'Editar Videojuego' : 'Nuevo Videojuego' }}</h1>
                    </div>
                    <button @click="cerrarFormulario" class="text-white hover:text-cyan-200 transition-colors">
                        <X class="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <Form :validation-schema="mySchema" v-slot="{ handleSubmit, resetForm }">
                    <form @submit.prevent="handleSubmit(values => onSubmit(values, { resetForm }))" class="space-y-6">

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Gamepad2 class="h-5 w-5 text-cyan-500 mr-2" />
                                Información del Videojuego
                            </h3>

                            <div class="space-y-4">
                                <div>
                                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Videojuego *
                                    </label>
                                    <Field name="nombre" v-model="videojuego.nombre" v-slot="{ field, meta, errors }">
                                        <input id="nombre" v-bind="field" type="text"
                                            placeholder="Ej: The Legend of Zelda, FIFA 23"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                            :class="{ 'border-red-500': meta.touched && errors.length }" />
                                        <span v-if="meta.touched && errors.length"
                                            class="text-red-500 text-sm mt-1 block">
                                            {{ errors[0] }}
                                        </span>
                                    </Field>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="plataforma"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Monitor class="h-4 w-4 text-gray-500 mr-1" />
                                            Plataforma *
                                        </label>
                                        <Field name="plataforma" v-model="videojuego.plataforma"
                                            v-slot="{ field, meta, errors }">
                                            <select id="plataforma" v-bind="field"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }">
                                                <option value="" disabled>Selecciona una plataforma</option>
                                                <option v-for="plat in plataformas" :key="plat.valor"
                                                    :value="plat.valor">
                                                    {{ plat.emoji }} {{ plat.valor }}
                                                </option>
                                            </select>
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>

                                    <div>
                                        <label for="horas_jugadas"
                                            class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Clock class="h-4 w-4 text-gray-500 mr-1" />
                                            Horas Jugadas *
                                        </label>
                                        <Field name="horas_jugadas" v-model.number="videojuego.horas_jugadas"
                                            v-slot="{ field, meta, errors }">
                                            <input id="horas_jugadas" type="number" min="0" step="0.5" v-bind="field"
                                                placeholder="Ej: 20"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                                :class="{ 'border-red-500': meta.touched && errors.length }" />
                                            <span v-if="meta.touched && errors.length"
                                                class="text-red-500 text-sm mt-1 block">
                                                {{ errors[0] }}
                                            </span>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label for="fecha"
                                        class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Calendar class="h-4 w-4 text-gray-500 mr-1" />
                                        Fecha de Juego *
                                    </label>
                                    <Field name="fecha" v-model="videojuego.fecha" v-slot="{ field, meta, errors }">
                                        <input id="fecha" v-bind="field" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
                                <Star class="h-5 w-5 text-yellow-500 mr-2" />
                                Puntuación (1-5)
                            </h3>

                            <div class="flex items-center space-x-1">
                                <button v-for="star in 5" :key="star" type="button" @click="setPuntuacion(star)"
                                    class="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition-transform hover:scale-110">
                                    <Star class="h-6 w-6 transition-colors"
                                        :class="star <= videojuego.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
                                </button>
                                <span v-if="videojuego.puntuacion" class="ml-3 text-sm text-gray-600">
                                    {{ videojuego.puntuacion }} de 5
                                </span>
                            </div>

                            <!-- Campo oculto para la validación -->
                            <Field name="puntuacion" v-model.number="videojuego.puntuacion" type="hidden" />
                            <ErrorMessage name="puntuacion" class="text-red-500 text-sm mt-2 block" />
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MessageSquare class="h-5 w-5 text-blue-500 mr-2" />
                                Comentario
                            </h3>

                            <Field name="comentario" as="textarea" v-model="videojuego.comentario"
                                v-slot="{ field, meta, errors }">
                                <textarea id="comentario" v-bind="field" rows="4"
                                    placeholder="Comparte tu opinión sobre el juego, momentos favoritos, dificultad..."
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
                                Carátula del Juego (Opcional)
                            </h3>

                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full">
                                    <label for="imagen"
                                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera class="w-8 h-8 mb-2 text-gray-400" />
                                            <p class="mb-2 text-sm text-gray-500">
                                                <span class="font-semibold">Haz clic para subir</span> la carátula
                                            </p>
                                            <p class="text-xs text-gray-500">PNG, JPG o JPEG</p>
                                        </div>
                                        <input id="imagen" type="file" accept="image/*" @change="onFileChange"
                                            ref="imagenInput" class="hidden" />
                                    </label>
                                </div>

                                <div v-if="videojuego.imagenPreview" class="relative">
                                    <img :src="videojuego.imagenPreview" alt="Previsualización"
                                        class="w-full h-48 object-cover rounded-lg border" />
                                    <button type="button"
                                        @click="videojuego.imagenPreview = ''; videojuego.imagen = ''; $refs.imagenInput.value = ''"
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
                                class="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                <span>{{ isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ?
                                    'Actualizar Videojuego' : 'Guardar Videojuego') }}</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </div>
</template>
