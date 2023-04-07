<template>
  <div @click="emitChange()">
    <img :src="img_src" :alt="album" />
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Cover",
  props: ["prop_album", "prop_index"],
  methods: {
    emitChange: function () {
      console.log(
        "Nastąpi zmiana wyświetlanego albumu z piosenkami na " + this.album
      );
      this.$emit("change_album", this.album);
    },
  },
  computed: {
    img_src: function () {
      return this.img;
    },
  },
  data: function () {
    return {
      url: "/getCover",
      album: this.prop_album,
      index: this.prop_index, // index jest do pobieranie na zmiane generic okładek, jesli nie ma jakiejś konkretnej
      img: undefined,
    };
  },
  created: async function () {
    // console.log(this.album);
    let body = JSON.stringify({ title: this.album, index: this.index }); // body - dane
    // console.log(body);
    let headers = { "Contet-Type": "application/json;charset=utf-8" }; // nagłówek

    let response = await fetch(this.url, {
      mode: "cors",
      method: "POST",
      body,
      headers,
    }); // fetch

    if (!response.ok) {
      console.log(response.status);
      return response.status;
    } else {
      let blob = await response.blob();

      const reader = new FileReader();

      reader.readAsDataURL(blob); // tutaj reader zaczyna czytać plik, powyższy event load to koniec tego czytania

      reader.addEventListener(
        "load",
        () => {
          this.img = reader.result;
        },
        false
      );
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  display: block;
  width: 100%;
}

img:hover {
  cursor: pointer;
}
</style>
