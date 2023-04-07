<template>
  <div ref="left_outer" id="left_outer">
    <div id="wrapper">
      <div id="loop" ref="loop">
        <div id="content" ref="content">
          <span>{{ init_data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Album_and_title",
  props: ["prop_album_and_title"],
  data: function () {
    return {
      init_data: this.prop_album_and_title,
    };
  },
  methods: {
    // emitChange: function () {
    //   console.log("Nastąpi zmiana albumu na " + this.album);
    //   this.$emit("change_album", this.album);
    // },
    // getInitialText() {
    //   return this.prop_album_and_title;
    // },

    changeInnerText: function (text) {
      let new_span = document.createElement("span");
      new_span.innerText = text;
      this.$refs.content.innerHTML = "";
      this.$refs.content.append(new_span);
    },

    repeatContent: function () {
      if (this.$refs.content.offsetWidth > this.$refs.left_outer.offsetWidth) {
        this.$refs.content.querySelector("span").className = "padright"; //padright jest w globalnym css'ie w index.html
        this.$refs.content.innerHTML += this.$refs.content.innerHTML;
        this.$refs.loop.className = "animate";
      }
    },

    removeAdditionallContent: function () {
      let only_span = this.$refs.content.querySelector("span");
      this.$refs.content.innerHTML = "";
      only_span.removeAttribute("class"); // usuwa klase pad-right
      //   console.log(html.className);
      this.$refs.content.append(only_span);
      this.$refs.loop.removeAttribute("class"); // usuwa klase animate
    },
  },
  computed: {
    // img_src: function () {
    //   return this.img;
    // },
  },
  watch: {
    prop_album_and_title: function (val) {
      console.log("wyrkyto zmiane tytulu z watcha na: " + val);
      this.changeInnerText(val);
      this.repeatContent();
      window.dispatchEvent(new Event("resize"));
      //   window.addEventListener("resize", () => {
      //     console.log(this.$refs.left_outer.offsetWidth);
      //     this.removeAdditionallContent();
      //     this.repeatContent(val);
      //   });
    },
  },

  mounted: function () {
    this.repeatContent();
    window.addEventListener("resize", () => {
      //   console.log(this.$refs.left_outer.offsetWidth);
      this.removeAdditionallContent();
      this.repeatContent();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#left_outer {
  width: 100%;
  overflow: hidden;
  /* height: 100%; */
}

#wrapper {
  display: inline-block;
}

#loop {
  white-space: nowrap;
  /* animation: loop-anim 10s linear infinite; */
}

.animate {
  animation: loop-anim 10s linear infinite;
  user-select: none;
}

@keyframes loop-anim {
  from {
    margin-left: 0;
  }

  to {
    margin-left: -50%;
    /* This works because of the div between "outer" and "loop" */
  }
}

/* .padright {
  padding-right: 20px;
} */
</style>
