<template>
    <transition name="fade">
        <div style="height: 100%">
            <v-toolbar
                    color="grey darken-2"
                    dark
            >
                <!--<h3>新闻管理系统</h3>-->
                <v-img  @click="$router.push('/')" style="cursor: pointer;margin: -2em" max-width="400px" :src="require('../../public/img/logo-big-horizontal.png')"/>
                <v-spacer/>
                <v-btn class="ma-2" tile text @click="setting = true">
                    <v-icon left>mdi-cog</v-icon> 用户设置
                </v-btn>
                <v-btn outlined @click="$router.push('/')" style="margin-right: 1em" >
                    返回主页
                    <v-icon right>mdi-exit-to-app</v-icon>
                </v-btn>
                <v-btn outlined @click="logout">
                    注销
                    <v-icon right>mdi-exit-to-app</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid style="padding: 0;height: 100%">
                <v-row no-gutters dense>
                    <v-col  cols="auto" class="flex-grow-1"><v-breadcrumbs :items="crumbItem" :key="crumbKey"></v-breadcrumbs><v-divider/></v-col>
                </v-row>
                <v-row style="height: 100%" no-gutters class="flex-nowrap">
                    <v-col cols="auto" style="height: 100%">
                        <div style="width: 256px;height: 100%;">
                            <v-navigation-drawer permanent
                                                 left>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon>mdi-home</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-title>主页</v-list-item-title>
                                    </v-list-item>

                                    <v-list-group
                                            prepend-icon="mdi-account-circle"
                                            value="true"
                                    >
                                        <template v-slot:activator>
                                            <v-list-item-title>管理</v-list-item-title>
                                        </template>

                                        <v-list-item
                                                v-for="(tab, i) in adminTabs"
                                                :key="i"
                                                link
                                                @click="goToTab(tab)"
                                        >
                                            <v-list-item-title v-text="tab.title"></v-list-item-title>
                                            <v-list-item-icon>
                                                <v-icon v-text="tab.icon"></v-icon>
                                            </v-list-item-icon>
                                        </v-list-item>
                                    </v-list-group>
                                    <v-list-group
                                            prepend-icon="mdi-account-box-multiple"
                                            value="true"
                                    >
                                        <template v-slot:activator>
                                            <v-list-item-title>条目管理</v-list-item-title>
                                        </template>

                                        <v-list-item
                                                v-for="(tab, i) in articlesTabs"
                                                :key="i"
                                                link
                                                @click="goToTab(tab)"
                                        >
                                            <v-list-item-title v-text="tab.title"></v-list-item-title>
                                            <v-list-item-icon>
                                                <v-icon v-text="tab.icon"></v-icon>
                                            </v-list-item-icon>
                                        </v-list-item>
                                    </v-list-group>
                                </v-list>
                            </v-navigation-drawer >
                        </div>
                    </v-col>
                    <v-col cols="auto" class="flex-grow-1"><router-view></router-view></v-col>
                </v-row>
            </v-container>
            <user-setting-dialog :dialog="setting" @close="setting = false"/>
        </div>
    </transition>
</template>

<script>
    import UserSettingDialog from "./Management/UserSettingDialog";
    import {StaticPageClient} from "../client/StaticPageClient";
    export default {
        name: "Manage",
        components: {UserSettingDialog},
        data:()=>({
            setting:false,
            adminTabs:[
                {
                    sec:"管理",
                    title: "新建",
                    icon:'mdi-folder-plus',
                    path:"/manage/editor"
                }
            ],
            pagesTab:[

            ],
            articlesTabs:[
                {sec:"条目管理",icon:'mdi-account-box-multiple',path:'/manage/articleType/NEWS',title: '要闻'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/ACTIVITY',title: '活动'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/POLICY',title: '政策'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/ANNOUNCE',title: '公告'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/TAX_FREE',title: '保税仓储'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/EXHIBITION',title: '展览展示'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path: '/manage/articleType/AUCTION',title: '拍卖'},
                {sec:"条目管理",icon:'mdi-account-box-multiple',path:'EXHIBITION_INFO',title: '展讯'}
            ],
            searchDialog:false,
            keyInput:'',
            crumbKey:0,
            crumbItem:[]
        }),

        methods:{
            logout:function (
            ) {
                this.$store.commit('logout')
                localStorage.removeItem('token')
                this.$router.push({name:'Home'})
            },
            search:function () {
                this.$router.push('/search/'+this.keyInput)
            },
            goToTab(tab){
                this.$router.push(tab.path)
                this.currentTab = tab
            }
        },
        async beforeMount() {
            if(this.$store.state.userObj.type !== 'ADMIN'){
                const arr = this.articlesTabs.filter(function (word) {
                    return word.path === '/manage/articleType/EXHIBITION' || word.path === '/manage/articleType/AUCTION'
                })
                this.articlesTabs.length = 0
                this.articlesTabs.push(...arr)
            }
            if(this.$store.state.userObj.type === 'ADMIN' || this.$store.state.userObj.type === 'AUTH'){
                this.adminTabs.push({
                    sec:"管理",
                    title:"静态页面管理",
                    icon:'mdi-account-box-multiple',
                    path:"/manage/pagesManagement"
                },
                    {
                        sec:"管理",
                        title:"荣誉墙管理",
                        icon:'mdi-account-box-multiple',
                        path:"/manage/wallImages"
                    }
                )
                // eslint-disable-next-line no-self-assign
                this.adminTabs = this.adminTabs
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const model = this
            const crumbItem = [
                {
                    text: '主页',
                    disabled: false,
                    href: '#',
                },
                {
                    text: [...this.adminTabs,...this.articlesTabs].filter(function (value) {
                        return value.path === model.$router.currentRoute.fullPath
                    })[0].sec,
                    disabled: false,
                    href: '#',
                },
                {
                    text: [...this.adminTabs,...this.articlesTabs].filter(function (value) {
                        return value.path === model.$router.currentRoute.fullPath
                    })[0].title,
                    disabled: true,
                    href: '#',
                },
            ]
            this.crumbItem.length = 0;
            this.crumbItem.push(...crumbItem)
            if(this.$store.state.userObj.type === 'ADMIN')this.pagesTab = await StaticPageClient.getStaticPageDtoList()

        },
        beforeUpdate:function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const model = this
            const crumbItem= [
                {
                    text: '主页',
                    disabled: false,
                    href: '#',
                },
                {
                    text: [...this.adminTabs].filter(function (value) {
                        return value.path === model.$router.currentRoute.fullPath
                    })[0].sec,
                    disabled: false,
                    href: '#',
                },
                {
                    text: [...this.adminTabs].filter(function (value) {
                        return value.path === model.$router.currentRoute.fullPath
                    })[0].title,
                    disabled: true,
                    href: '#',
                },
            ]
            this.crumbItem.length = 0;
            this.crumbItem.push(...crumbItem)
        }

    }
</script>

<style scoped lang="scss">
    $animationDuration: 0.5s; // specify animation duration. Default value: 1s
    @import "~vue2-animate/src/sass/vue2-animate";
</style>
