<style>
.snack-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    height: 3rem;
    min-width: 15rem;
    background: #000;
    color: #fff;
    border-radius: .25rem .25rem 0 0;
    line-height: 3rem;
    font-size: 14px;
    padding: 0 1rem;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
    z-index: 100000;
}
.snack-slide-enter-active {
  transition: all .3s ease;
}
.snack-slide-leave-active {
  transition: all .3s ease;
}
.snack-slide-enter, .snack-slide-leave-active {
  transform: translate3d(-50%, 100%, 0);
}
</style>

<template>
    <transition name="snack-slide">
        <div class="snack-bar" v-show="snack.show">
            <div class="snack-bar-content" @click="hide">
                {{snack.content}}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data () {
        return {
            snack: {
                timer: null,
                content: '',
                show: false
            }
        }
    },
    methods: {
        create (text, time = 2000) {
            if (this.snack.timer) {
                clearTimeout(this.snack.timer)
                this.snack.timer = null
            }

            this.snack.show = true
            this.snack.content = text

            this.snack.timer = setTimeout(() => {
                this.hide()
                this.snack.timer = null
            }, time)
        },
        hide () {
            this.snack.show = false
            this.snack.content = ''
        }
    }
}
</script>