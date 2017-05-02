<style>
.uim-conversation-body {
    position: absolute;
    top: 75px;
    bottom: 55px;
    left: 0;
    right: 0;
    overflow-y: auto;
    padding-bottom: 20px;
}
</style>

<template>
    <div class="uim-conversation-body">
        <div class="uim-conversation-chatbox" v-if="list.length">
            <Message 
                v-for="message in list" 
                :message="message"
                :key="message.id"
                @load="tryScrollEnd"
            ></Message>
        </div>
        <Spinner v-else></Spinner>
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'
import Message from '../components/Message.vue'

export default {
    props: {
        list: Array
    },
    data () {
        return {
            isBottom: true
        }
    },
    components: {
        Message,
        Spinner
    },
    mounted () {
        this.$el.addEventListener('scroll', this.checkIsBottom)
    },
    methods: {
        checkIsBottom () {
            const scrollTop = this.$el.scrollTop
            this.isBottom = scrollTop < 10
        },
        tryScrollEnd () {
            console.log('tryScrollEnd', this.$el.scrollTop, this.$el.scrollHeight)
            if (!this.isBottom) return
            this.scrollToEnd()
        },
        scrollToEnd () {
            this.$el.scrollTop = this.$el.scrollHeight
        }
    }
}
</script>