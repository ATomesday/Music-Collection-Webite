<template>
    <n-form>
        <n-form-item label="公告栏内容" label-style="font-size:24px;justify-content:center;margin:2%;" >
            <rich-editor v-model="notication.content" v-if="refresh"></rich-editor>
        </n-form-item>
        <n-form-item style="float: right;">
            <n-button @click="submit" ghost type="info">提交</n-button>
        </n-form-item>
    </n-form>
</template>

<script setup lang="ts">
import { NButton, NInput } from "naive-ui";
import { ref,reactive,inject,h, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
import RichEditor from "../../components/RichEditor.vue"

const axios = inject("axios")

const router = useRouter()
const route = useRoute()
const message = inject("message")

const notication = ref({
    content:"",
    name:"",
    id:null,
})

let refresh = ref(true)

onMounted(async () => {
    refresh.value = false
    const result = await axios.post("/text/search",{ id:581619358433349 })
    notication.value = result.data.rows[0]
    refresh.value = true
})


const submit =async () => {
    const result = await axios.put("/text/_token/update",notication.value)
    if(result.data.code == 200 )
    {
        message.info(result.data.msg)
    }
    else {
        message.error(result.data.msg)
    }
}



</script>

<style lang="scss" scoped>

</style>