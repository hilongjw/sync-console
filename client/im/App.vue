<style src="./style/ionicons.css"></style>
<style>
.uim-messenger {
    -webkit-font-smoothing: antialiased;
    line-height: 1;
}
.uim-messenger button {
    outline: none;
}
.uim-container {
    z-index: 2147483000;
    position: fixed;
    bottom: 100px;
    right: 20px;
    height: calc(100% - 120px);
    width: 370px;
    min-height: 250px;
    max-height: 590px;
    box-shadow: 0 5px 40px rgba(0,0,0,.16);
    border-radius: 8px;
    overflow: hidden;
    opacity: 1;
}
.hover-black:hover {
    background: rgba(0, 0, 0, 0.15);
    cursor: pointer;
}
.hover-shadow:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    cursor: pointer;
}

.move-fade-enter-active,
.move-fade-leave-active {
  transition: all .3s ease;
}
.move-fade-enter, .move-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>

<template>
    <div class="uim-messenger">
        <transition name="move-fade">
            <div class="uim-container" v-if="launcher.show">
                <router-view></router-view>
            </div>
        </transition>
        <Laucher @toggle="toggle"></Laucher>
    </div>
</template>

<script>
import Laucher from './components/Launcher.vue'
export default {
    data () {
        return {
            launcher: {
                show: false
            }
        }
    },
    components: {
        Laucher
    },
    methods: {
        toggle () {
            this.launcher.show = !this.launcher.show
        }
    }
}
</script>