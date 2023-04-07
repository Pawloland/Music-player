<template>
  <div id="outer">
    <div id="music_scrubber" @click="changeTime($event)">
      <div id="music_done" :style="scrubberStyle"></div>
    </div>
    <div id="buttons">
      <img @click="previousSong()" class="small" src="/img/previous.png" alt="previous" />
      <img @click="startPauseResumeSong()" class="big" :src="img" alt="play_stop" />
      <img @click="nextSong()" class="small" src="/img/next.png" alt="next" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Media_menu",
  props: ["prop_state", "prop_song_done", "prop_song_length"],
  methods: {
    previousSong: function () {
      this.$emit("previous_song");
    },
    startPauseResumeSong: function () {
      if (this.prop_state == true) {
        this.$emit("pause_song");
      } else {
        this.$emit("resume_song");
      }
    },
    nextSong: function () {
      this.$emit("next_song");
    },
    changeTime: function (event) {
      let rect = event.target.getBoundingClientRect();
      let x = event.clientX - rect.left; //x position within the element from top left.
      let y = event.clientY - rect.top; //y position within the element from top left.
      console.log(x, y);
      console.log(Math.round(x));
      if (this.prop_song_length != 0) {
        this.$emit("change_time", parseInt(Math.round(x)) / 200); // wysyła procent, bo nie da się ustalić co do sekundy (w postaci 0,10 a nie 10%)
      }
    },
  },
  computed: {
    img: function () {
      if (this.prop_state == true) {
        return "/img/pause.png";
      } else {
        return "/img/play.png";
      }
    },
    scrubberStyle: function () {
      console.log(
        "ponowna zmiana scrubbera " +
        this.prop_song_done +
        " " +
        this.prop_song_length +
        " => " +
        (parseInt(this.prop_song_done) / parseInt(this.prop_song_length)) *
        100
      );
      if (this.prop_song_length == 0 || this.prop_song_done == 0) {
        return "0%";
      } else {
        return `width:${(parseInt(this.prop_song_done) / parseInt(this.prop_song_length)) *
          100
          }%`;
      }
    },
  },
  watch: {
    prop_song_done: function (val) {
      console.log("wykryto zmiane prop_song_done na " + val);
    },
    prop_song_length: function (val) {
      console.log("wykryto zmiane prop_song_length na " + val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#outer {
  display: flex;
  width: 200px;
  align-items: center;
  height: 100%;
  flex-direction: column;
}

#music_scrubber {
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.397);
}

#music_scrubber:hover {
  cursor: pointer;
}

#music_done {
  width: 0%;
  height: 10px;
  background-color: rgb(255, 255, 255);
}

#buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100% - 10px);
  width: inherit;
  padding: 10px;
  box-sizing: border-box;
}

.big {
  height: 90%;
}

.small {
  height: 70%;
}

img:hover {
  cursor: pointer;
}
</style>
