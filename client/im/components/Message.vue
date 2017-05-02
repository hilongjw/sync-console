<style>
.uim-conversation-message {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.4;
}
.uim-conversation-message.self {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
}
.uim-conversation-chat {
    padding: 17px 20px;
    border-radius: 6px;
    position: relative;
    color: #263238;
    background-color: #f4f7f9;
    max-width: 75%;
    box-sizing: border-box;
}
.uim-conversation-chat.self {
    color: #fff;
    background-color: #1F8CEB;
}
.uim-conversation-message-image {
    width: 100%;
    vertical-align: bottom;
}
.uim-msg-type-image .uim-conversation-chat {
    padding: 0;
}
</style>

<template>
    <div class="uim-conversation-message" :class="['uim-msg-type-' + message.content.type, message.self ? 'self': '']">
        <UserAvatar v-if="!message.self" :user="message.sender"></UserAvatar>
        <div 
            class="uim-conversation-chat"  
            :class="{ 'self': message.self  }"
            :style="{ 'background-color': message.self && AppConfig.color }"
        >

            <span v-if="message.content && message.content.type === 'paragraph'">
                {{ message.content.text }}
            </span>
            <img 
                class="uim-conversation-message-image" 
                v-if="message.content && message.content.type === 'image'" 
                v-lazy="message.content.url"
            >
            <div v-if="message.blocks" >
                
            </div>

            
        </div>
    </div>
</template>

<script>
import UserAvatar from './UserAvatar.vue'

export default {
    props: {
        message: Object
    },
    data () {
        return {
            load: false
        }
    },
    computed: {
        AppConfig () {
            return this.$store.getters.AppConfig
        }
    },
    components: {
        UserAvatar
    },
    mounted () {
        switch (this.message.content.type) {
            case 'image':
                this.loadImage(this.message.content.url)
                    .then(() => {
                        this.markLoad()
                    })
                break
            default: // sync
                this.markLoad()
                break
        }
    },
    methods: {
        markLoad () {
            this.load = true
            this.$emit('load')
        },
        loadImage (url) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = url

                img.onload = resolve
                img.onerror = reject
            })
            
        }
    }
}
</script>