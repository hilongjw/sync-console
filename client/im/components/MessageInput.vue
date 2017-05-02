<style>
.uim-conversation-input {
    position: relative;
    min-height: 55px;
    max-height: 200px;
}
.uim-conversation-input-textarea {
    height: 55px;
    max-height: 200px;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #565867;
    background-color: #f4f7f9;
    resize: none;
    border: none;
    transition: background-color .2s ease,box-shadow .2s ease;
    outline: none;
    box-sizing: border-box;
    padding: 18px;
    padding-right: 100px;
    padding-left: 30px;
    width: 100%;
    height: 100%;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.33;
    white-space: pre;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: -2px;
}
.uim-conversation-input-textarea:focus {
    outline: none;
    background-color: #fff;
    box-shadow: 0 0 100px 0 rgba(150,165,190,.24);
}
.uim-conversation-input-actions {
    position: absolute;
    top: 18px;
    left: 250px;
}
.uim-conversation-input-action-btn {
    position: relative;
    width: 30px;
    display: inline-block;
    cursor: pointer;
    border: none;
    background: none;
    outline: none;
}
.uim-conversation-input-action-btn-icon {
    width: 18px;
    height: 18px;
    left: 5px;
}
.uim-conversation-input-action-btn-icon.gif {
    width: 26px;
}
</style>

<template>
    <div class="uim-conversation-input">
        <textarea 
            @keyup.enter="submit" 
            @focus="focus"
            @blur="blur"
            rows="1" 
            v-model="form.text" 
            placeholder="Write a reply..."
            class="uim-conversation-input-textarea"
        ></textarea>
        <div class="uim-conversation-input-actions">
            <button class="uim-conversation-input-action-btn" @click="toggleGif">
                <transition name="move-fade">
                    <GifPicker v-if="state.showGif"></GifPicker>
                </transition>
                <img 
                    src="/static/images/gif.png" 
                    class="uim-conversation-input-action-btn-icon gif"
                >
            </button>
            <button class="uim-conversation-input-action-btn" @click="toggleEmoji">
                <transition name="move-fade">
                    <EmojiPicker v-if="state.showEmoji"></EmojiPicker>
                </transition>
                <img 
                    src="/static/images/emoji.png" 
                    class="uim-conversation-input-action-btn-icon"
                >
            </button>
            <button class="uim-conversation-input-action-btn">
                <img 
                    src="/static/images/file.png" 
                    class="uim-conversation-input-action-btn-icon"
                >
            </button>
        </div>
    </div>
</template>

<script>
import GifPicker from '../components/GifPicker.vue'
import EmojiPicker from '../components/EmojiPicker.vue'

export default {
    data () {
        return {
            form: {
                text: ''
            },
            state: {
                showGif: false,
                showEmoji: false
            }
        }
    },
    components: {
        GifPicker,
        EmojiPicker,
    },
    methods: {
        toggleGif () {
            this.state.showEmoji = false
            this.state.showGif = !this.state.showGif
        },
        toggleEmoji () {
            this.state.showGif = false
            this.state.showEmoji = !this.state.showEmoji
        },
        focus (e) {
            this.$emit('focus')
        },
        blur (e) {
            this.$emit('blur')
        },
        submit (e) {
            this.$emit('submit', {
                content: {
                    type: 'paragraph',
                    text: this.form.text
                },
                self: true,
                createdAt: '23 min ago',
                sender: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Awe'
                },
                receiver: {
                    avatar: 'https://vuejs.org/images/logo.png',
                    username: 'Eric'
                }
            })
            this.form.text = ''
        }
    }
}
</script>