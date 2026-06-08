import { defineStore } from "pinia";
import { inject, ref } from "vue";
import axios from "axios"

export const AdminStore = defineStore("admin", () =>{
    const adminInfo = ref({})

    const getAdminInfo = async ({ account,password }) => {
        const result = await axios.post("/admin/login",{
            account: account,
            password: password
        })
        adminInfo.value = result.data
    }

    const clearAdminInfo = () => {
        adminInfo.value = {}
    }

    return { adminInfo,getAdminInfo,clearAdminInfo }
},{ persist:true })