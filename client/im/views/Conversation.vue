<style>
.uim-conversation {

}
.uim-conversation-header {
    display: flex;
    height: 75px;
    background-color: #1F8CEB;
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
    padding: 15px;
    color: #fff;
    box-sizing: border-box;
}
.uim-conversation-header-back {
    line-height: 50px;
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 5px;
    text-align: center;
    margin-right: 10px;
}
.uim-conversation-new-chat {
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
.uim-conversation-new-chat-icon {
    font-size: 18px;
    position: absolute;
    top: 50%;
    left: 20px;
    margin-top: -11px;
}
.uim-conversation-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    transform: translateY(100%);
    transition: transform .3s;
}
.uim-conversation-header-user {
    border-radius: 5px;
}
.uim-conversation-header-profile {
    position: absolute;
    width: 280px;
    left: 65px;
}
.uim-conversation-header-profile-user {
    display: flex;
}
.uim-conversation-header-profile-user .uim-user-avatar img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
}
.uim-conversation-header-profile-user .uim-user-status {
    height: 10px;
    width: 10px;
    bottom: 8px;
    right: 0px;
    border: 3px solid #1f8ceb;
}
.uim-conversation-header-profile-user .uim-user-content {
    padding-top: 23px;
}
.uim-conversation-header-profile-desc {
    font-size: 14px;
    padding: 20px 0;
}
.uim-conversation-header-profile-intro {
    color: hsla(0,0%,100%,.8);
    font-size: 13px;
    line-height: 1.5;
}
</style>

<template>
    <div class="uim-conversation">
        <div class="uim-conversation-header" :style="{ height: headerSize.height + 'px', 'background-color': AppConfig.color }">
            <div class="uim-conversation-header-back hover-black" @click="navBack">
                <span class="uim-conversation-header-back-icon ion-chevron-left"></span>
            </div>

            <div class="uim-conversation-header-user hover-black" :style="{ opacity: headerSize.user }">
                <UserAvatar :user="data.interlocutor" :status="true" :name="true"></UserAvatar>
            </div>
            
            <div class="uim-conversation-header-profile" v-if="headerSize.profile > 0" :style="{ opacity: headerSize.profile }">
                <div class="uim-conversation-header-profile-user">
                    <UserAvatar :user="data.interlocutor" :status="true" :name="true"></UserAvatar>
                </div>
                <div class="uim-conversation-header-profile-desc">
                    <p>
                        Customer Support Representative
                    </p>
                    <p>
                        10:20 am in Dublin, Ireland
                    </p>
                </div>
                <div class="uim-conversation-header-profile-intro">
                    <span>
                        Hi, I'm Eric! Feel free to ask me anything :)
                    </span>
                </div>
            </div>    
        </div>
    
        <MessageList :list="messageList" :style="{ top: headerSize.height + 'px'}"></MessageList>

        <div class="uim-conversation-footer">
            <MessageInput @submit="submit"></MessageInput>
        </div>
    </div>
</template>

<script>
import SummaryItem from '../components/SummaryItem.vue'
import MessageList from '../components/MessageList.vue'
import MessageInput from '../components/MessageInput.vue'
import UserAvatar from '../components/UserAvatar.vue'

import anime from 'animejs'
import autosize from 'autosize'

export default {
    data () {
        return {
            headerSize: {
                height: 75,
                user: 1,
                profile: 0
            },
            messageList: [],
            data: {
                id: '1',
                interlocutor: {
                    avatar: 'http://tva4.sinaimg.cn/crop.100.50.300.300.180/69402bf8gw1eg7xjaoxzbj20dw0b4mx6.jpg',
                    username: 'Awe',
                    intro: 'interesting'
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
            }
        }
    },
    computed: {
        AppConfig () {
            return this.$store.getters.AppConfig
        }
    },
    components: {
        SummaryItem,
        MessageList,
        MessageInput,
        UserAvatar
    },
    mounted () {
        const textarea = this.$el.querySelector('textarea')
        this.$messageList = this.$el.querySelector('.uim-conversation-body')

        autosize(textarea)
        this.enterAnimate()
        setTimeout(() => {
            this.loadMessage()
        }, 2000)

        window.addEventListener('wheel', this.fullProfile)
        
    },
    methods: {
        navBack () {
            this.$router.go(-1)
        },
        enterAnimate () {
            anime({
                targets: '.uim-conversation-footer',
                translateY: '0'
            })
        },
        fullProfile (e) {
            const minHeight = 75
            const maxHeight = 260
            const delta = maxHeight - minHeight

            this.headerSize.user = 1 - (this.headerSize.height - minHeight) / delta
            this.headerSize.profile = (this.headerSize.height - minHeight) / delta

            if (e.deltaY > 0 && this.headerSize.height > minHeight){
                this.headerSize.height -= e.deltaY
                if (this.headerSize.height < minHeight) {
                    this.headerSize.height = minHeight
                    this.headerSize.user = 1
                    this.headerSize.profile = 0
                }
            } else {
                const scrollTop = this.$messageList.scrollTop
                if (scrollTop <= 0) {
                    if (this.headerSize.height < maxHeight) {
                        this.headerSize.height -= e.deltaY
                        if (this.headerSize.height > maxHeight * .7) {
                            this.headerSize.height = maxHeight
                            this.headerSize.user = 0
                            this.headerSize.profile = 1
                        }
                    }
                }
            }
        },
        loadMessage () {
            this.messageList = [{
                id: 1,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 2,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 3,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 4,
                content: {
                    type: 'paragraph',
                    text: 'You\'ll be notified at hilongjw@gmail.com if you leave.'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 5,
                content: {
                    type: 'paragraph',
                    text: 'You\'ll be notified at hilongjw@gmail.com if you leave.'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 6,
                content: {
                    type: 'paragraph',
                    text: 'You\'ll be notified at hilongjw@gmail.com if you leave.'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 7,
                content: {
                    type: 'paragraph',
                    text: 'You\'ll be notified at hilongjw@gmail.com if you leave.'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 8,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 9,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 10,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 11,
                content: {
                    type: 'paragraph',
                    text: '😨???'
                },
                createdAt: '23 min ago',
                self: false,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, {
                id: 12,
                content: {
                    type: 'image',
                    url: 'https://media.tenor.co/images/278f0fcd25956194e120ece7888151a6/tenor.gif'
                },
                createdAt: '23 min ago',
                self: true,
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            }, 
            // {
            //     id: 12,
            //     blocks: [{
            //         type: 'notecard',
            //         text: 'Hey 龙翊, you should definitely customize Intercom to show moumu users\' data. <br>This way you can more accurately target the right users. This 1 minute video shows you how it works.<br> Hope this helps :) Ruairí'
            //     }],
            //     createdAt: '23 min ago',
            //     self: true,
            //     sender: {
            //         avatar: 'https://vuejs.org/images/logo.png',
            //         username: 'Awe'
            //     },
            //     receiver: {
            //         avatar: 'https://vuejs.org/images/logo.png',
            //         username: 'Eric'
            //     }
            // }
            ]
        },
        submit (data) {
            this.messageList.push(data)
        }
    }
}
</script>
