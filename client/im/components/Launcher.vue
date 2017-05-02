<style>
.im-launcher {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 60px;
    height: 60px;
    text-align: center;
    background: #1F8CEB;
    border-radius: 50%;
    cursor: pointer;
    transform-origin: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
}
.im-launcher-icon {
    line-height: 60px;
    color: #fff;
    font-size: 30px;
}
.im-launcher-open {
    position: absolute;
    left: 50%;
    margin-left: -12px;
}
.im-launcher-close {
    position: absolute;
    left: 50%;
    margin-left: -8px;
}
.switch-move-enter-active, .switch-move-leave-active {
  transition: all 1s;
}
.switch-move-enter, .switch-move-leave-active {
  opacity: 0;
}
.switch-move-enter {
  transform: translateX(31px);
}
.switch-move-leave-active {
  transform: translateX(-31px);
} 
</style>

<template>
    <div 
        class="im-launcher hover-shadow" 
        :style="{ 'background-color': AppConfig.color }"
        @click="toggle"
    >
        <transition name="switch-move">
            <div class="im-launcher-open" v-if="!launcher.show" key="show">
                <span class="im-launcher-icon ion-chatbubble-working"></span>
            </div>
            <div class="im-launcher-close" v-else key="close">
                <span class="im-launcher-icon ion-android-close"></span>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data () {
        return {
            launcher: {
                show: false
            }
        }
    },
    computed: {
        AppConfig () {
            return this.$store.getters.AppConfig
        }
    },
    methods: {
        toggle () {
            this.launcher.show = !this.launcher.show
            this.$emit('toggle')
        }
    }
}
</script>