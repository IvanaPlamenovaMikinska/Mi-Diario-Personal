import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export const useDataStore = defineStore("data", {
  state() {
    return {
      peliculas: [],
      series: [],
      libros: [],
      videojuegos: [],
      musica: [],
      viajes: [],
      eventos: [],
      comidas: [],
      compras: [],
      ejercicios: [],
      habitos: [],
      estado_animo: [],
      metas: [],
      cursos: [],
      logros: [],
      diario: [],
    };
  },

  actions: {
    getUserKey(category) {
      const authStore = useAuthStore();
      const usuario = authStore.nombreUsuario || "invitado";
      return `${category}_${usuario}`;
    },

    getUsuarioActual() {
      const authStore = useAuthStore();
      return authStore.nombreUsuario || "invitado";
    },

    async inicializarUsuarioEnServidor(nombreUsuario) {
      try {
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        if (!usuarios[nombreUsuario]) {
          usuarios[nombreUsuario] = {
            entretenimiento: {
              peliculas: [],
              series: [],
              libros: [],
              videojuegos: [],
              musica: [],
            },
            experiencias_ocio: {
              viajes: [],
              eventos: [],
              comidas: [],
              compras: [],
            },
            bienestar_salud: {
              ejercicios: [],
              habitos: [],
              estado_animo: [],
            },
            crecimiento_personal: {
              metas: [],
              cursos: [],
              logros: [],
              diario: [],
            },
          };

          await axios.put("http://localhost:3000/usuarios", usuarios);
          console.log(`✅ Usuario ${nombreUsuario} inicializado en servidor`);
        }
      } catch (error) {
        console.error("Error al inicializar usuario en servidor:", error);
      }
    },

    formatearFecha(fecha) {
      if (!fecha || typeof fecha !== "string") return "";
      const partes = fecha.split("-");
      if (partes.length !== 3) return fecha;
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    },

    async getPeliculas() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.peliculas = datosUsuario?.entretenimiento?.peliculas || [];
        localStorage.setItem(
          this.getUserKey("peliculas"),
          JSON.stringify(this.peliculas)
        );
      } catch (error) {
        console.error("Error al obtener las películas:", error);
        this.peliculas =
          JSON.parse(localStorage.getItem(this.getUserKey("peliculas"))) || [];
      }
    },

    async getPeliculaById(id) {
      await this.getPeliculas();
      return this.peliculas.find((p) => p.id === Number(id));
    },

    async addPelicula(pelicula) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        pelicula.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          const usuarios = newResponse.data;
        }

        usuarios[usuario].entretenimiento.peliculas.push(pelicula);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.peliculas = usuarios[usuario].entretenimiento.peliculas;
        localStorage.setItem(
          this.getUserKey("peliculas"),
          JSON.stringify(this.peliculas)
        );

        return pelicula;
      } catch (error) {
        console.error("Error al guardar la película:", error);
        throw error;
      }
    },

    async updatePelicula(pelicula) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].entretenimiento.peliculas.findIndex(
          (p) => p.id === pelicula.id
        );
        if (index === -1) {
          throw new Error("Película no encontrada");
        }

        usuarios[usuario].entretenimiento.peliculas[index] = pelicula;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.peliculas = usuarios[usuario].entretenimiento.peliculas;
        localStorage.setItem(
          this.getUserKey("peliculas"),
          JSON.stringify(this.peliculas)
        );

        return pelicula;
      } catch (error) {
        console.error("Error al actualizar la película:", error);
        throw error;
      }
    },

    async removePelicula(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].entretenimiento.peliculas = usuarios[
          usuario
        ].entretenimiento.peliculas.filter((p) => p.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.peliculas = usuarios[usuario].entretenimiento.peliculas;
        localStorage.setItem(
          this.getUserKey("peliculas"),
          JSON.stringify(this.peliculas)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la película:", error);
        throw error;
      }
    },

    async getSeries() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.series = datosUsuario?.entretenimiento?.series || [];
        localStorage.setItem(
          this.getUserKey("series"),
          JSON.stringify(this.series)
        );
      } catch (error) {
        console.error("Error al obtener las series:", error);
        this.series =
          JSON.parse(localStorage.getItem(this.getUserKey("series"))) || [];
      }
    },

    async getSerieById(id) {
      await this.getSeries();
      return this.series.find((p) => p.id === Number(id));
    },

    async addSerie(serie) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        serie.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          const usuarios = newResponse.data;
        }

        usuarios[usuario].entretenimiento.series.push(serie);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.series = usuarios[usuario].entretenimiento.series;
        localStorage.setItem(
          this.getUserKey("series"),
          JSON.stringify(this.series)
        );

        return serie;
      } catch (error) {
        console.error("Error al guardar la serie:", error);
        throw error;
      }
    },

    async updateSerie(serie) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].entretenimiento.series.findIndex(
          (s) => s.id === serie.id
        );
        if (index === -1) {
          throw new Error("Serie no encontrada");
        }

        usuarios[usuario].entretenimiento.series[index] = serie;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.series = usuarios[usuario].entretenimiento.series;
        localStorage.setItem(
          this.getUserKey("series"),
          JSON.stringify(this.series)
        );

        return serie;
      } catch (error) {
        console.error("Error al actualizar la serie:", error);
        throw error;
      }
    },

    async removeSerie(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].entretenimiento.series = usuarios[
          usuario
        ].entretenimiento.series.filter((s) => s.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.series = usuarios[usuario].entretenimiento.series;
        localStorage.setItem(
          this.getUserKey("series"),
          JSON.stringify(this.series)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la serie:", error);
        throw error;
      }
    },

    async getLibros() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.libros = datosUsuario?.entretenimiento?.libros || [];
        localStorage.setItem(
          this.getUserKey("libros"),
          JSON.stringify(this.libros)
        );
      } catch (error) {
        console.error("Error al obtener los libros:", error);
        this.libros =
          JSON.parse(localStorage.getItem(this.getUserKey("libros"))) || [];
      }
    },

    async getLibroById(id) {
      await this.getLibros();
      return this.libros.find((p) => p.id === Number(id));
    },

    async addLibro(libro) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        libro.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          const usuarios = newResponse.data;
        }

        usuarios[usuario].entretenimiento.libros.push(libro);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.libros = usuarios[usuario].entretenimiento.libros;
        localStorage.setItem(
          this.getUserKey("libros"),
          JSON.stringify(this.libros)
        );

        return libro;
      } catch (error) {
        console.error("Error al guardar el libro:", error);
        throw error;
      }
    },

    async updateLibro(libro) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].entretenimiento.libros.findIndex(
          (l) => l.id === libro.id
        );
        if (index === -1) {
          throw new Error("Libro no encontrado");
        }

        usuarios[usuario].entretenimiento.libros[index] = libro;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.libros = usuarios[usuario].entretenimiento.libros;
        localStorage.setItem(
          this.getUserKey("libros"),
          JSON.stringify(this.libros)
        );

        return libro;
      } catch (error) {
        console.error("Error al actualizar el libro:", error);
        throw error;
      }
    },

    async removeLibro(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].entretenimiento.libros = usuarios[
          usuario
        ].entretenimiento.libros.filter((l) => l.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.libros = usuarios[usuario].entretenimiento.libros;
        localStorage.setItem(
          this.getUserKey("libros"),
          JSON.stringify(this.libros)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
        throw error;
      }
    },

    async getVideojuegos() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.videojuegos = datosUsuario?.entretenimiento?.videojuegos || [];
        localStorage.setItem(
          this.getUserKey("videojuegos"),
          JSON.stringify(this.videojuegos)
        );
      } catch (error) {
        console.error("Error al obtener los videojuegos:", error);
        this.videojuegos =
          JSON.parse(localStorage.getItem(this.getUserKey("videojuegos"))) ||
          [];
      }
    },

    async getVideojuegoById(id) {
      await this.getVideojuegos();
      return this.videojuegos.find((p) => p.id === Number(id));
    },

    async addVideojuego(videojuego) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        videojuego.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          const usuarios = newResponse.data;
        }

        usuarios[usuario].entretenimiento.videojuegos.push(videojuego);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.videojuegos = usuarios[usuario].entretenimiento.videojuegos;
        localStorage.setItem(
          this.getUserKey("videojuegos"),
          JSON.stringify(this.videojuegos)
        );

        return videojuego;
      } catch (error) {
        console.error("Error al guardar el videojuego:", error);
        throw error;
      }
    },

    async updateVideojuego(videojuego) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].entretenimiento.videojuegos.findIndex(
          (v) => v.id === videojuego.id
        );
        if (index === -1) {
          throw new Error("Videojuego no encontrado");
        }

        usuarios[usuario].entretenimiento.videojuegos[index] = videojuego;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.videojuegos = usuarios[usuario].entretenimiento.videojuegos;
        localStorage.setItem(
          this.getUserKey("videojuegos"),
          JSON.stringify(this.videojuegos)
        );

        return videojuego;
      } catch (error) {
        console.error("Error al actualizar el videojuego:", error);
        throw error;
      }
    },

    async removeVideojuego(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].entretenimiento.videojuegos = usuarios[
          usuario
        ].entretenimiento.videojuegos.filter((v) => v.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.videojuegos = usuarios[usuario].entretenimiento.videojuegos;
        localStorage.setItem(
          this.getUserKey("videojuegos"),
          JSON.stringify(this.videojuegos)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el videojuego:", error);
        throw error;
      }
    },

    async getMusica() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.musica = datosUsuario?.entretenimiento?.musica || [];
        localStorage.setItem(
          this.getUserKey("musica"),
          JSON.stringify(this.musica)
        );
      } catch (error) {
        console.error("Error al obtener la música:", error);
        this.musica =
          JSON.parse(localStorage.getItem(this.getUserKey("musica"))) || [];
      }
    },

    async getMusicaById(id) {
      await this.getMusica();
      return this.musica.find((p) => p.id === Number(id));
    },

    async addMusica(musica) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        musica.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          const usuarios = newResponse.data;
        }

        usuarios[usuario].entretenimiento.musica.push(musica);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.musica = usuarios[usuario].entretenimiento.musica;
        localStorage.setItem(
          this.getUserKey("musica"),
          JSON.stringify(this.musica)
        );

        return musica;
      } catch (error) {
        console.error("Error al guardar la música:", error);
        throw error;
      }
    },

    async updateMusica(musica) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].entretenimiento.musica.findIndex(
          (m) => m.id === musica.id
        );
        if (index === -1) {
          throw new Error("Música no encontrada");
        }

        usuarios[usuario].entretenimiento.musica[index] = musica;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.musica = usuarios[usuario].entretenimiento.musica;
        localStorage.setItem(
          this.getUserKey("musica"),
          JSON.stringify(this.musica)
        );

        return musica;
      } catch (error) {
        console.error("Error al actualizar la música:", error);
        throw error;
      }
    },

    async removeMusica(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].entretenimiento.musica = usuarios[
          usuario
        ].entretenimiento.musica.filter((m) => m.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.musica = usuarios[usuario].entretenimiento.musica;
        localStorage.setItem(
          this.getUserKey("musica"),
          JSON.stringify(this.musica)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la música:", error);
        throw error;
      }
    },

    async getViajes() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.viajes = datosUsuario?.experiencias_ocio?.viajes || [];
        localStorage.setItem(
          this.getUserKey("viajes"),
          JSON.stringify(this.viajes)
        );
      } catch (error) {
        console.error("Error al obtener los viajes:", error);
        this.viajes =
          JSON.parse(localStorage.getItem(this.getUserKey("viajes"))) || [];
      }
    },

    async getViajeById(id) {
      await this.getViajes();
      return this.viajes.find((p) => p.id === Number(id));
    },

    async addViaje(viaje) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        viaje.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].experiencias_ocio.viajes.push(viaje);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.viajes = usuarios[usuario].experiencias_ocio.viajes;
        localStorage.setItem(
          this.getUserKey("viajes"),
          JSON.stringify(this.viajes)
        );

        return viaje;
      } catch (error) {
        console.error("Error al guardar el viaje:", error);
        throw error;
      }
    },

    async updateViaje(viaje) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].experiencias_ocio.viajes.findIndex(
          (v) => v.id === viaje.id
        );
        if (index === -1) {
          throw new Error("Viaje no encontrado");
        }

        usuarios[usuario].experiencias_ocio.viajes[index] = viaje;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.viajes = usuarios[usuario].experiencias_ocio.viajes;
        localStorage.setItem(
          this.getUserKey("viajes"),
          JSON.stringify(this.viajes)
        );

        return viaje;
      } catch (error) {
        console.error("Error al actualizar el viaje:", error);
        throw error;
      }
    },

    async removeViaje(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].experiencias_ocio.viajes = usuarios[
          usuario
        ].experiencias_ocio.viajes.filter((v) => v.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.viajes = usuarios[usuario].experiencias_ocio.viajes;
        localStorage.setItem(
          this.getUserKey("viajes"),
          JSON.stringify(this.viajes)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el viaje:", error);
        throw error;
      }
    },

    async getEventos() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.eventos = datosUsuario?.experiencias_ocio?.eventos || [];
        localStorage.setItem(
          this.getUserKey("eventos"),
          JSON.stringify(this.eventos)
        );
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
        this.eventos =
          JSON.parse(localStorage.getItem(this.getUserKey("eventos"))) || [];
      }
    },

    async getEventoById(id) {
      await this.getEventos();
      return this.eventos.find((p) => p.id === Number(id));
    },

    async addEvento(evento) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        evento.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].experiencias_ocio.eventos.push(evento);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.eventos = usuarios[usuario].experiencias_ocio.eventos;
        localStorage.setItem(
          this.getUserKey("eventos"),
          JSON.stringify(this.eventos)
        );

        return evento;
      } catch (error) {
        console.error("Error al guardar el evento:", error);
        throw error;
      }
    },

    async updateEvento(evento) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].experiencias_ocio.eventos.findIndex(
          (e) => e.id === evento.id
        );
        if (index === -1) {
          throw new Error("Evento no encontrado");
        }

        usuarios[usuario].experiencias_ocio.eventos[index] = evento;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.eventos = usuarios[usuario].experiencias_ocio.eventos;
        localStorage.setItem(
          this.getUserKey("eventos"),
          JSON.stringify(this.eventos)
        );

        return evento;
      } catch (error) {
        console.error("Error al actualizar el evento:", error);
        throw error;
      }
    },

    async removeEvento(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].experiencias_ocio.eventos = usuarios[
          usuario
        ].experiencias_ocio.eventos.filter((e) => e.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.eventos = usuarios[usuario].experiencias_ocio.eventos;
        localStorage.setItem(
          this.getUserKey("eventos"),
          JSON.stringify(this.eventos)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        throw error;
      }
    },

    async getComidas() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.comidas = datosUsuario?.experiencias_ocio?.comidas || [];
        localStorage.setItem(
          this.getUserKey("comidas"),
          JSON.stringify(this.comidas)
        );
      } catch (error) {
        console.error("Error al obtener las comidas:", error);
        this.comidas =
          JSON.parse(localStorage.getItem(this.getUserKey("comidas"))) || [];
      }
    },

    async getComidaById(id) {
      await this.getComidas();
      return this.comidas.find((p) => p.id === Number(id));
    },

    async addComida(comida) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        comida.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].experiencias_ocio.comidas.push(comida);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.comidas = usuarios[usuario].experiencias_ocio.comidas;
        localStorage.setItem(
          this.getUserKey("comidas"),
          JSON.stringify(this.comidas)
        );

        return comida;
      } catch (error) {
        console.error("Error al guardar la comida:", error);
        throw error;
      }
    },

    async updateComida(comida) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].experiencias_ocio.comidas.findIndex(
          (c) => c.id === comida.id
        );
        if (index === -1) {
          throw new Error("Comida no encontrada");
        }

        usuarios[usuario].experiencias_ocio.comidas[index] = comida;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.comidas = usuarios[usuario].experiencias_ocio.comidas;
        localStorage.setItem(
          this.getUserKey("comidas"),
          JSON.stringify(this.comidas)
        );

        return comida;
      } catch (error) {
        console.error("Error al actualizar la comida:", error);
        throw error;
      }
    },

    async removeComida(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].experiencias_ocio.comidas = usuarios[
          usuario
        ].experiencias_ocio.comidas.filter((c) => c.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.comidas = usuarios[usuario].experiencias_ocio.comidas;
        localStorage.setItem(
          this.getUserKey("comidas"),
          JSON.stringify(this.comidas)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la comida:", error);
        throw error;
      }
    },

    async getCompras() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.compras = datosUsuario?.experiencias_ocio?.compras || [];
        localStorage.setItem(
          this.getUserKey("compras"),
          JSON.stringify(this.compras)
        );
      } catch (error) {
        console.error("Error al obtener las compras:", error);
        this.compras =
          JSON.parse(localStorage.getItem(this.getUserKey("compras"))) || [];
      }
    },

    async getCompraById(id) {
      await this.getCompras();
      return this.compras.find((p) => p.id === Number(id));
    },

    async addCompra(compra) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        compra.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].experiencias_ocio.compras.push(compra);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.compras = usuarios[usuario].experiencias_ocio.compras;
        localStorage.setItem(
          this.getUserKey("compras"),
          JSON.stringify(this.compras)
        );

        return compra;
      } catch (error) {
        console.error("Error al guardar la compra:", error);
        throw error;
      }
    },

    async updateCompra(compra) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].experiencias_ocio.compras.findIndex(
          (c) => c.id === compra.id
        );
        if (index === -1) {
          throw new Error("Compra no encontrada");
        }

        usuarios[usuario].experiencias_ocio.compras[index] = compra;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.compras = usuarios[usuario].experiencias_ocio.compras;
        localStorage.setItem(
          this.getUserKey("compras"),
          JSON.stringify(this.compras)
        );

        return compra;
      } catch (error) {
        console.error("Error al actualizar la compra:", error);
        throw error;
      }
    },

    async removeCompra(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].experiencias_ocio.compras = usuarios[
          usuario
        ].experiencias_ocio.compras.filter((c) => c.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.compras = usuarios[usuario].experiencias_ocio.compras;
        localStorage.setItem(
          this.getUserKey("compras"),
          JSON.stringify(this.compras)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
        throw error;
      }
    },

    async getEjercicios() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.ejercicios = datosUsuario?.bienestar_salud?.ejercicios || [];
        localStorage.setItem(
          this.getUserKey("ejercicios"),
          JSON.stringify(this.ejercicios)
        );
      } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
        this.ejercicios =
          JSON.parse(localStorage.getItem(this.getUserKey("ejercicios"))) || [];
      }
    },

    async getEjercicioById(id) {
      await this.getEjercicios();
      return this.ejercicios.find((p) => p.id === Number(id));
    },

    async addEjercicio(ejercicio) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        ejercicio.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].bienestar_salud.ejercicios.push(ejercicio);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.ejercicios = usuarios[usuario].bienestar_salud.ejercicios;
        localStorage.setItem(
          this.getUserKey("ejercicios"),
          JSON.stringify(this.ejercicios)
        );

        return ejercicio;
      } catch (error) {
        console.error("Error al guardar el ejercicio:", error);
        throw error;
      }
    },

    async updateEjercicio(ejercicio) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].bienestar_salud.ejercicios.findIndex(
          (e) => e.id === ejercicio.id
        );
        if (index === -1) {
          throw new Error("Ejercicio no encontrado");
        }

        usuarios[usuario].bienestar_salud.ejercicios[index] = ejercicio;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.ejercicios = usuarios[usuario].bienestar_salud.ejercicios;
        localStorage.setItem(
          this.getUserKey("ejercicios"),
          JSON.stringify(this.ejercicios)
        );

        return ejercicio;
      } catch (error) {
        console.error("Error al actualizar el ejercicio:", error);
        throw error;
      }
    },

    async removeEjercicio(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].bienestar_salud.ejercicios = usuarios[
          usuario
        ].bienestar_salud.ejercicios.filter((e) => e.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.ejercicios = usuarios[usuario].bienestar_salud.ejercicios;
        localStorage.setItem(
          this.getUserKey("ejercicios"),
          JSON.stringify(this.ejercicios)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el ejercicio:", error);
        throw error;
      }
    },

    async getHabitos() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.habitos = datosUsuario?.bienestar_salud?.habitos || [];
        localStorage.setItem(
          this.getUserKey("habitos"),
          JSON.stringify(this.habitos)
        );
      } catch (error) {
        console.error("Error al obtener los hábitos:", error);
        this.habitos =
          JSON.parse(localStorage.getItem(this.getUserKey("habitos"))) || [];
      }
    },

    async getHabitoById(id) {
      await this.getHabitos();
      return this.habitos.find((p) => p.id === Number(id));
    },

    async addHabito(habito) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        habito.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].bienestar_salud.habitos.push(habito);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.habitos = usuarios[usuario].bienestar_salud.habitos;
        localStorage.setItem(
          this.getUserKey("habitos"),
          JSON.stringify(this.habitos)
        );

        return habito;
      } catch (error) {
        console.error("Error al guardar el hábito:", error);
        throw error;
      }
    },

    async updateHabito(habito) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].bienestar_salud.habitos.findIndex(
          (h) => h.id === habito.id
        );
        if (index === -1) {
          throw new Error("Hábito no encontrado");
        }

        usuarios[usuario].bienestar_salud.habitos[index] = habito;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.habitos = usuarios[usuario].bienestar_salud.habitos;
        localStorage.setItem(
          this.getUserKey("habitos"),
          JSON.stringify(this.habitos)
        );

        return habito;
      } catch (error) {
        console.error("Error al actualizar el hábito:", error);
        throw error;
      }
    },

    async removeHabito(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].bienestar_salud.habitos = usuarios[
          usuario
        ].bienestar_salud.habitos.filter((h) => h.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.habitos = usuarios[usuario].bienestar_salud.habitos;
        localStorage.setItem(
          this.getUserKey("habitos"),
          JSON.stringify(this.habitos)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el hábito:", error);
        throw error;
      }
    },

    async getEstadoAnimo() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.estado_animo = datosUsuario?.bienestar_salud?.estado_animo || [];
        localStorage.setItem(
          this.getUserKey("estado_animo"),
          JSON.stringify(this.estado_animo)
        );
      } catch (error) {
        console.error("Error al obtener el estado de ánimo:", error);
        this.estado_animo =
          JSON.parse(localStorage.getItem(this.getUserKey("estado_animo"))) ||
          [];
      }
    },

    async getEstadoAnimoById(id) {
      await this.getEstadoAnimo();
      return this.estado_animo.find((p) => p.id === Number(id));
    },

    async addEstadoAnimo(estado_animo) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        estado_animo.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].bienestar_salud.estado_animo.push(estado_animo);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.estado_animo = usuarios[usuario].bienestar_salud.estado_animo;
        localStorage.setItem(
          this.getUserKey("estado_animo"),
          JSON.stringify(this.estado_animo)
        );

        return estado_animo;
      } catch (error) {
        console.error("Error al guardar el estado de ánimo:", error);
        throw error;
      }
    },

    async updateEstadoAnimo(estado_animo) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].bienestar_salud.estado_animo.findIndex(
          (e) => e.id === estado_animo.id
        );
        if (index === -1) {
          throw new Error("Estado de ánimo no encontrado");
        }

        usuarios[usuario].bienestar_salud.estado_animo[index] = estado_animo;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.estado_animo = usuarios[usuario].bienestar_salud.estado_animo;
        localStorage.setItem(
          this.getUserKey("estado_animo"),
          JSON.stringify(this.estado_animo)
        );

        return estado_animo;
      } catch (error) {
        console.error("Error al actualizar el estado de ánimo:", error);
        throw error;
      }
    },

    async removeEstadoAnimo(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].bienestar_salud.estado_animo = usuarios[
          usuario
        ].bienestar_salud.estado_animo.filter((e) => e.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.estado_animo = usuarios[usuario].bienestar_salud.estado_animo;
        localStorage.setItem(
          this.getUserKey("estado_animo"),
          JSON.stringify(this.estado_animo)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el estado de ánimo:", error);
        throw error;
      }
    },

    async getMetas() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.metas = datosUsuario?.crecimiento_personal?.metas || [];
        localStorage.setItem(
          this.getUserKey("metas"),
          JSON.stringify(this.metas)
        );
      } catch (error) {
        console.error("Error al obtener las metas:", error);
        this.metas =
          JSON.parse(localStorage.getItem(this.getUserKey("metas"))) || [];
      }
    },

    async getMetaById(id) {
      await this.getMetas();
      return this.metas.find((m) => m.id === Number(id));
    },

    async addMeta(meta) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        meta.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].crecimiento_personal.metas.push(meta);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.metas = usuarios[usuario].crecimiento_personal.metas;
        localStorage.setItem(
          this.getUserKey("metas"),
          JSON.stringify(this.metas)
        );

        return meta;
      } catch (error) {
        console.error("Error al guardar la meta:", error);
        throw error;
      }
    },

    async updateMeta(meta) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].crecimiento_personal.metas.findIndex(
          (m) => m.id === meta.id
        );
        if (index === -1) {
          throw new Error("Meta no encontrada");
        }

        usuarios[usuario].crecimiento_personal.metas[index] = meta;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.metas = usuarios[usuario].crecimiento_personal.metas;
        localStorage.setItem(
          this.getUserKey("metas"),
          JSON.stringify(this.metas)
        );

        return meta;
      } catch (error) {
        console.error("Error al actualizar la meta:", error);
        throw error;
      }
    },

    async removeMeta(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].crecimiento_personal.metas = usuarios[
          usuario
        ].crecimiento_personal.metas.filter((m) => m.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.metas = usuarios[usuario].crecimiento_personal.metas;
        localStorage.setItem(
          this.getUserKey("metas"),
          JSON.stringify(this.metas)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la meta:", error);
        throw error;
      }
    },

    async getCursos() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.cursos = datosUsuario?.crecimiento_personal?.cursos || [];
        localStorage.setItem(
          this.getUserKey("cursos"),
          JSON.stringify(this.cursos)
        );
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
        this.cursos =
          JSON.parse(localStorage.getItem(this.getUserKey("cursos"))) || [];
      }
    },

    async getCursoById(id) {
      await this.getCursos();
      return this.cursos.find((c) => c.id === Number(id));
    },

    async addCurso(curso) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        curso.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].crecimiento_personal.cursos.push(curso);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.cursos = usuarios[usuario].crecimiento_personal.cursos;
        localStorage.setItem(
          this.getUserKey("cursos"),
          JSON.stringify(this.cursos)
        );

        return curso;
      } catch (error) {
        console.error("Error al guardar el curso:", error);
        throw error;
      }
    },

    async updateCurso(curso) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].crecimiento_personal.cursos.findIndex(
          (c) => c.id === curso.id
        );
        if (index === -1) {
          throw new Error("Curso no encontrado");
        }

        usuarios[usuario].crecimiento_personal.cursos[index] = curso;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.cursos = usuarios[usuario].crecimiento_personal.cursos;
        localStorage.setItem(
          this.getUserKey("cursos"),
          JSON.stringify(this.cursos)
        );

        return curso;
      } catch (error) {
        console.error("Error al actualizar el curso:", error);
        throw error;
      }
    },

    async removeCurso(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].crecimiento_personal.cursos = usuarios[
          usuario
        ].crecimiento_personal.cursos.filter((c) => c.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.cursos = usuarios[usuario].crecimiento_personal.cursos;
        localStorage.setItem(
          this.getUserKey("cursos"),
          JSON.stringify(this.cursos)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
        throw error;
      }
    },

    async getLogros() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.logros = datosUsuario?.crecimiento_personal?.logros || [];
        localStorage.setItem(
          this.getUserKey("logros"),
          JSON.stringify(this.logros)
        );
      } catch (error) {
        console.error("Error al obtener los logros:", error);
        this.logros =
          JSON.parse(localStorage.getItem(this.getUserKey("logros"))) || [];
      }
    },

    async getLogroById(id) {
      await this.getLogros();
      return this.logros.find((l) => l.id === Number(id));
    },

    async addLogro(logro) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        logro.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].crecimiento_personal.logros.push(logro);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.logros = usuarios[usuario].crecimiento_personal.logros;
        localStorage.setItem(
          this.getUserKey("logros"),
          JSON.stringify(this.logros)
        );

        return logro;
      } catch (error) {
        console.error("Error al guardar el logro:", error);
        throw error;
      }
    },

    async updateLogro(logro) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].crecimiento_personal.logros.findIndex(
          (l) => l.id === logro.id
        );
        if (index === -1) {
          throw new Error("Logro no encontrado");
        }

        usuarios[usuario].crecimiento_personal.logros[index] = logro;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.logros = usuarios[usuario].crecimiento_personal.logros;
        localStorage.setItem(
          this.getUserKey("logros"),
          JSON.stringify(this.logros)
        );

        return logro;
      } catch (error) {
        console.error("Error al actualizar el logro:", error);
        throw error;
      }
    },

    async removeLogro(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].crecimiento_personal.logros = usuarios[
          usuario
        ].crecimiento_personal.logros.filter((l) => l.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.logros = usuarios[usuario].crecimiento_personal.logros;
        localStorage.setItem(
          this.getUserKey("logros"),
          JSON.stringify(this.logros)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar el logro:", error);
        throw error;
      }
    },

    async getDiario() {
      try {
        const usuario = this.getUsuarioActual();
        await this.inicializarUsuarioEnServidor(usuario);

        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        this.diario = datosUsuario?.crecimiento_personal?.diario || [];
        localStorage.setItem(
          this.getUserKey("diario"),
          JSON.stringify(this.diario)
        );
      } catch (error) {
        console.error("Error al obtener el diario:", error);
        this.diario =
          JSON.parse(localStorage.getItem(this.getUserKey("diario"))) || [];
      }
    },

    async getDiarioById(id) {
      await this.getDiario();
      return this.diario.find((e) => e.id === Number(id));
    },

    async addDiario(diario) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        let usuarios = response.data;

        diario.id = Date.now();

        if (!usuarios[usuario]) {
          await this.inicializarUsuarioEnServidor(usuario);
          const newResponse = await axios.get("http://localhost:3000/usuarios");
          usuarios = newResponse.data;
        }

        usuarios[usuario].crecimiento_personal.diario.push(diario);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.diario = usuarios[usuario].crecimiento_personal.diario;
        localStorage.setItem(
          this.getUserKey("diario"),
          JSON.stringify(this.diario)
        );

        return diario;
      } catch (error) {
        console.error("Error al guardar el diario:", error);
        throw error;
      }
    },

    async updateDiario(diario) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        const index = usuarios[usuario].crecimiento_personal.diario.findIndex(
          (d) => d.id === diario.id
        );
        if (index === -1) {
          throw new Error("Entrada de diario no encontrada");
        }

        usuarios[usuario].crecimiento_personal.diario[index] = diario;
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.diario = usuarios[usuario].crecimiento_personal.diario;
        localStorage.setItem(
          this.getUserKey("diario"),
          JSON.stringify(this.diario)
        );

        return diario;
      } catch (error) {
        console.error("Error al actualizar la entrada de diario:", error);
        throw error;
      }
    },

    async removeDiario(id) {
      try {
        const usuario = this.getUsuarioActual();
        const response = await axios.get("http://localhost:3000/usuarios");
        const usuarios = response.data;

        usuarios[usuario].crecimiento_personal.diario = usuarios[
          usuario
        ].crecimiento_personal.diario.filter((d) => d.id !== id);
        await axios.put("http://localhost:3000/usuarios", usuarios);

        this.diario = usuarios[usuario].crecimiento_personal.diario;
        localStorage.setItem(
          this.getUserKey("diario"),
          JSON.stringify(this.diario)
        );

        return true;
      } catch (error) {
        console.error("Error al eliminar la entrada de diario:", error);
        throw error;
      }
    },

    async recargarDatosUsuario() {
      const usuario = this.getUsuarioActual();

      try {
        await this.inicializarUsuarioEnServidor(usuario);
        const response = await axios.get("http://localhost:3000/usuarios");
        const datosUsuario = response.data[usuario];

        if (datosUsuario) {
          this.peliculas = datosUsuario.entretenimiento?.peliculas || [];
          this.series = datosUsuario.entretenimiento?.series || [];
          this.libros = datosUsuario.entretenimiento?.libros || [];
          this.videojuegos = datosUsuario.entretenimiento?.videojuegos || [];
          this.musica = datosUsuario.entretenimiento?.musica || [];
          this.viajes = datosUsuario.experiencias_ocio?.viajes || [];
          this.eventos = datosUsuario.experiencias_ocio?.eventos || [];
          this.comidas = datosUsuario.experiencias_ocio?.comidas || [];
          this.compras = datosUsuario.experiencias_ocio?.compras || [];
          this.ejercicios = datosUsuario.bienestar_salud?.ejercicios || [];
          this.habitos = datosUsuario.bienestar_salud?.habitos || [];
          this.estado_animo = datosUsuario.bienestar_salud?.estado_animo || [];
          this.metas = datosUsuario.crecimiento_personal?.metas || [];
          this.cursos = datosUsuario.crecimiento_personal?.cursos || [];
          this.logros = datosUsuario.crecimiento_personal?.logros || [];
          this.diario = datosUsuario.crecimiento_personal?.diario || [];

          localStorage.setItem(
            this.getUserKey("peliculas"),
            JSON.stringify(this.peliculas)
          );
          localStorage.setItem(
            this.getUserKey("series"),
            JSON.stringify(this.series)
          );
          localStorage.setItem(
            this.getUserKey("libros"),
            JSON.stringify(this.libros)
          );
          localStorage.setItem(
            this.getUserKey("videojuegos"),
            JSON.stringify(this.videojuegos)
          );
          localStorage.setItem(
            this.getUserKey("musica"),
            JSON.stringify(this.musica)
          );
          localStorage.setItem(
            this.getUserKey("viajes"),
            JSON.stringify(this.viajes)
          );
          localStorage.setItem(
            this.getUserKey("eventos"),
            JSON.stringify(this.eventos)
          );
          localStorage.setItem(
            this.getUserKey("comidas"),
            JSON.stringify(this.comidas)
          );
          localStorage.setItem(
            this.getUserKey("compras"),
            JSON.stringify(this.compras)
          );
          localStorage.setItem(
            this.getUserKey("ejercicios"),
            JSON.stringify(this.ejercicios)
          );
          localStorage.setItem(
            this.getUserKey("habitos"),
            JSON.stringify(this.habitos)
          );
          localStorage.setItem(
            this.getUserKey("estado_animo"),
            JSON.stringify(this.estado_animo)
          );
          localStorage.setItem(
            this.getUserKey("metas"),
            JSON.stringify(this.metas)
          );
          localStorage.setItem(
            this.getUserKey("cursos"),
            JSON.stringify(this.cursos)
          );
          localStorage.setItem(
            this.getUserKey("logros"),
            JSON.stringify(this.logros)
          );
          localStorage.setItem(
            this.getUserKey("diario"),
            JSON.stringify(this.diario)
          );
        }
      } catch (error) {
        console.error("Error al recargar datos:", error);
        this.peliculas =
          JSON.parse(localStorage.getItem(this.getUserKey("peliculas"))) || [];
        this.series =
          JSON.parse(localStorage.getItem(this.getUserKey("series"))) || [];
        this.libros =
          JSON.parse(localStorage.getItem(this.getUserKey("libros"))) || [];
        this.videojuegos =
          JSON.parse(localStorage.getItem(this.getUserKey("videojuegos"))) ||
          [];
        this.musica =
          JSON.parse(localStorage.getItem(this.getUserKey("musica"))) || [];
        this.viajes =
          JSON.parse(localStorage.getItem(this.getUserKey("viajes"))) || [];
        this.eventos =
          JSON.parse(localStorage.getItem(this.getUserKey("eventos"))) || [];
        this.comidas =
          JSON.parse(localStorage.getItem(this.getUserKey("comidas"))) || [];
        this.compras =
          JSON.parse(localStorage.getItem(this.getUserKey("compras"))) || [];
        this.ejercicios =
          JSON.parse(localStorage.getItem(this.getUserKey("ejercicios"))) || [];
        this.habitos =
          JSON.parse(localStorage.getItem(this.getUserKey("habitos"))) || [];
        this.estado_animo =
          JSON.parse(localStorage.getItem(this.getUserKey("estado_animo"))) ||
          [];
        this.metas =
          JSON.parse(localStorage.getItem(this.getUserKey("metas"))) || [];
        this.cursos =
          JSON.parse(localStorage.getItem(this.getUserKey("cursos"))) || [];
        this.logros =
          JSON.parse(localStorage.getItem(this.getUserKey("logros"))) || [];
        this.diario =
          JSON.parse(localStorage.getItem(this.getUserKey("diario"))) || [];
      }
    },

    inicializarDatosUsuario() {
      this.recargarDatosUsuario();
    },

    limpiarDatos() {
      this.peliculas = [];
      this.series = [];
      this.libros = [];
      this.videojuegos = [];
      this.musica = [];
      this.viajes = [];
      this.eventos = [];
      this.comidas = [];
      this.compras = [];
      this.ejercicios = [];
      this.habitos = [];
      this.estado_animo = [];
      this.metas = [];
      this.cursos = [];
      this.logros = [];
      this.diario = [];
    },
  },
});
