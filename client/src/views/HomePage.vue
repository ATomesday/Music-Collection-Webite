<template>
    <video-background ref="video_background_page1" poster="/compress_grass_background.jpg" src="" style="height: 100vh;" 
      playsWhen="canplay" objectFit="cover">
        <div class="title">
          <div class="homePageTitle" style="margin-top: 10%;font-size: 80px;">Welcome to my</div>
          <div class="homePageTitle" style="font-size: 70px;">Website</div>
          <br>
          <v-btn variant="plain" color="rgba(255,255,255)" to="/music" size="x-large">Music</v-btn>
          <v-btn variant="plain" color="rgba(255,255,255)" to="/idea" size="x-large">Idea</v-btn>
        </div>
    </video-background>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from 'vue';
import '@mdi/font/css/materialdesignicons.css'

const axios = inject("axios")
const server_url = inject("server_url")

const video_background_page1 = ref()

const notication = ref({})

onMounted(async () => {
  const notice_res = await axios.post("/text/search",{ id:581619358433349 })
  notication.value = notice_res.data.rows[0]
})

</script>

<style lang="scss" scoped>

img {
  max-width: 100% !important;
}

.title {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family:cursive;
  margin-bottom: 0;
  padding-bottom: 0;

  .homePageTitle {
    text-shadow: 2px 2px 1px rgb(239, 213, 181);
    background: linear-gradient(90deg,#f8bf4b 0%,#F1950E 50.3%,#F83600 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

}

.noticeBoard {
  margin-top: 7%;
  margin-left: 15%;
  margin-right: 15%;
  height: 75%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  opacity: 95%;
  box-shadow: 20px 20px 70px 0px rgba(150, 150, 150, 0.8);

    .boardTitle {
      text-align: center;
      margin-top: 10px;
      font-size: 36px;
      font-weight: 500;
      font-family: KaiTi,Arial, Helvetica, sans-serif;
    }

    .boardText {
      margin-left: 6%;
      margin-right: 6%;
    }
}

</style>