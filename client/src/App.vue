<template>
  <div id="app">
    <div id="outer_left">
      <img
        src="/img/playlist.png"
        alt="playlist"
        :class="getPlaylistClass"
        @click="
          playlist_selected = true;
          title = 'playlista pobrana z serwera';
          selected_song_index = undefined;
          resetSongTimings();
          openPlaylist();
        "
      />
      <a href="/admin">
        <img
          src="/img/upload_album_v1.png"
          alt="playlist"
        />
        <!-- @click="
            selected_song_index = undefined;
            resetSongTimings();
          "
        openPlaylist(); -->
      </a>
    </div>
    <div id="outer_right">
      <div id="top">
        <div id="left">
          <template v-for="(album, index) of albums" :key="album">
            <cover
              @change_album="
                title = 'web player cz4 - dragdrop';
                playlist_selected = false;
                selected_song_index = undefined;
                resetSongTimings();
                updateSelectedAlbum(album);
                getAllFiles(album);
              "
              :prop_album="album"
              :prop_index="index"
            ></cover>
          </template>
        </div>
        <div id="right">
          <h1>{{ title }}</h1>
          <table>
            <template v-for="(song, index) of songs" :key="song.title">
              <item
                @start_song="startSong(song.album, song.file, index)"
                @resume_song="resumeSong"
                @pause_song="pauseSong"
                :prop_album="song.album"
                :prop_title="song.file"
                :prop_size="song.size"
                :prop_selected="getCurrentSelectedSong"
                :prop_state="state"
              ></item>
            </template>
          </table>
        </div>
      </div>
      <div id="bottom">
        <div class="left">
          <album_and_title
            :prop_album_and_title="getMediaMenuAlbumAndTitle"
          ></album_and_title>
        </div>
        <media_menu
          class="centre"
          @previous_song="previousSong"
          @pause_song="pauseSong"
          @resume_song="resumeSong"
          @next_song="nextSong"
          @change_time="changeTime"
          :prop_state="state"
          :prop_song_done="this.song_done"
          :prop_song_length="this.song_length"
        ></media_menu>
        <audio id="audio" ref="audio" controls>
          <source ref="audio_source" type="audio/mp3" />
        </audio>
        <div class="right">
          {{ getFormatedTimeDone }} /
          {{ getFormatedTimeLength }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cover from "./components/Cover.vue";
import item from "./components/Item.vue";
import media_menu from "./components/Media_menu.vue";
import album_and_title from "./components/Album_and_title.vue";

export default {
  name: "App",
  components: {
    cover,
    item,
    media_menu,
    album_and_title,
  },
  data: function () {
    return {
      getAllFoldersUrl: "/getAllFolders",
      getAllFilesUrl: "/getAllFiles",
      getPlaylistUrl: "/getPlaylist",
      title: "web player cz4 - dragdrop",
      albums: undefined,
      songs: undefined,
      selected_song: undefined,
      playing_album: undefined,
      state: false,
      song_done: 0, // sekundy
      song_length: 0, // sekundy
      selected_song_index: undefined, // index wybranej piosenki, używany do wybrania next, previous w playliście i albumach
      playlist_selected: false,
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    updateSelectedAlbum: function (album) {
      // this.selected_album = album;
      this.playing_album = undefined;
      this.selected_song = undefined;
      this.state = false;
      this.$refs.audio.pause();
      this.$refs.audio_source.removeAttribute("src");
    },
    getAllFolders: async function () {
      let response = await fetch(this.getAllFoldersUrl, {
        method: "POST",
      }); // fetch
      if (!response.ok) {
        return response.status;
      } else {
        this.albums = await response.json();
        // console.log(this.albums);
      }
    },
    getAllFiles: async function (album) {
      // console.log(album);
      let body = JSON.stringify({ title: album }); // body - dane
      let headers = { "Contet-Type": "application/json;charset=utf-8" }; // nagłówek
      let response = await fetch(this.getAllFilesUrl, {
        method: "POST",
        body,
        headers,
      }); // fetch
      if (!response.ok) {
        return response.status;
      } else {
        this.songs = await response.json();
        // console.log(this.songs);
      }
    },
    previousSong: function () {
      //warunek sprawdza czy wgl jakikolwiek kawałek jest odtwarzany
      if (this.selected_song_index != undefined) {
        console.log(`Previous song`);
        // console.log(this.selected_song);
        // console.log(this.songs);
        try {
          // for (let [index, song] of this.songs.entries()) {
          //   // console.log(index, song.file);
          //   if (song.file == this.selected_song) {
          //     this.state = true;
          //     this.selected_song = this.songs[index - 1].file;
          //     this.$refs.audio_source.src = `/mp3/${this.playing_album}/${this.selected_song}`;
          //     this.$refs.audio.load();
          //     // this.song_length = this.$refs.audio.duration;
          //     // this.$refs.audio.play();
          //     break;
          //   }
          // }
          this.state = true;
          this.selected_song = this.songs[this.selected_song_index - 1].file;
          this.playing_album = this.songs[this.selected_song_index - 1].album;
          this.selected_song_index--;
          this.$refs.audio_source.src = `/mp3/${this.playing_album}/${this.selected_song}`;
          this.$refs.audio.load();
        } catch (e) {
          console.log("nie da się przewinąć zostaje:");
        }
        console.log(this.selected_song);
      }
    },
    startSong: function (album, title, index) {
      console.log(`Starting song ${title}`);
      // this.playing_album = this.selected_album;
      this.playing_album = album;
      this.selected_song = title;
      this.state = true;
      this.$refs.audio_source.src = `/mp3/${this.playing_album}/${this.selected_song}`;
      this.$refs.audio.load();
      // this.$refs.audio.play();
      this.selected_song_index = index;
    },
    pauseSong: function () {
      if (this.playing_album != undefined) {
        console.log(`Pausing song ${this.selected_song}`);
        this.state = false;
        this.$refs.audio.pause();
      }
    },
    resumeSong: function () {
      if (this.playing_album != undefined) {
        console.log(`Resuming song ${this.selected_song}`);
        this.state = true;
        this.$refs.audio.play();
      }
    },
    nextSong: function () {
      if (this.playing_album != undefined) {
        console.log(`Next song`);
        try {
          // for (let [index, song] of this.songs.entries()) {
          //   // console.log(index, song.file);
          //   if (song.file == this.selected_song) {
          //     this.state = true;
          //     this.selected_song = this.songs[index + 1].file;
          //     this.$refs.audio_source.src = `/mp3/${this.playing_album}/${this.selected_song}`;
          //     this.$refs.audio.load();
          //     // this.$refs.audio.play();
          //     break;
          //   }
          // }
          this.state = true;
          this.selected_song = this.songs[this.selected_song_index + 1].file;
          this.playing_album = this.songs[this.selected_song_index + 1].album;
          this.selected_song_index++;
          this.$refs.audio_source.src = `/mp3/${this.playing_album}/${this.selected_song}`;
          this.$refs.audio.load();
        } catch (e) {
          console.log("nie da się przewinąć zostaje:");
        }
        console.log(this.selected_song);
      }
    },

    changeTime: function (percent) {
      // try {
      console.log(`duration: ${this.$refs.audio.duration}`);
      console.log(`percent: ${percent}`);
      console.log(
        `currentTime: ${Math.round(this.$refs.audio.duration * percent)}`
      );
      let current_time = Math.round(this.$refs.audio.duration * percent);
      this.$refs.audio.currentTime = current_time;
      // } catch (error) {
      //   console.log("Nie da się zmienić czasu.");
      // }
    },

    updateSongDone: function (done) {
      this.song_done = done;
    },

    updateSongLength: function (length) {
      this.song_length = length;
    },

    resetSongTimings: function () {
      this.$refs.audio.currentTime = 0;
      this.updateSongLength(0);
    },

    openPlaylist: async function () {
      console.log("otwieranie playlisty");
      // updateSelectedAlbum()
      // this.selected_album = album;
      // this.playing_album = undefined;
      // this.selected_song = undefined;
      // this.state = false;
      // this.$refs.audio.pause();
      // this.$refs.audio_source.removeAttribute("src");
      //
      // this.selected_album = undefined; //będzie pobierane z jsona
      this.playing_album = undefined;
      this.selected_song = undefined;
      this.state = false;
      this.$refs.audio.pause();
      this.$refs.audio_source.removeAttribute("src");

      // async getAllFiles()
      // let body = JSON.stringify({ title: album }); // body - dane
      let headers = { "Contet-Type": "application/json;charset=utf-8" }; // nagłówek
      let response = await fetch(this.getPlaylistUrl, {
        method: "POST",
        // body,
        headers,
      }); // fetch
      if (!response.ok) {
        return response.status;
      } else {
        this.songs = await response.json();
        // console.log(this.songs);
      }
    },
  },
  computed: {
    getCurrentSelectedSong: function () {
      return this.selected_song;
    },

    getCurrentState: function () {
      return this.state;
    },

    getMediaMenuAlbumAndTitle: function () {
      if (this.selected_song == undefined) {
        return "Tytuł albumu/tytuł utworu";
      } else {
        return `${this.playing_album}/${this.selected_song}`;
      }
    },
    getPlaylistClass: function () {
      if (this.playlist_selected == true) {
        return "active_playlist";
      } else {
        return "initial";
      }
    },

    // getSongSrc: function () {
    //   if (this.selected_song == undefined) {
    //     return "";
    //   } else {
    //     return `/mp3/${this.playing_album}/${this.selected_song}`;
    //   }
    // },
    getFormatedTimeDone: function () {
      // time in seconds is always rounded up
      let m = Math.floor(this.song_done / 60);
      let s = this.song_done % 60;

      m = m.toString().length == 1 ? `0${m}` : m;
      s = s.toString().length == 1 ? `0${s}` : s;
      return `${m}:${s}`;
    },
    getFormatedTimeLength: function () {
      // time in seconds is always rounded up
      let m = Math.floor(this.song_length / 60);
      let s = this.song_length % 60;

      m = m.toString().length == 1 ? `0${m}` : m;
      s = s.toString().length == 1 ? `0${s}` : s;
      return `${m}:${s}`;
    },
  },
  created: async function () {
    await this.getAllFolders();
    // this.updateSelectedAlbum(this.albums[0]);
    // this.getAllFiles(this.selected_album);
    this.getAllFiles(this.albums[0]);

    this.$refs.audio.onloadeddata = (event) => {
      event.target.play();
      this.updateSongLength(Math.ceil(event.target.duration));
      console.log(event.target.duration);
      event.target.ontimeupdate = (event) => {
        this.updateSongDone(Math.ceil(event.target.currentTime));
        console.log(event.target.currentTime);
      };
    };
  },
};
</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
}

#outer_left {
  width: 50px;
  background-color: #c1c1c1;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

#outer_left img {
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
}

#outer_left img:hover {
  cursor: pointer;
}

#outer_right {
  width: calc(100% - 50px);
}

#top {
  height: calc(100% - 100px);
  display: flex;
}

#left {
  background-color: #13558c;
  max-width: 200px;
  min-width: 200px;
  overflow: auto;
}
#right {
  background-color: white;
  flex-grow: 1;
  text-align: center;
  overflow: auto;
}
#right h1 {
  color: #13558c;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  background: white;
}

#bottom {
  background-color: #13558c;
  display: flex;
  height: 100px;
  justify-content: space-between;
}

#bottom .left {
  color: white;
  width: calc(100% - 220px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  margin: 20px;
  overflow: hidden;
  /* word-wrap: anywhere; */
  /* white-space: nowrap; */
  /* word-break: keep-all; */
}

#bottom .centre {
  color: white;
}

#audio {
  display: none;
}

#bottom .right {
  color: white;
  width: calc(100% - 220px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.active_playlist {
  background-color: #13558c;
}

.initial {
  /* defaultowa classa, która nic nie robi, tylko jest po to, żeby móć dawać inne lasy dynamicznie i je resetować ustawiając na tą klasę */
  color: initial;
}
</style>
