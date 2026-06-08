<template>
    <!-- Show -->
    <v-row style="justify-content: center;margin-top: 1%;" ref="listShow">
        <v-card class="hover_box musicListCard addMusicList" @click="listAdd = true;initCurList()">
            <v-img :src="default_cover" class="musicListCardImg">
            </v-img>
            <v-img src="/icon/plus-circle-outline.svg" class="addList"></v-img>
            <div class="title">点此添加歌单</div>
        </v-card>
        <div v-for="(music_list,index) in musicLists">
            <v-card class="hover_box musicListCard">
                <v-img :src=" music_list.cover ? music_list.cover : default_cover" class="musicListCardImg" >
                </v-img>
                <v-btn icon="mdi-square-edit-outline" variant="text" size="small" style="left: 0;position: absolute;"
                @click="enterEditList(index)"></v-btn>
                
                <v-dialog v-model="delListDialog" max-width="500px">
                    <v-card>
                        <v-card-title>Are you sure you want to delete this music list?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="delListDialog = false">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="delList(curList.id,curList.cover)">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-btn icon="mdi-delete" variant="text" size="small" style="right: 0;position: absolute;" @click="delListDialog = true;curList = music_list"></v-btn>
                
                <div class="title">{{ music_list.name }}</div>
            </v-card>
        </div>
    </v-row>
    <!-- Add -->
    <v-dialog v-model="listAdd" transition="dialog-bottom-transition" fullscreen>
    <V3Scroll trackColor="#BFC0C0" thumbColor="#797878" thumbHoverColor="#5d5a5a" scrollbarWidth="10px" />
      <v-card>
        <v-toolbar density="compact">
          <v-btn icon="mdi-close" @click="listAdd = false;"></v-btn>
          <v-toolbar-title>添加歌单</v-toolbar-title>
          <v-toolbar-items>
            <v-btn text="Save" color="primary" variant="text" @click="addMusicList"></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-img :src="curList.cover" class="addListImg" @click="isAddListCoverBoard = true"></v-img>

        <v-dialog v-model="isAddListCoverBoard" max-width="900" >
            <v-card>
            <v-card-title class="title">更改封面</v-card-title> 
            <v-file-input clearable label="Cover" variant="solo-filled" accept="image/*"
            v-model="uploadCoverFile" style="margin-right: 2%;"></v-file-input> 
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn text="Close" variant="plain" color="error" @click="isAddListCoverBoard = false; uploadCoverFile = {} "></v-btn>
                <v-btn text="Submit" variant="plain" color="blue" @click="uploadCover" ></v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card-title style="padding-bottom: 0;padding-top: 0;">
        <v-text-field density="comfortable" label="List Name" style="margin: auto;margin-left: calc(200px + 2%);"
            v-model="curList.name" rounded width="500px" variant="underlined" single-line clearable></v-text-field>
        </v-card-title>
        <div style="margin-left: calc(200px + 3%);height: 178px;">
            <ckeditor v-model="curList.intro" :editor="editor" :config="editorConfig" />
        </div>
        <v-divider></v-divider>
        <v-data-table :headers="ListHeaders" :items="curList.music_set" :sort-by="[{ key: 'defOrder', order: 'asc' }]" style="z-index: 1;">
            
            <template v-slot:top>
                <v-dialog v-model="addListAddMusic" max-width="500px" >
                <v-card>
                    <v-card-title>添加音乐</v-card-title>
                    <v-combobox label="选择音乐" :items="musicOpt" item-title="name" item-value="name"
                    style="width: 80%;margin: auto;" v-model="curListMusic"></v-combobox>
                    <v-text-field label="#" v-model="curListMusicIndex" style="width: 80%;margin: auto;"></v-text-field>
                    <v-card-actions>
                        <v-btn color="error" @click="addListAddMusic = false;initCurListMusic()">Close</v-btn>
                        <v-btn color="primary" @click="addCurListMusic">Add</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>

                <v-dialog v-model="addListDelMusic" max-width="500px">
                    <v-card>
                        <v-card-title>Are you sure you want to delete this music?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="addListDelMusic = false">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="delCurListMusic">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="addListEditMusic" max-width="500px">
                    <v-card>
                        <v-title class="title">修改默认顺序</v-title>
                        <v-text-field label="#" v-model="curListMusicIndex" style="width: 80%;margin: auto;"></v-text-field>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="addListEditMusic = false">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="editCurListMusic">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-fab absolute style="top: 50px;right: 2%;" icon="mdi-plus-thick" 
                @click="addListAddMusic = true;curListMusicIndex = curList.music_set.length + 1;"></v-fab>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn icon="mdi-order-numeric-ascending" variant="text" @click="addListEditMusic = true;curListMusic = item;curListMusicIndex = item.defOrder"></v-btn>
                <v-btn icon="mdi-delete" variant="text" @click="addListDelMusic = true;curListMusic = item"></v-btn>
            </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <!-- Edit -->
    <v-dialog v-model="listEdit" transition="dialog-bottom-transition" fullscreen>
    <V3Scroll trackColor="#BFC0C0" thumbColor="#797878" thumbHoverColor="#5d5a5a" scrollbarWidth="10px" />
      <v-card>
        <v-toolbar density="compact">
          <v-btn icon="mdi-close" @click="listEdit = false;initMusicLists()"></v-btn>
          <v-toolbar-title>编辑歌单</v-toolbar-title>
          <v-toolbar-items>
            <v-btn text="Save" color="primary" variant="text" @click="editMusicList"></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-img :src="curList.cover" class="addListImg" @click="isEditListCoverBoard = true"></v-img>

        <v-dialog v-model="isEditListCoverBoard" max-width="900" >
            <v-card>
            <v-card-title class="title">更改封面</v-card-title> 
            <v-file-input clearable label="Cover" variant="solo-filled" accept="image/*"
            v-model="uploadCoverFile" style="margin-right: 2%;"></v-file-input> 
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn text="Close" variant="plain" color="error" @click="isEditListCoverBoard = false; uploadCoverFile = {} "></v-btn>
                <v-btn text="Submit" variant="plain" color="blue" @click="uploadCover" ></v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card-title style="padding-bottom: 0;padding-top: 0;">
        <v-text-field density="comfortable" label="List Name" style="margin: auto;margin-left: calc(200px + 2%);"
            v-model="curList.name" rounded width="500px" variant="underlined" single-line clearable></v-text-field>
        </v-card-title>
        <div style="margin-left: calc(200px + 3%);height: 178px;">
            <ckeditor v-model="curList.intro" :editor="editor" :config="editorConfig" />
        </div>
        <v-divider></v-divider>
        <v-data-table :headers="ListHeaders" :items="curList.music_set" :sort-by="[{ key: 'defOrder', order: 'asc' }]" style="z-index: 1;">
            
            <template v-slot:top>
                <v-dialog v-model="editListAddMusic" max-width="500px" >
                <v-card>
                    <v-card-title>添加音乐</v-card-title>
                    <v-combobox label="选择音乐" :items="musicOpt" item-title="name" item-value="name"
                    style="width: 80%;margin: auto;" v-model="curListMusic"></v-combobox>
                    <v-text-field label="#" v-model="curListMusicIndex" style="width: 80%;margin: auto;"></v-text-field>
                    <v-card-actions>
                        <v-btn color="error" @click="editListAddMusic = false;initCurListMusic()">Close</v-btn>
                        <v-btn color="primary" @click="addCurListMusic">Add</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>

                <v-dialog v-model="editListDelMusic" max-width="500px">
                    <v-card>
                        <v-card-title>Are you sure you want to delete this music?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="editListDelMusic = false">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="delCurListMusic">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="editListEditMusic" max-width="500px">
                    <v-card>
                        <v-title class="title">修改默认顺序</v-title>
                        <v-text-field label="#" v-model="curListMusicIndex" style="width: 80%;margin: auto;"></v-text-field>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="editListEditMusic = false">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="editCurListMusic">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-fab absolute style="top: 50px;right: 2%;" icon="mdi-plus-thick" 
                @click="editListAddMusic = true;curListMusicIndex = curList.music_set.length + 1;"></v-fab>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn icon="mdi-order-numeric-ascending" variant="text" @click="editListEditMusic = true;curListMusic = item;curListMusicIndex = item.defOrder"></v-btn>
                <v-btn icon="mdi-delete" variant="text" @click="editListDelMusic = true;curListMusic = item"></v-btn>
            </template>
        </v-data-table>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref,reactive,inject,h, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
import '@mdi/font/css/materialdesignicons.css'
import 'APlayer/dist/APlayer.min.css';
import APlayer from 'APlayer';
import {Autoformat,Bold,Italic,BlockQuote,Base64UploadAdapter,CloudServices,Essentials,Heading,Image,ImageCaption,
ImageStyle,ImageToolbar,ImageUpload,PictureEditing,Indent,IndentBlock,Link,List,MediaEmbed,Mention,Paragraph,PasteFromOffice,
Table,TableToolbar,TextTransformation,ClassicEditor} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const axios = inject("axios")

const router = useRouter()
const route = useRoute()
const default_cover = "/icon/html_icon.PNG"
const formData = new FormData()

const editor = ClassicEditor
const editorConfig = {
                plugins: [ Autoformat,BlockQuote,Bold,CloudServices,Essentials,Heading,Image,
                    ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Base64UploadAdapter,Indent,IndentBlock,Italic,Link,List,
                    MediaEmbed,Mention,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation, ],
                toolbar: [ 'undo', 'redo', '|', 'heading','|','bold','italic','|','link','uploadImage','insertTable','blockQuote','mediaEmbed',
                    '|','bulletedList','numberedList','outdent','indent',],
}

const server_url = inject("server_url")
const message = inject("message")
const musicOpt = ref([])
const delListDialog = ref(false)

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
    uploadCoverFile.value = {}
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
const uploadCoverFile = ref()
const uploadCover = () => {
    formData.append('file',uploadCoverFile.value)
    isAddListCoverBoard.value = false
    isEditListCoverBoard.value = false
}
const delList =async (id,cover) => {
    const res = await axios.delete("/music_list/_token/delete?",{
                params: { id:id }, data:{ cover_url:cover } 
    })
    if(res.data.code == 200){
        message.info(res.data.msg)
        delListDialog.value = false
        initMusicLists()
    }
    else {
        message.error(res.data.msg)
    }
}

const listAdd = ref(false)
const addListAddMusic =  ref(false)
const addListDelMusic = ref(false)
const addListEditMusic = ref(false)
const isAddListCoverBoard = ref(false)
const addCurListMusic = () => {
    curListMusic.value.value.defOrder = curListMusicIndex.value
    curList.value.music_set.push(curListMusic.value.value)
    addListAddMusic.value = false
    editListAddMusic.value = false
    initCurListMusic()
}

const delCurListMusic = () => {
    for(let index = 0;index < curList.value.music_set.length ;index ++)
    if(curListMusic.value.id == curList.value.music_set[index].id){
        curList.value.music_set.splice(index,1)
        break
    }
    addListDelMusic.value = false
    editListDelMusic.value = false
    initCurListMusic()
}

const addMusicList =async () => {
    if(curList.value.name == ""){
        message.error("请输入歌单名");
        return;
    }
    curList.value.music_set.sort((x,y) => {
        return x.defOrder - y.defOrder
    })
    formData.append("name",curList.value.name)
    formData.append("intro",curList.value.intro)
    formData.append("music_set",JSON.stringify(curList.value.music_set))
    let result = await axios.post("/music_list/_token/add",formData)
    if(result.data.code == 200){
        message.info(result.data.msg)
        listAdd.value = false
        initMusicLists()
    }
    else {
        message.error(result.data.msg)
    } 
    formData.delete("name")
    formData.delete("intro")
    formData.delete("music_set")
    if(uploadCoverFile.value) formData.delete("file")
}

const enterEditList = (index) => {
    curList.value = musicLists.value[index];
    if(typeof(curList.value.music_set) == "string") curList.value.music_set = JSON.parse(curList.value.music_set)
    listEdit.value = true;
}

const listEdit = ref(false)
const isEditListCoverBoard = ref(false)
const editListAddMusic = ref(false)
const editListDelMusic = ref(false)
const editListEditMusic = ref(false)
const editCurListMusic = () => {
    curListMusic.value.defOrder = curListMusicIndex.value
    editListEditMusic.value = false
    addListEditMusic.value = false
}
const editMusicList =async () => {
    if(curList.value.name == ""){
        message.error("请输入歌单名");
        return;
    }
    curList.value.music_set.sort((x,y) => {
        return x.defOrder - y.defOrder
    })
    formData.append("id",curList.value.id)
    formData.append("name",curList.value.name)
    formData.append("cover",curList.value.cover)
    formData.append("intro",curList.value.intro)
    formData.append("music_set",JSON.stringify(curList.value.music_set))
    let result = await axios.put("/music_list/_token/update",formData)
    if(result.data.code == 200){
        message.info(result.data.msg)
        listEdit.value = false
        initMusicLists()
    }
    else {
        message.error(result.data.msg)
    } 
    formData.delete("name")
    formData.delete("cover")
    formData.delete("id")
    formData.delete("intro")
    formData.delete("music_set")
    if(uploadCoverFile.value) formData.delete("file")
}

onMounted(async () => {
    initMusicLists()
    let res = await axios.get("music/search?pagesize=100000")
    const allMusic = res.data.data.rows;
    for(let i_music of allMusic){
        musicOpt.value.push({
            name:i_music.name + (i_music.name ? " -" + i_music.singer : ""),
            value:i_music,
        })
    }
})

</script>

<style lang="scss">

.hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}

.title {
    height: 100%;
    font-family:Helvetica,Georgia,cursive,Arial;
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    margin: 1%;
    overflow: hidden;
}

.addList {
    position: absolute;
    top: 0;
    width: 240px;
    height: 240px;
    z-index: 2;
    opacity: 0;

    &:hover {
        opacity: 30%;
    }

    &Img {
        height: 200px;
        width: 200px;
        position: absolute;
        border:0.5px solid rgb(161, 161, 161,0.2);
        top:68px;
        left: 2%;
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