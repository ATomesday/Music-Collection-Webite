<template>
    <v-card style="margin: 5%;" class="hover_box">
        <v-img height="350px" width="350px" :src=" music.cover ? music.cover : default_cover" 
        class="randMusicImg"></v-img>
        <v-card-title>
            <v-card-text class="title" style="font-size: 20px;">{{ music.name }}</v-card-text>
            <v-card-text class="title" style="font-size: medium;margin-left: 30px;padding-top: 0;">{{ music.singer }}</v-card-text>
        </v-card-title>
        <v-card-text>
            <div v-html="music.introduction" class="randMusicIntro"></div>
        </v-card-text>
        <v-card-actions style="position:static;bottom: 0;width: 100%;" >
            <div class="randMusicBut">
                <v-btn icon="mdi-skip-previous" size="x-large" @click="prevMusic()"></v-btn>
                <v-btn :icon="playBut ? 'mdi-play' : 'mdi-pause'" size="x-large" @click="play"></v-btn>
                <v-btn icon="mdi-skip-next" size="x-large" @click="produceRandMusic"></v-btn>
            </div>
        </v-card-actions>
    </v-card>
        
</template>

<script setup>
import { ref,reactive,inject, onMounted } from "vue"

const axios = inject("axios")
const message = inject("message")
const default_cover = "/icon/html_icon.PNG"

const musicList = ref({});
const music = ref({});
const playBut = ref(true);
let musicCount = 0;

const apPause = inject("pause")
const apPlay = inject("play")
const apBack = inject("backMusic")
const apAddMusic = inject("addMusic")
const curTrack = inject("curMusic")
const noPagination = inject("noPagination")


const produceRandMusic = () =>{
    const index = Math.floor(Math.random()*musicCount) + 1;
    music.value = musicList.value[index];
    apAddMusic(music.value)
    playBut.value = false
}

onMounted(async () => {
    const res = await axios.get("music/search?pagesize=100000")
    musicList.value = res.data.data.rows;
    musicCount = res.data.data.count;
    noPagination()
})

const play = () => {
    if(music.value.name == null) {
        produceRandMusic(); 
        playBut.value = false;
    }
    else {
        if(playBut.value) apPlay();
        else apPause();
        playBut.value = !playBut.value;
    }
}

const prevMusic = () => {
    apBack();
    music.value = curTrack()
}

</script>

<style lang="scss">

.randMusicImg {
    border:0.5px solid rgb(161, 161, 161,0.2);
    float: left;
}

.hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}

.title {
    margin-bottom: 1%;
    padding-bottom: 0;
    font-family:Helvetica,Georgia,cursive,Arial;
    font-weight: 500;
  }
  

.randMusicIntro {
    font-size: medium ; 
    margin-left: 405px;
}

.randMusicBut {
    margin-left: auto;
}

@media screen and (max-width: 768px){
    .randMusicIntro {
        margin-left: 0;
        margin-top: auto;
        position: static;
    }

    .randMusicBut {
        margin-top: auto;
    }
}

</style>