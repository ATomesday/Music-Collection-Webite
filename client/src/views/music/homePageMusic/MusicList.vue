<template>
    <!-- Show -->
    <div v-if="toListShow">
    <v-row style="justify-content: center;margin-top: 1%;margin-bottom: 1%" >
        <div v-for="(music_list,index) in musicLists">
            <v-card class="hover_box musicListCard" @click="enterList(index)">
                <v-img :src=" music_list.cover ? music_list.cover : default_cover" class="musicListCardImg" >
                </v-img>
                <div class="listTitle">{{ music_list.name }}</div>
            </v-card>
        </div>
    </v-row>
    </div>
    <!-- Expand List --> 
    <div v-if="toCurList">
        <v-fab absolute style="right: 1%;top: 56px;" icon="mdi-undo-variant" @click="toCurList = false;toListShow = true"></v-fab>
        <v-img :src="curList.cover" class="curListImg" @click="isAddListCoverBoard = true"></v-img>
        <div class="curListTitle">{{ curList.name }}</div>
        <div class="curListContent" v-html="curList.intro"></div>
        <v-btn class="curListBtn" @click="addMusicList(curList)">播放全部</v-btn>
        <v-divider style="margin-top: 1%;"></v-divider>
        <v-data-table :headers="ListHeaders" :items="curList.music_set" :sort-by="[{ key: 'defOrder', order: 'asc' }]" >
            <template v-slot:item.actions="{ item }">
                <v-btn icon="mdi-play-outline" variant="text" @click="addMusic(item)"></v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts" setup>
import { ref,reactive,inject,h, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
import '@mdi/font/css/materialdesignicons.css'

const axios = inject("axios")

const router = useRouter()
const route = useRoute()
const default_cover = "/icon/html_icon.PNG"

const server_url = inject("server_url")
const message = inject("message")
const addMusic = inject("addMusic")
const noPagination = inject("noPagination")
const addMusicList = inject("addMusicList")

const toListShow = ref(true)
const toCurList = ref(false)
const curList = ref({
    name:"",
    cover:default_cover,
    intro:"",
    music_set:[],
    id:null,
})
const curListMusicIndex = ref(1)
const curListMusic = ref({
    name:"",
    introduction:"",
    music_FV:"",
    id:"",
    singer:"",
    lrc:"",
    cover:"",
    defOrder:1,
})
const initCurList = () => {
    curList.value = {
        name:"",
        cover:default_cover,
        intro:"",
        music_set:[],}
    initCurListMusic()
}
const initCurListMusic = () => {
    curListMusic.value = {
        name:"",
        introduction:"",
        music_FV:"",
        id:"",
        singer:"",
        lrc:"",
        cover:"",
        defOrder:1,
}}
const ListHeaders = ref([
        { title: '#', align: 'start', sortable: true, key: 'defOrder' },
        { title: '标题', key: 'name' , sortable: true },
        { title: '歌手', key: 'singer' , sortable: true },
        { title: '操作', key: 'actions', sortable: false },
])
const musicLists = ref([{}])
const initMusicLists =async () => {
    const res = await axios.get("/music_list/list")
    musicLists.value = res.data.rows
}

const enterList = (index) => {
    toListShow.value = false
    toCurList.value = true
    curList.value = musicLists.value[index]
    curList.value.music_set = JSON.parse(curList.value.music_set)
}

onMounted(async () => {
    initMusicLists()
    initCurList()
    noPagination()
})

</script>

<style lang="scss">

.hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}

.listTitle {
    height: 100%;
    font-family:Helvetica,Georgia,cursive,Arial;
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    margin: 1%;
    overflow: hidden;
}

.curList{
    &Title {
        position: absolute;
        top: 1%;
        left: calc(4% + 200px);
        font-family:Helvetica,Georgia,cursive,Arial;
        font-weight: 500;
        font-size: 28px;
    }
    &Content {
        position: absolute;
        left: calc(200px + 4%);
        top: calc(28px + 5%);
        height: 120px;
        overflow: hidden;
    }
    &Img {
        height: 200px;
        width: 200px;
        margin-top: 1%;
        border:0.5px solid rgb(161, 161, 161,0.2);
        left: 2%;
    }
    &Btn {
        position: absolute;
        left: calc(200px + 4%);
        top: calc(164px + 1%);
    }
}

.musicListCardImg {
    width: 240px;
    height: 240px;
    border:0.5px solid rgb(161, 161, 161,0.2);
    z-index: 1;
}

.musicListCard {
    width: 240px;
    height: 300px;
    margin: 10px;
}

</style>