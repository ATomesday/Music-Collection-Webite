<template>
    <div class="main_panel" style="height: 100vh;">
        <div class="menus"  ref="menu_options">
            <div v-for="(menu,index) in menus" @click="toPage(menu,index)">
                {{ menu.name }}
            </div>
        </div>
        <div class="divider"></div>
        <div style="padding: 20px;width: 100%;margin-left: 200px;">
            <V3Scroll trackColor="#BFC0C0" thumbColor="#797878" thumbHoverColor="#5d5a5a" scrollbarWidth="10px" />
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { ref,reactive,inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { AdminStore } from "../../stores/AdminStore";
const router = useRouter()
const route = useRoute()

const adminStore = AdminStore()
const axios = inject("axios")
const message = inject("message")
const menu_options = ref()

let menus = [
    { name: "音乐管理", href: "/dashboard/music"},
    { name: "歌单管理", href: "/dashboard/music_list"},
    { name: "分类管理", href: "/dashboard/category"},
    { name: "歌手管理", href: "/dashboard/singer"},
    { name: "公告变更", href: "/dashboard/notice"},
    { name: "退出", href: "logout"},
]

const toPage = (menu,index)=> {
    const oldOpt = menu_options.value.querySelector('.active')
    if (oldOpt) oldOpt.classList.remove('active')
    menu_options.value.children[index].classList.add('active')
    if(menu.href == "logout"){
        router.push("/login")
        adminStore.clearAdminInfo()
    }
    else{
        router.push(menu.href)
    }
    
}

</script>

<style lang="scss" scoped>

.main_panel {
    display: flex;
    color: #838ccf;
    max-width: 1500px;
    margin:0 auto;
    touch-action: none;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 200px;
    height: 100vb;

    div {
        cursor: pointer;

        &:hover {
            color: #F58A32;
        }
    }

}

.divider {
    width: 1px;
    vertical-align: middle;
    height: 96vb;
    margin-top: 1.5%;
    margin-bottom: 1%;
    margin-left: 200px;
    background-color: #F4ECE6;
}

.menus,
.divider {
  position: fixed; /* 固定侧边栏（滚动时保持原位）*/
}

.active {
    color:#EA3110;
}

</style>