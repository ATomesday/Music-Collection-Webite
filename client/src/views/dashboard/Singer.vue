<template>
    <n-space>
        <n-button @click="showAddModal = true" strong secondary type="tertiary">添加</n-button>
        <n-button @click="local_data" strong secondary type="tertiary">刷新</n-button>
    </n-space>
    <n-data-table style="margin-top: 15px;"
    :columns="columns"
    :data="data"
    :bordered="false"
    />

    <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
        <template #header>
            <div>添加歌手</div>
        </template>
        <div>
            <n-input v-model:value="addSinger.name" type="text" placeholder="请输入名称" />
        </div>
        <template #action>
            <div>
                <n-button @click="add" type="info">提交</n-button>
            </div>
        </template>
    </n-modal>

</template>

<script setup>
import { NButton, NInput } from "naive-ui";
import { ref,reactive,inject,h, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")

const showAddModal=ref(false)
const data = ref([])
let addSinger = ref({
    name:"",
})

const local_data = async () => {
    data.value = []
    let result = await axios.get("/singer/list")
    for(let i_data of result.data.rows) 
    {
        let countResult = await axios.post("/music/statics",{ singer_id:i_data.id})
        data.value.push({
            singer:i_data.name,
            id:i_data.id,
            count:countResult.data.count
        })
    }
}

const add = async () =>{
    let result = await axios.post("/singer/_token/add",{ name:addSinger.value.name})
    if(result.data.code == 200){
        showAddModal.value = false
        local_data()
        message.info(result.data.msg)
        addSinger.value.name = ""
    }
    else {
        message.error(result.data.msg)
    }
}

const delete_singer = async (record) =>{
    dialog.warning({
        title: '警告',
        content: '请确定是否删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick:async () => {   
            let result = await axios.delete("/singer/_token/delete?id="+record.id)
            if(result.data.code == 200){
                message.info(result.data.msg)
            }
            else {
                message.error(result.data.msg)
            }
            local_data()
        },
        onNegativeClick: () => {}
        })
}

const update = async (id,value) =>{
    let result = await axios.put("/singer/_token/update",{ id:id,name:value })
        if(result.data.code == 200) {
        message.info(result.data.msg)
        local_data()
    }
    else {
        message.error(result.data.msg)
    }
}

const columns = ref([
    { title:"歌手",key:"singer",width:300,align:"center",
        render(record) {
            return h(NInput,{
                value:record.singer,
                onUpdateValue: (v) => { record.singer = v },
                onKeydown:(key) => {
                    if(key.code == "Enter") {
                        update(record.id,record.singer)
                    }
                },
            })
        }
    },
    { title:"歌曲总数",key:"count",align:"center",sorter:"default"},
    { title:"操作",key:"actions",
        render(record) {
            return [
                h(NButton, {
                    text:true,
                    type:"error",
                    onClick: () => delete_singer(record)                 
                },
                    { default: () => "删除"}
                ),
            ]
        }
    }
])

onMounted(()=>{
    local_data();
})



</script>


<style lang="scss" scoped>

</style>