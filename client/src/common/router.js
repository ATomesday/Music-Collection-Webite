import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path:"/test",component: () => import("../views/test.vue") },
    { path:"/",component: () => import("../views/HomePage.vue") },
    { path:"/idea",component: () => import("../views/idea/homePageIdea.vue") },
    { path:"/music",component: () => import("../views/music/HomePageMusic.vue") ,children: [
        { path:"/music/random",component: () => import("../views/music/homePageMusic/RandMusic.vue") },
        { path:"/music/music_list",component: () => import("../views/music/homePageMusic/MusicList.vue") },
    ] },
    { path:"/login",component: () => import("../views/login.vue") },
    { path:"/dashboard",component: () => import("../views/dashboard/Dashboard.vue") ,children: [
        {path:"/dashboard/category",component: () => import("../views/dashboard/Category.vue") },
        {path:"/dashboard/music",component: () => import("../views/dashboard/Music.vue") },
        {path:"/dashboard/singer",component: () => import("../views/dashboard/Singer.vue") },
        {path:"/dashboard/notice",component: () => import("../views/dashboard/Notication.vue") },
        {path:"/dashboard/music_list",component: () => import("../views/dashboard/MusicList.vue") },
    ] 
    },
    
]



const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export { router,routes }