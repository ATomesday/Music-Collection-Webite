<template>
    <div id="aplayer"></div>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line" style="min-height: 95vh;">
        <n-tab-pane name="list" tab="音乐列表" style="min-height: 80vh;">
            <v-text-field append-inner-icon="mdi-magnify" density="comfortable" label="Search Music" style="margin: auto;margin-top: 2%;"
            v-model="searchText" rounded width="500px" variant="underlined" single-line @click:append-inner="searchMusic" 
            v-on:keydown.enter="searchMusic" clearable></v-text-field>
            <div v-for="music in loadMusicInfo" style="margin-top: 2%;">   
                <v-card class="hover_box" min-height="202px">
                
                <v-dialog v-model="isCoverBoard" max-width="900" >
                    <template v-slot:activator="{ props: activatorProps }">
                    <v-img :src=" music.cover ? music.cover : default_cover" style="border:0.5px solid rgb(161, 161, 161,0.2);
                    position: absolute;left:10px;top:50%;transform:translateY(-50%)" width="200px" height="200px"
                    @click="isCoverBoard = true; curMusic = music" ></v-img>
                    </template>
                    <v-card>
                    <v-card-title class="noticationTitle">更改封面</v-card-title> 
                    <v-file-input clearable label="Cover" variant="solo-filled" accept="image/*"
                    v-model="uploadCoverFile" style="margin-right: 2%;"></v-file-input> 
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn text="Close" variant="plain" color="error" @click="isCoverBoard = false; uploadCoverFile = {} "></v-btn>
                        <v-btn text="Submit" variant="plain" color="blue" @click="uploadCover(uploadCoverFile,curMusic)" ></v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-card-title>
                    <div style="float: right;margin-top: 1%;">
                        <n-button circle strong secondary type="info" @click="addPlayerMusic(music)">
                            <img src="/icon/play.png">
                        </n-button>
                    </div>
                    <div style="font-size: larger;margin-left: 200px;">{{ music.name }}</div>  
                    <div style="font-size: small;margin-left: 250px;">-{{ music.singer }} </div>
                </v-card-title>
                <v-card-text>
                    <div v-html="music.introduction" style="font-size: medium ; margin-left: calc(200px + 1%);"></div>
                </v-card-text>
                <v-card-actions style="float: right;">
                    <n-button type="info" @click="updateTab(music)" quaternary>修改</n-button>
                    <n-button type="error" @click="deleteMusic(music)" quaternary>删除</n-button>
                </v-card-actions>
                <v-card-text>
                    <div style="font-size: small ; margin-left: calc(200px + 1%); " >添加时间: {{ music.create_time }}</div> 
                </v-card-text>                                        
            </v-card>
            </div>
            <v-pagination v-model="pageInfo.page" :length="pageInfo.pageCount"
                total-visible="7" :update="pageChange()" rounded="circle"
                prev-icon="mdi-menu-left" next-icon="mdi-menu-right"></v-pagination>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加音乐">
            
            <n-form>
                <n-form-item label="名称">
                    <n-input v-model:value="addMusic.name" />
                </n-form-item>
                <n-form-item label="歌手">
                    <n-select v-model:value="addMusic.singer_id" :options="singer_options" 
                    filterable tag />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addMusic.category_id" :options="category_options" />
                </n-form-item>
                <n-form-item label="音源">
                    <n-upload action="#" :custom-request="customRequest" method='POST'>
                    <n-button>上传文件</n-button>
                    </n-upload>
                </n-form-item>
                <n-form-item label="介绍">
                    <rich-editor v-model="addMusic.introduction"></rich-editor>
                </n-form-item>
                <n-form-item style="float: right;">
                    <n-button @click="add" ghost type="info">提交</n-button>
                </n-form-item>
            </n-form>

        </n-tab-pane>
        <n-tab-pane name="update" tab="修改音乐">

            <n-form>
                <n-form-item label="名称">
                    <n-input v-model:value="updateMusic.name" />
                </n-form-item>
                <n-form-item label="歌手">
                    <n-select v-model:value="updateMusic.singer_id" :options="singer_options" 
                    filterable tag />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateMusic.category_id" :options="category_options" />
                </n-form-item>
                <n-form-item label="歌词">
                    <n-upload accept=".lrc" action="#" :custom-request="customRequest_lrc" method='POST'>
                    <n-button>上传文件</n-button>
                    </n-upload>
                </n-form-item>
                <n-form-item label="介绍">
                    <rich-editor v-model="updateMusic.introduction"></rich-editor>
                </n-form-item>
                <n-form-item style="float: right;">
                    <n-button @click="update" ghost type="info">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script lang="ts" setup>

import { NButton, NInput } from "naive-ui";
import { ref,reactive,inject,h, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
import RichEditor from "../../components/RichEditor.vue"
import '@mdi/font/css/materialdesignicons.css'
import 'APlayer/dist/APlayer.min.css';
import APlayer from 'APlayer';

const axios = inject("axios")

const router = useRouter()
const route = useRoute()
const default_cover = "/icon/html_icon.PNG"

const server_url = inject("server_url")
const message = inject("message")
const dialog = inject("dialog")
const isCoverBoard = ref(false)

const tabValue = ref("list")
const data = ref([])
const addMusic = ref({
    name:"",
    singer_id:null,
    category_id:null,
    introduction:"几句话介绍一下本曲~",
    singer:"",
})

const updateMusic = ref({
    name:"",
    singer_id:null,
    category_id:null,
    introduction:"",
})

const singer_options = ref([])
const loadSinger = async () => {
    let result = await axios.get("/singer/list")
    for(let i_singer of result.data.rows)
    {
        singer_options.value.push({
            label:i_singer.name,
            value:i_singer.id
        })
    }
}

const category_options = ref([])
const loadCategory = async () => {
    let result = await axios.get("/category/list")
    for(let i_category of result.data.rows)
    {
        category_options.value.push({
            label:i_category.name,
            value:i_category.id
        })
    }
}

const pageInfo = reactive({
    page:1,
    pageSize:5,
    count:0,
    pageCount:0
})

const loadMusicInfo = ref([])
const searchText = ref("")
const loadMusic = async () => {
    let result = await axios.get("/music/search?" + "page=" + pageInfo.page + "&pagesize=" + pageInfo.pageSize + "&keyword=" + searchText.value)
    loadMusicInfo.value = result.data.data.rows
    for(let i_music of loadMusicInfo.value){
        let t = new Date(i_music.create_time)
        i_music.create_time = `${t.getFullYear()}.${t.getMonth()}.${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
    }
    pageInfo.count = result.data.data.count
    pageInfo.pageCount = Math.ceil( pageInfo.count / pageInfo.pageSize )
}

const pageChange = async () => {
    loadMusic()
}

const updateTab = async (music) => {
    updateMusic.value = music    
    tabValue.value = "update"
}

let audio = [{
  name:null,
  url:null,
  cover:null,
  artist:null,
  lrc:null,
  cover:default_cover,
}]
let ap = {}

const initAudio = () =>{
    ap = new APlayer({
        container: document.getElementById("aplayer"),
        lrcType: 3,
        audio: audio, 
        autoplay:false,
        order:"list",
        fixed:true,
        listMaxHeight: 1,
    });
}

onMounted(() => {
    loadSinger()
    loadCategory()
    loadMusic()
    initAudio()
}) 

const addPlayerMusic = (music) => {
    ap.list.add({
        name:music.name,
        artist:music.singer,
        url:server_url + music.music_FV,
        lrc:server_url + music.lrc,
        cover: music.cover ? music.cover : default_cover,
    })
    console.log(music.cover)
    ap.skipForward()
    ap.play()
    if(music.lrc) ap.lrc.show()
    else ap.lrc.hide()
}


const formData = new FormData();
const formData_lrc = new FormData();

const customRequest = ({ file }) => {
    formData.append('file', file.file);
}
const customRequest_lrc = ({ file }) => {
    formData_lrc.append('file',file.file);
}

const add = async () =>{
    if(addMusic.value.name == ""){
        message.error("请输入曲名");
        return;
    }
    else if(addMusic.value.singer_id == null){
        message.error("请输入歌手");
        return;
    }
    else if(addMusic.value.category_id == null){
        message.error("请输入分类");
        return;
    }
    let isExist = false
    for (let existedSinger of singer_options.value)
        if( existedSinger.value == addMusic.value.singer_id ) isExist = true
    if(!isExist){
        let result = await axios.post("/singer/_token/add",{ name:addMusic.value.singer_id})
        if(result.data.code == 200) {
            message.info("歌手" + result.data.msg)
            addMusic.value.singer_id = result.data.id
        }
        else message.error("歌手" + result.data.msg)
    }
    formData.append("category_id",addMusic.value.category_id)
    formData.append("singer_id",addMusic.value.singer_id)
    formData.append("name",addMusic.value.name)
    formData.append("introduction",addMusic.value.introduction)
    let result = await axios.post("/music/_token/add",formData)
    if(result.data.code == 200){
        message.info(result.data.msg)
        addMusic.value = {
            name:"",
            singer_id:null,
            category_id:null,
            introduction:"几句话介绍一下本曲~"
        }
    }
    else {
        message.error(result.data.msg)
    } 
    formData.delete("category_id")
    formData.delete("singer_id")
    formData.delete("name")
    formData.delete("introduction")
    formData.delete('file')
}

const update = async () =>{
    let isExist = false
    for (let existedSinger of singer_options.value)
        if( existedSinger.value == updateMusic.value.singer_id ) isExist = true
    if(!isExist){
        let result = await axios.post("/singer/_token/add",{ name:updateMusic.value.singer_id})
        if(result.data.code == 200) {
            message.info("歌手" + result.data.msg)
            updateMusic.value.singer_id = result.data.id
        }
        else message.error("歌手" + result.data.msg)
    }
    formData_lrc.append("category_id",updateMusic.value.category_id)
    formData_lrc.append("singer_id",updateMusic.value.singer_id)
    formData_lrc.append("name",updateMusic.value.name)
    formData_lrc.append("introduction",updateMusic.value.introduction)
    formData_lrc.append("lrc",updateMusic.value.lrc)
    formData_lrc.append("id",updateMusic.value.id)
    let result = await axios.put("/music/_token/update",formData_lrc)
    if(result.data.code == 200){
        message.info(result.data.msg)
        tabValue.value = "list"
    }
    else {
        message.error(result.data.msg)
    } 
    formData_lrc.delete("category_id")
    formData_lrc.delete("singer_id")
    formData_lrc.delete("name")
    formData_lrc.delete("introduction")
    formData_lrc.delete('file')
    formData_lrc.delete("id")
    formData_lrc.delete("lrc")
}

const deleteMusic = async (music) =>{            
    dialog.warning({
        title: '警告',
        content: '请确定是否删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick:async () => {   
            let result = await axios.delete("/music/_token/delete?",{
                params: { id:music.id }, data:{ url:music.music_FV,cover_url:music.cover,lrc_url:music.lrc } 
            })
            if(result.data.code == 200){
                message.info(result.data.msg)
                loadMusic()
            }
            else {
                message.error(result.data.msg)
            }
        },
        onNegativeClick: () => {}
        })
}

/* update cover */
const uploadCoverFile = ref()
const curMusic = ref()
const uploadCover = async (file,music) => {
    formData.append("singer",music.singer)
    formData.append("name",music.name)
    formData.append("id",music.id)
    formData.append('file',file)
    let result = await axios.put("/cover/_token/update",formData)
    if(result.data.code == 200){
        message.info(result.data.msg)
        isCoverBoard.value = false 
        uploadCoverFile.value = {}
    }
    else {
        message.error(result.data.msg)
    } 
    formData.delete("singer")
    formData.delete("name")
    formData.delete("id")
    formData.delete('file')
}

const searchMusic = () => {
    pageInfo.page = 1
    loadMusic()
}
</script>


<style lang="scss" scoped>

img {
    max-width: 100% !important;
  }

.hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}

</style>