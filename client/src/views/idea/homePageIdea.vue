<template>
    <div class="warpper" style="min-height: 100vh;">
        <V3Scroll trackColor="#BFC0C0" thumbColor="#797878" thumbHoverColor="#5d5a5a" scrollbarWidth="10px" />
        <v-tabs v-model="currentTab" style="position: sticky;top: 0;z-index: 1;background-color: white;border-bottom: 1px solid #E3E3E3;"
        slider-color="black">
          <v-tab value="ideaList">一些想法</v-tab>

          <!-- 公告栏 -->
          <v-dialog v-model="isNoticeBoard" max-width="900" >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn variant="text" prepend-icon="mdi-clipboard-text-outline" size="large" @click="isNoticeBoard = true"
              v-bind="activatorProps" color="blue" rounded style="margin-top: 0.2%;margin-left: auto;margin-right: 1%;">
              公告栏
              </v-btn>
            </template>
            <v-card>
            <v-card-title class="noticationTitle">公告栏</v-card-title>
            <v-card-text style="margin-left: 2%;margin-right: 2%;">
              <div v-html="notication.content"></div>
            </v-card-text>      
            <v-divider></v-divider>
            <v-card-actions>
            <v-btn
            text="Close"
            variant="plain"
            color="error"
            @click="isNoticeBoard = false"
            ></v-btn>
            </v-card-actions>
            </v-card>
          </v-dialog>

        <v-btn variant="text" prepend-icon="mdi-home" size="large" to="/"
        color="warning" rounded style="margin-top: 0.2%;margin-right: 2%;">主页</v-btn>
        </v-tabs>

        <v-tabs-window v-model="currentTab">
            <v-tabs-window-item value="ideaList">
                前面的区域请以后再来探索吧！
            </v-tabs-window-item>
        </v-tabs-window>
            <!-- 底部 -->
            <footer>
              <div class="footer-wrapper">
                <div class="footer-info">
                  <p><br></p>
                  <p>Contact me : QQ 484243037</p>
                  <p>© 2024 Kang Heath. All rights reserved.</p>
                </div>
              </div>
            </footer> 
          </div>
</template>
  
<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import '@mdi/font/css/materialdesignicons.css'

const axios = inject("axios")
const server_url = inject("server_url")
const $redrawVueMasonry = inject('redrawVueMasonry') as Function;

const currentTab = ref()
const isNoticeBoard = ref(false)
const notication = ref({content:" 前面的区域请以后再来探索吧！"})

</script>
  
<style lang="scss" scoped>
  
  img {
    max-width: 100% !important;
  }
  
  footer {
    background-color: #f2f2f2;
    padding: 10px;
    text-align: center;
    position: sticky;
    top:100vh;
  }
  
  .footer-info {
    margin: 10px 0;
    margin-top: 0;
    font-size: 14px;
    color: #888;
  }
  
  .title {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    padding-bottom: 0;
    font-family:Helvetica,Georgia,cursive,Arial;
    font-weight: 500;

  }
  

  .noticationTitle {
    text-align: center;
    margin-top: 10px;
    font-size: 36px;
    font-weight: 500;
    font-family: KaiTi,Arial, Helvetica, sans-serif;
  }

  
  .wrapper {
    background-color: white;
  }
  
  .pagination {
    margin-top: 15px;
    margin-bottom: 15px;
    position: sticky;
  }
  
  .hover_box:hover {
    transform: translateY(-1px);
    box-shadow: 0 13px 20px -12px rgb(0 36 100 / 50%);
    transform: all 0.3s;
}
  </style>