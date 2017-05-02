<style>
.uim-summary-header {
    height: 75px;
    background-color: #1F8CEB;
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
    padding: 20px 0 0 80px;
    color: #fff;
    box-sizing: border-box;
}
.uim-summary-header-title {
    color: #fff;
    font-size: 16px;
    line-height: 1.1em;
}
.uim-summary-header-desc {
    color: hsla(0,0%,100%,.8);
    font-size: 13px;
    line-height: 1.1em;
}
.uim-summary-body {
    position: absolute;
    top: 75px;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 80px;
    overflow-y: auto;
    overflow-x: hidden;
}
.uim-summary-new-chat {
    position: absolute;
    bottom: 30px;
    left: 50%;
    height: 45px;
    padding-left: 40px;
    padding-right: 20px;
    color: #fff;
    font-size: 13px;
    pointer-events: auto;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,.1);
    border-radius: 40px;
    background-color: #7e93af;
    text-align: center;
    transition: all .12s;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
}
.uim-summary-new-chat-icon {
    font-size: 18px;
    position: absolute;
    top: 50%;
    left: 20px;
    margin-top: -11px;
}
.leave-amimate {
    will-change: transform, opacity;
}
</style>

<template>
    <div class="uim-summary">
        <div class="uim-summary-header" :style="{ 'background-color': AppConfig.color }">
            <div class="uim-summary-header-title leave-hide">
                Conversations
            </div>
            <div class="uim-summary-header-desc leave-hide">
                umoon.inc
            </div>            
        </div>

        <div class="uim-summary-body">
            <Spinner v-if="!conversations.length"></Spinner>
            <SummaryItem class="leave-amimate" :key="data.id" :data="data" v-for="data in conversations"></SummaryItem>
        </div>

        <div class="uim-summary-footer">
            <button class="uim-summary-new-chat hover-shadow leave-hide">
                <span class="uim-summary-new-chat-icon ion-compose"></span>
                New Conversation
            </button>
        </div>
    </div>
</template>

<script>
import SummaryItem from '../components/SummaryItem.vue'
import Spinner from '../components/Spinner.vue'
import anime from 'animejs'

export default {
    data () {
        return {
            conversations: []
        }
    },
    computed: {
        AppConfig () {
            return this.$store.getters.AppConfig
        }
    },
    components: {
        SummaryItem,
        Spinner
    },
    beforeRouteLeave (to, from, next) {
        this.leaveAnimate(next)
    },
    mounted () {
        setTimeout(() => {
            this.loadConversation()
        }, 1000)
    },
    methods: {
        loadConversation () {
            this.conversations = [{
                id: '1',
                interlocutor: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                },
                lastMessage: {
                    message: '辣鸡网站 2345😭',
                    createdAt: '23 min ago',
                    sender: {
                        avatar: 'https://vuejs.org/images/logo.png',
                        username: 'Awe'
                    },
                    receiver: {
                        avatar: 'https://vuejs.org/images/logo.png',
                        username: 'Eric'
                    }
                }
            }, {
                id: '2',
                interlocutor: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: '柚木团队'
                },
                lastMessage: {
                    message: '233333',
                    createdAt: '23 min ago',
                    receiver: {
                        avatar: 'https://vuejs.org/images/logo.png',
                        username: 'Awe'
                    },
                    sender: {
                        avatar: 'https://vuejs.org/images/logo.png',
                        username: 'Eric'
                    }
                }
            }]
        },
        leaveAnimate (cb) {
            anime({
                targets: '.leave-hide',
                opacity: 0,
                duration: 300,
                complete: () => {
                    cb()
                }
            })

            anime({
                targets: '.leave-amimate',
                translateX: [0, -30],
                opacity: [1, 0],
                loop: false,
                direction: 'alternate',
                delay: function (el, i, l) {
                    return i * 100;
                },
                complete: () => {
                    cb()
                }
            })
        }
    }
}
</script>
