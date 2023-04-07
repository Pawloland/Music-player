<template>
  <tr :class="getTrClass" @mouseover="hover = true" @mouseleave="hover = false">
    <td class="left">{{ prop_album }}</td>
    <td class="center">{{ prop_title }}</td>
    <td class="right">{{ size(prop_size) }}</td>
    <td></td>
    <td></td>
    <td :class="getInlineMenuClass" @click="playThis()">
      <!-- {{ state }} -->
      <img :src="getStateImg" alt="pause" />
    </td>
    <td :class="getInlineMenuClass" @click="addToPlaylist()">
      <!-- {{ state }} -->
      <img src="/img/add_to_playlist.png" alt="add_to_playlist" />
    </td>
  </tr>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Item",
  props: [
    "prop_album",
    "prop_title",
    "prop_size",
    "prop_selected",
    "prop_state",
  ],
  data: function () {
    return {
      addToPlaylistUrl: "/addToPlaylist",
      state: this.prop_selected == this.prop_title ? true : false,
      was_selected_already: false,
      was_paused: false,
      was_resumed: false,
      old_title: this.prop_title,
      hover: false,
    };
  },
  methods: {
    size: function (bytes, decimals = 2) {
      if (bytes === 0) return "0 B";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    playThis: function () {
      // this.state = !this.state;
      // console.log("zmiana");
      // console.log(this.state);
      // console.log(this.was_selected_already);
      if (this.state == true) {
        this.state = false;
        this.was_resumed = false;
        this.was_paused = true;
        this.$emit("pause_song");
      } else if (this.was_selected_already == true) {
        this.state = true;
        this.was_resumed = true;
        this.was_paused = false;
        this.$emit("resume_song");
      } else {
        this.was_selected_already = true;
        this.$emit("start_song", this.prop_title);
      }
      // console.log(this.state);
      // console.log(this.was_selected_already);
      // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~");
    },
    addToPlaylist: async function () {
      console.log(
        "dodawanie do playlisty " + this.prop_album + "/" + this.prop_title
      );
      let body = JSON.stringify({
        album: this.prop_album,
        title: this.prop_title,
      }); // body - dane
      let headers = { "Contet-Type": "application/json;charset=utf-8" }; // nagłówek
      let response = await fetch(this.addToPlaylistUrl, {
        method: "POST",
        body,
        headers,
      }); // fetch
      if (!response.ok) {
        return response.status;
      } else {
        alert(JSON.stringify(await response.json()));
        // console.log(this.songs);
      }
    },
  },
  computed: {
    getStateImg: function () {
      // console.log(this.state);
      if (this.state == true) {
        return "/img/pause_compact.png";
      } else {
        return "/img/play_compact.png";
      }
    },
    getTrClass: function () {
      if (
        this.was_paused == true ||
        this.was_selected_already == true ||
        this.state == true ||
        this.was_paused == true ||
        this.was_resumed == true
      ) {
        return "selected";
      } else {
        return "initial";
      }
    },
    getInlineMenuClass: function () {
      if (
        this.state == true ||
        this.was_selected_already == true ||
        this.was_paused == true ||
        this.was_resumed == true ||
        this.hover == true
      ) {
        return "controll";
        // } else if (this.was_resumed == true) {
        //   return "controll";
        // } else if (this.was_paused == true) {
        //   return "hidden";
      } else {
        return "hidden";
      }
    },
  },
  watch: {
    prop_selected: function (val) {
      // console.log(this.old_title);
      if (this.old_title != val) {
        this.was_selected_already = false;
        this.was_resumed = false;
        this.was_paused = false;
      }
      this.state = this.prop_title == val ? true : false;
      if (this.state == true) {
        this.was_selected_already = true;
        this.was_resumed = false;
        this.was_paused = false;
      }
    },
    prop_title: function (val) {
      this.old_title = val;
      // console.log(this.old_title);
      this.was_resumed = false;
      this.was_paused = false;
      this.was_selected_already = false;
      this.state = this.prop_selected == val ? true : false;
    },
    prop_state: function (val) {
      if (this.was_selected_already == true) {
        this.state = val;
      }
    },
  },

  updated: function () {
    // this.state == false;
    // console.log("updated");
    // this.state = false;
    // console.log(this.state);
  },
  created: function () {
    // this.state == false;
    // this.old_album = this.prop_album;
    // console.log("created");
    // this.state = false;
    // console.log(this.state);
  },
  mounted: function () {
    // this.state == false;
    // console.log("mounted");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
  /* border: 1px solid red; */
  padding: 10px;
  /* width: 1%; */
  vertical-align: middle;
  /* cssowy trik, który ustawia szerokość po równo na każdą kolumnę  */
}

tr:hover {
  background-color: #13558c;
  color: white !important;
}

.left {
  text-align: left;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

td img {
  min-height: 10px;
  max-height: 30px;
  padding: 5px;
  box-sizing: border-box;
  display: block;
  background-color: #c1c1c1;
}

td.controll:hover {
  cursor: pointer;
}

td.controll {
  background-color: #c1c1c1;
  width: 10px;
  text-align: end;
}

.selected {
  background: #13558c;
  color: white !important;
}

.hidden {
  background-color: white;
  width: 10px;
  text-align: end;
}

.hidden img {
  min-height: 10px;
  max-height: 30px;
  display: block;
  padding: 5px;
  box-sizing: border-box;
  display: block;
  background-color: white;
}

.initial {
  /* defaultowa classa, która nic nie robi, tylko jest po to, żeby móć dawać inne lasy dynamicznie i je resetować ustawiając na tą klasę */
  color: initial;
}
</style>
