import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import AuthView from "@/views/AuthView.vue";
import HomeView from "../views/HomeView.vue";
import PeliculaView from "../views/PeliculaView.vue";
import SerieView from "../views/SerieView.vue";
import LibroView from "../views/LibroView.vue";
import VideojuegoView from "../views/VideojuegoView.vue";
import MusicaView from "../views/MusicaView.vue";
import ViajeView from "../views/ViajeView.vue";
import EventoView from "../views/EventoView.vue";
import ComidaView from "../views/ComidaView.vue";
import CompraView from "../views/CompraView.vue";
import EjercicioView from "../views/EjercicioView.vue";
import HabitoView from "../views/HabitoView.vue";
import EstadoAnimoView from "../views/EstadoAnimoView.vue";
import MetaView from "../views/MetaView.vue";
import CursoView from "../views/CursoView.vue";
import LogroView from "../views/LogroView.vue";
import DiarioView from "../views/DiarioView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: AuthView,
    },
    {
      path: "/pelicula/:id",
      name: "pelicula",
      component: PeliculaView,
      props: true,
    },
    {
      path: "/serie/:id",
      name: "serie",
      component: SerieView,
      props: true,
    },
    {
      path: "/libro/:id",
      name: "libro",
      component: LibroView,
      props: true,
    },
    {
      path: "/videojuego/:id",
      name: "videojuego",
      component: VideojuegoView,
      props: true,
    },
    {
      path: "/music/:id",
      name: "music",
      component: MusicaView,
      props: true,
    },
    {
      path: "/viaje/:id",
      name: "viaje",
      component: ViajeView,
      props: true,
    },
    {
      path: "/evento/:id",
      name: "evento",
      component: EventoView,
      props: true,
    },
    {
      path: "/comida/:id",
      name: "comida",
      component: ComidaView,
      props: true,
    },
    {
      path: "/compra/:id",
      name: "compra",
      component: CompraView,
      props: true,
    },
    {
      path: "/ejercicio/:id",
      name: "ejercicio",
      component: EjercicioView,
      props: true,
    },
    {
      path: "/habito/:id",
      name: "habito",
      component: HabitoView,
      props: true,
    },
    {
      path: "/estado-animo/:id",
      name: "estado-animo",
      component: EstadoAnimoView,
      props: true,
    },
    {
      path: "/meta/:id",
      name: "meta",
      component: MetaView,
      props: true,
    },
    {
      path: "/curso/:id",
      name: "curso",
      component: CursoView,
      props: true,
    },
    {
      path: "/logro/:id",
      name: "logro",
      component: LogroView,
      props: true,
    },
    {
      path: "/diario/:id",
      name: "diario",
      component: DiarioView,
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.estaLogueado) {
    next("/login");
  } else if (to.path === "/login" && authStore.estaLogueado) {
    next("/");
  } else {
    next();
  }
});

export default router;
