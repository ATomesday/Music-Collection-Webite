<template>
    <div>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
</template>

<script setup>
import { ref,reactive,onBeforeUnmount, shallowRef, nextTick, inject } from 'vue'
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
     server: server_url + '/upload/rich_editor_upload',
     base64LimitSize: 5 * 1024, // 5kb
     maxFileSize: 10 * 1024 * 1024 //10M
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if(src.indexOf("http") !== 0) {
            return `${server_url}${src}`
        }
        return sec
    }
}
toolbarConfig.excludeKeys = [               // 排除菜单组，写菜单组 key 的值即可
    'uploadVideo'
]
const mode = ref("default")

const valueHtml = ref("")

const props = defineProps({
    modelValue:{
        type:String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false

nextTick(() => {
    valueHtml.value = props.modelValue
    initFinished = true
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if(initFinished) emit("update:model-value",valueHtml.value) 
};


</script>

<style lang="scss" scoped>

</style>