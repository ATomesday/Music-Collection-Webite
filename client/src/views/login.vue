<template>
    <div class="login_panel">
        <n-card title="后台管理系统登录">
            <n-form :rules="rules" :model="admin">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="account" label="密码">
                    <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                </n-form-item>
            </n-form>
            <template #footer id="login_footer">
                <n-form style="float: right;">
                    <n-checkbox v-model:checked="admin.rember" label="记住我" />
                    <n-button @click="login">登录</n-button>
                </n-form>
            </template>
        </n-card>
    </div>
</template>

<script setup>

import { ref,reactive,inject } from "vue";
import { AdminStore } from "../stores/AdminStore";

import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

const axios = inject("axios")
const adminstore = AdminStore()
const message = inject("message")


let rules = {
account: [
    { required:true, message:"请输入账号", trigger:"blue" },
        { min:6, max:20, message:"您输入的账号不合规范", trigger:"blue" },
    ],
    password: [
        { required:true, message:"请输入密码", trigger:"blue" },
        { min:6, max:20, message:"您输入的密码不合规范", trigger:"blue" },
    ],
}

const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1
})

const login = async ()=>{
    await adminstore.getAdminInfo({ account:admin.account,password:admin.password })
    if(adminstore.adminInfo.code == 200)
    {
        router.push("/dashboard")
        message.info(adminstore.adminInfo.msg)
    }
    else{
        message.error(adminstore.adminInfo.msg)
    }
}

</script>

<style lang="scss" scoped>

.login_panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}

</style>