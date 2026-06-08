<template>
    <div class="warpper" style="min-height: 100vh;">
      <V3Scroll trackColor="#BFC0C0" thumbColor="#797878" thumbHoverColor="#5d5a5a" scrollbarWidth="10px" />
      <v-tabs v-model="currentTab" style="position: sticky;top: 0;z-index: 1;background-color: white;border-bottom: 1px solid #E3E3E3;"
      slider-color="black">
        <v-tab v-for="category in menuOptions" :value="category.id" :text="category.name" 
        @click="pageInfoInit();showPagination = true" ></v-tab>
        <v-tab value="search" >
          <v-text-field append-inner-icon="mdi-magnify" density="compact" label="Search Music" style="margin-top: 1%;"
        v-model="searchText" rounded width="300px" variant="solo" single-line @click:append-inner="searchMusic" 
        v-on:keydown.enter="searchMusic" clearable></v-text-field>
        </v-tab>
        <v-tab value="randMusic" to="/music/random">音乐盲盒</v-tab>
        <v-tab value="playList" to="/music/music_list">歌单</v-tab>

        <!-- 公告栏 -->
        <v-dialog v-model="isNoticeBoard" max-width="900" >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn variant="text" prepend-icon="mdi-clipboard-text-outline" size="large" @click="isNoticeBoard = true"
            v-bind="activatorProps" color="blue" rounded style="margin-top: 0.2%;margin-left: auto;margin-right: 1%;">
            公告栏
            </v-btn>
          </template>
          <v-card>
          <v-card-title class="noticationTitle">公告栏</v-card-title>
          <v-card-text style="margin-left: 2%;margin-right: 2%;">
            <div v-html="notication.content"></div>
          </v-card-text>      
          <v-divider></v-divider>
          <v-card-actions>
          <v-btn
          text="Close"
          variant="plain"
          color="error"
          @click="isNoticeBoard = false"
          ></v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>

      <v-btn variant="text" prepend-icon="mdi-home" size="large" to="/"
      color="warning" rounded style="margin-top: 0.2%;margin-right: 2%;">主页</v-btn>
      </v-tabs>

      <v-tabs-window v-model="currentTab">
        <v-tabs-window-item v-for="category in menuOptions" :value="category.id">
          <div v-masonry fit-width="false" gutter="15" transition-duration="0.2s" style="margin:0 auto;margin-top: 1%;">
          <div v-masonry-tile  v-for="music in listMusic.get(category.id)" :id="music.id" style="margin-top: 1%;"> 
            <v-card width="202px" class="hover_box">
              <v-img :src=" music.cover ? music.cover : default_cover" style="border:0.5px solid rgb(161, 161, 161,0.2);" 
              width="200px" height="200px" class="musicCardImg">
              <n-button circle strong secondary type="info" @click="addMusic(music)" 
              style="left:80%;top:80%">
                <img src="/icon/play.png">
              </n-button>
              </v-img>
              <v-card-text class="title" style="font-size: 20px;">{{ music.name }}</v-card-text>
              <v-card-text class="title" style="font-size: small;margin-left: 30px;padding-top: 0;">{{ music.singer }}</v-card-text>
              <v-btn :icon="show.get(music.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="small" variant="text"
              @click="showOnOff(music.id)" style="left: 75%;margin-bottom: 2%;" ></v-btn>
              <v-expand-transition>
                <div v-show="show.get(music.id)">
                  <v-card-text>
                  <div v-html="music.introduction"></div>
                </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="search">
          <div v-masonry fit-width="false" gutter="15" transition-duration="0.2s" style="margin:0 auto;margin-top: 1%;">
          <div v-masonry-tile  v-for="music in listMusic.get('searchMusicRes')" :id="music.id" style="margin-top: 1%;"> 
            <v-card width="202px" class="hover_box">
              <v-img :src=" music.cover ? music.cover : default_cover" style="border:0.5px solid rgb(161, 161, 161,0.2);" 
              width="200px" height="200px" class="musicCardImg">
              <n-button circle strong secondary type="info" @click="addMusic(music)" 
              style="left:80%;top:80%">
                <img src="/icon/play.png">
              </n-button>
              </v-img>
              <v-card-text class="title" style="font-size: 18px;">{{ music.name }}</v-card-text>
              <v-card-text class="title" style="font-size: small;margin-left: 30px;padding-top: 0;">{{ music.singer }}</v-card-text>
              <v-btn :icon="show.get(music.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="small" variant="text"
              @click="showOnOff(music.id)" style="left: 75%;margin-bottom: 2%;" ></v-btn>
              <v-expand-transition>
                <div v-show="show.get(music.id)">
                  <v-card-text>
                  <div v-html="music.introduction"></div>
                </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="randMusic">
          <router-view></router-view>
        </v-tabs-window-item>
        <v-tabs-window-item value="playList">
          <router-view></router-view>
        </v-tabs-window-item>
        <div v-show="showPagination">
        <v-pagination v-model="pageInfo.page" :length="pageInfo.pageCount" style="margin-top: 3%;"
          total-visible="7" :update="pageChange()" rounded="circle" 
          prev-icon="mdi-menu-left" next-icon="mdi-menu-right" ></v-pagination>
        </div>
      </v-tabs-window>
          <!-- 底部 -->
          <footer>
            <div class="footer-wrapper">
              <div class="footer-info">
                <p><br></p>
                <p>Contact me : QQ 484243037</p>
                <p>© 2024 Kang Heath. All rights reserved.</p>
              </div>
            </div>
          </footer> 
        </div>
          <v-sheet position="sticky" class="musicPlayer">

            <div class="lyrics_box" >
              <ul ref="lyricUl" class="lyric" >
                <li v-for="(item, i) in lyric" >
                {{item.content}}
                </li>
              </ul>
            </div>

            <div>
              <v-img :src=" curTrack.cover ? curTrack.cover : default_cover" width="80px" height="80px" class="musicPlayerCover">
              </v-img>
              <div class="title" style="margin-left:110px;font-size: 20px;margin-top: 10px">{{ curTrack.name }}</div>
              <div class="title" style="margin-left:110px;font-size: small;">{{ curTrack.singer }}</div>
            </div>
            <div base-color="rgba(250, 252, 255,1)" class="playerControl">
              <v-btn variant="text" icon="mdi-skip-previous" size="large" @click="prevTrack"></v-btn>
              <v-btn variant="text" :icon="playBut ? 'mdi-play' : 'mdi-pause'" size="large" @click="playTrack"></v-btn>
              <v-btn variant="text" icon="mdi-skip-next" size="large" @click="nextAudio"></v-btn>

              <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="text" icon="mdi-playlist-music"></v-btn>
                </template>
                <v-list>
                  <v-list-subheader>PlayerList</v-list-subheader>
                  <v-list-item v-for="(item, i) in tracks" :key="i" nav
                  :value="i" :base-color=' i == curTrackId ? "#C03030":"none"'>
                    <v-list-item-title @click="changeTrack(i)" >{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle @click="changeTrack(i)" >{{ item.singer }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-btn variant="text" :icon="playOrder ? 'mdi-shuffle-variant' : 'mdi-shuffle-disabled'" size="large" @click="playOrderChange"></v-btn>
              
              <v-slider v-model="musicVolume" prepend-icon="mdi-volume-high" @update:modelValue="volumeChange"
              thumb-size="14" width="70%" thumb-color="#696969" class="musicVolume" ></v-slider>
              
            </div>
            <div class="progress" >
              <div class="progress_bar" ref="progress" @click="clickProgress">
                <div class="progress_current" :style="{ width : barWidth }"></div>
              </div>
              <div class="progress_time">{{ curTime }}/{{ duration }}</div>
            </div>
          </v-sheet>
</template>
  
<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import '@mdi/font/css/materialdesignicons.css'

const axios = inject("axios")
const server_url = inject("server_url")
const $redrawVueMasonry = inject('redrawVueMasonry') as Function;

const default_cover = "/icon/html_icon.PNG"
  
const showPagination = ref(true)
const pageInfo = reactive({
    page:1,
    pageSize:24,
    count:0,
    pageCount:0,
})
  
const currentTab = ref("search")
const searchText = ref("")
const listMusic = ref(new Map())
const menuOptions =ref([])
const show = ref(new Map())

const loadMusic =async (id) => {
    listMusic.value.set(id,null);
    let result = await axios.get("/music/search?" + "page=" + pageInfo.page + "&pagesize=" + pageInfo.pageSize + "&category_id=" + id)
    listMusic.value.set(id,result.data.data.rows) 
    pageInfo.count = result.data.data.count
    pageInfo.pageCount = Math.ceil( pageInfo.count / pageInfo.pageSize )
}  

const searchMusicLoad =async (id) => {
    listMusic.value.set('searchMusicRes',null);
    let result = await axios.get("/music/search?" + "page=" + pageInfo.page + "&pagesize=" + pageInfo.pageSize + "&keyword=" + searchText.value)
    listMusic.value.set('searchMusicRes',result.data.data.rows)
    pageInfo.count = result.data.data.count
    pageInfo.pageCount = Math.ceil( pageInfo.count / pageInfo.pageSize )
}
  
const pageChange = () => {
    if(currentTab.value == "search") searchMusicLoad()
    else loadMusic(currentTab.value)
}
  
const searchMusic = () => {
    showPagination.value = true;
    pageInfo.page = 1;
    searchMusicLoad()
}
  
const pageInfoInit = () => {
    pageInfo.page = 1
    loadMusic(currentTab.value)
}

/* Music_Player */
const curTrack = ref({})
const curTrackId = ref(0)
const progress = ref()
const duration = ref()
const curTime = ref()
const playBut = ref(true)
const barWidth = ref(0)
let myAudio = new Audio
let tracks = [{
  name:null,
  artist:null,
  music_FV:null,
  lrc:null,
  cover:null,
}]

const playTrack = () => {
  if(playBut.value) myAudio.play();
  else myAudio.pause();
  playBut.value = !playBut.value;
}

const generateTime = () => {
  let width = ( 100/myAudio.duration ) * myAudio.currentTime
  barWidth.value = width + "%"
  let durmin = Math.floor(myAudio.duration / 60);
  let dursec = Math.floor(myAudio.duration - durmin * 60);
  let curmin = Math.floor(myAudio.currentTime / 60);
  let cursec = Math.floor(myAudio.currentTime - curmin * 60);
  if (durmin < 10) {
    durmin = "0" + durmin;
  }
  if (dursec < 10) {
    dursec = "0" + dursec;
  }
  if (curmin < 10) {
    curmin = "0" + curmin;
  }
  if (cursec < 10) {
    cursec = "0" + cursec;
  }
  duration.value = durmin + ":" + dursec;
  curTime.value = curmin + ":" + cursec;
}

const updateBar = (curPos) => {
  let position = curPos - progress.value.offsetLeft;
  let percentage = (100 * position) / progress.value.offsetWidth;
  if (percentage > 100) {
    percentage = 100;
  }
  if (percentage < 0) {
    percentage = 0;
  }
  barWidth.value = percentage + "%";
  myAudio.currentTime = (myAudio.duration * percentage) / 100;
  myAudio.play();
}

const clickProgress = (pos) => {
  playBut.value = false;
  myAudio.pause();
  updateBar(pos.pageX)
}

const resetPlayer =async () => {
  barWidth.value = 0;
  myAudio.currentTime = 0;
  myAudio.src = server_url + curTrack.value.music_FV;
  await initlrc();
  if(curTrack.value.music_FV){
    myAudio.play();
    playBut.value = false;
  }
  else {
    myAudio.pause();
    playBut.value = true;
  }
}

const prevTrack = () => {
  if (curTrackId.value > 0) curTrackId.value--;
  else curTrackId.value = tracks.length - 1;
  curTrack.value = tracks[curTrackId.value];
  resetPlayer();
}

const nextTrack = () => {
  if (curTrackId.value < tracks.length - 1) curTrackId.value++;
  else curTrackId.value = 0;
  curTrack.value = tracks[curTrackId.value];
  resetPlayer();
}

const nextRandomTrack = () => {
  curTrackId.value = Math.floor(Math.random()*tracks.length);
  curTrack.value = tracks[curTrackId.value];
  resetPlayer();
}

let nextAudio = nextTrack

const playOrder = ref(true)
const playOrderChange = () => {
  if(playOrder.value) {
    myAudio.onended = function() {
      nextRandomTrack();
      playBut.value = false;
    };
    nextAudio = nextRandomTrack
  }
  else {
    myAudio.onended = function() {
      nextTrack();
      playBut.value = false;
    };
    nextAudio = nextTrack
  }
  playOrder.value = !playOrder.value
}

const initPlayer = () => {
    curTrack.value = tracks[0];
    myAudio.src = curTrack.value.url;
    myAudio.ontimeupdate =() => {
      generateTime();
      handleTimeUpdate(); 
    }
    myAudio.onloadedmetadata = generateTime;
    myAudio.onended = function() {
      nextTrack();
      playBut.value = false;
    };
}

/* lrc */
type Lyric = {
  timestamp: number
  content: string
}

const formatLyricTime = (time: string) => {
  const regMin = /.*:/
  const regSec = /:.*\./
  const regMs = /\./

  const min = parseInt((time.match(regMin) as any)[0].slice(0, 2))
  let sec = parseInt((time.match(regSec) as any)[0].slice(1, 3))
  const ms = time.slice((time.match(regMs) as any).index + 1, (time.match(regMs) as any).index + 3)
  if (min !== 0) {
    sec += min * 60
  }
  return Number(sec + '.' + ms)
}

const parseLyrics = (dataStr: string): Lyric[] => {
  const lines = dataStr.split('\n')
  const lyrics: Lyric[] = []
  const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/

  for (const line of lines) {
    if(line === '') continue
    const time = line.match(regTime)
      lyrics.push({
        timestamp: time ? formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0,
        content: line.split(']')[1] !== '' ? line.split(']')[1] : '',
      })
  }
  return lyrics
}

let lyric:Lyric[] = [{}]
let lyricIndex = 0
const lyricUl = ref()

const handleTimeUpdate = (): void => {
    const time = myAudio.currentTime
    let offset = 0
    for (let i = 0; i < lyric.length; i++) {
      if (time < lyric[i].timestamp) {
          lyricIndex = i > 0 ? i - 1 : 0
          for (let j = 0 ; j < i-1;j++)
          offset += lyricUl.value.children[j]?.clientHeight
          break
      }
    }
    let oldLi = lyricUl.value.querySelector('.active')
    if(oldLi){
      oldLi.classList.remove('active')
    }
    lyricUl.value.style.transform = `translateY(${-offset}px)`
    lyricUl.value.children[lyricIndex].classList.add('active')
}

const initlrc =async () => {
  lyricIndex = 0
  if(curTrack.value.lrc) {
  let res = await axios.get(server_url+curTrack.value.lrc)
  let curlrc = res.data
  lyric = parseLyrics(curlrc)
  }
  else lyric = [{timestamp: 10000,content:"暂无歌词"}]
}
  
const musicVolume = ref(100)

const volumeChange = (curVolume) => {
  myAudio.volume = curVolume/100
}

const addMusic =(music) => {
    if(curTrack.value.name == null) {
      tracks[0] = music
      curTrackId.value = 0
    }
    else {
      let existed = false
      curTrackId.value = tracks.length 
      for(let i = 0;i < tracks.length; i++)
        if(tracks[i].music_FV == music.music_FV) 
        {
          existed = true
          curTrackId.value = i;
          break;
        } 
      if(!existed) tracks.push(music)
    }
    curTrack.value = music
    playBut.value = false
    resetPlayer()
}

const showOnOff =(id) => {
  show.value.set(id,~show.value.get(id))
  setTimeout($redrawVueMasonry,150)
  setTimeout($redrawVueMasonry,300)
}

/* 公告栏 */
const isNoticeBoard = ref(false)
const notication = ref({})

const initNotication = async () => {
  const result = await axios.post("/text/search",{ id:581619358433349 })
  notication.value = result.data.rows[0]
}

/* 音乐盲盒 */
provide("pause",() => { myAudio.pause();playBut.value = true;} )
provide("play",() => { myAudio.play();playBut.value = false; })
provide("backMusic",() => { prevTrack() })
provide("addMusic",(music) => { addMusic(music) })
provide("addMusicList",(curList) => {
  tracks = curList.music_set
  curTrack.value = tracks[0]
  curTrackId.value = 0;
  playBut.value = false
  resetPlayer()
})
provide("curMusic",() => { return curTrack.value})
provide("noPagination",() => { showPagination.value = false })

onMounted(async () => {
    const category_res =await axios.get("/category/list")
    for(let panel of category_res.data.rows)
    {
        menuOptions.value.push({
            name:panel.name,
            id:panel.id,
        })
    }
    searchMusic()
    initNotication()
    initPlayer();
    if(currentTab.value == "randMusic") showPagination.value = false;
})

/* PlayerList */
const playerList = ref(false)
const changeTrack = (i) => {
  curTrackId.value = i;
  curTrack.value = tracks[curTrackId.value];
  resetPlayer();
}

</script>
  
<style lang="scss" scoped>
  
  img {
    max-width: 100% !important;
  }
  
  footer {
    background-color: #f2f2f2;
    padding: 10px;
    text-align: center;
    position: sticky;
    top:100vh;
  }
  
  .footer-info {
    margin: 10px 0;
    margin-top: 0;
    font-size: 14px;
    color: #888;
  }
  
  .title {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    padding-bottom: 0;
    font-family:Helvetica,Georgia,cursive,Arial;
    font-weight: 500;

  }
  

  .noticationTitle {
    text-align: center;
    margin-top: 10px;
    font-size: 36px;
    font-weight: 500;
    font-family: KaiTi,Arial, Helvetica, sans-serif;
  }

  
  .wrapper {
    background-color: white;
  }
  
  .pagination {
    margin-top: 15px;
    margin-bottom: 15px;
    position: sticky;
  }
  
  .hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}

.musicPlayer {
  bottom: 0;
  height:100px;
  background: rgb(250, 252, 255,0.95);
  border-top:0.2px solid rgb(71, 71, 71);

}

.musicPlayerCover {
  position: absolute;
  left: 20px;
  top:10px;
  border:0.5px solid rgb(161, 161, 161,0.2);
}

.progress {
  width: 100%;
  user-select: none;
  position: absolute;
  top: 55px;

  &_duration {
    color: #71829e;
    font-weight: 700;
    font-size: 20px;
    opacity: 0.5;
  }
  &_time {
    color: #71829e;
    float: right;
    top:14px;
    right: 25%;
    position: absolute;
    font-weight: 700;
    font-size: 14px;
    opacity: 0.7;
  }
}
.progress_bar {
  height: 6px;
  width: 50%;
  margin-left: 25%;
  cursor: pointer;
  background-color: #d0d8e6;
  display: inline-block;
  border-radius: 10px;
}
.progress_current {
  height: inherit;
  width: 0%;
  background-color: #a3b3ce;
  border-radius: 10px;
}

.lyrics_box {
  position: absolute;
  left: 25%;
  width: 50%;
  top: 10px;
  overflow: hidden;

  .lyric {
    text-align: center;
    max-height: 45px;
    transition: 0.5s;

    li {
      transition: 0.4s;
      line-height: 22px;
      &.active{
        color: #2657A1;
        transform: scale(1.2);
      }
    }
  }
}

.playerControl {
  left:78%;
  position: absolute;
  top: 6px;
}

@media screen and (max-width: 768px){
  .lyrics_box {
    display: none;
  }

  .musicPlayer {
    .title {
      display: none;
    }
  }

  .playerControl {
    left:25%;
  }

  .musicVolume {
    display: none;
  }

  .progress_bar {
    width: 68%;
  }

  .progress_time {
    right: 7%;
  }

  .musicPlayerCover {
    width: 60px;
    height: 60px;
    left: 10px;
  }

}


</style>