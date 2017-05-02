<style>
.uim-popover {
    z-index: 2147483004;
    position: absolute;
    bottom: 50px;
    width: 330px;
    height: 260px;
    bottom: 40px;
    box-shadow: 0 1px 15px 1px rgba(0,0,0,.08);
    background-color: #fff;
    border-radius: 6px;
}
.uim-gif-picker {
    right: calc(50% - 86px);
}
.uim-gif-picker::after {
    content: ' ';
    position: absolute;
    bottom: -8px;
    right: 73px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fff;
}
.uim-popover-search {
    display: flex;
    border-bottom: 1px solid #ececec;
    padding: 0 5px;
}
.uim-popover-search-text {
    width: 100%;
    border: none;
    outline: none;
}
.uim-popover-search-icon {
    height: 30px;
    width: 30px;
    font-size: 16px;
    line-height: 30px;
}
.uim-gif-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 5px;
    height: 220px;
    overflow: auto;
}
.uim-gif-item {
    width: 46%;
    height: 150px;
    margin: 0 1% 1% 5px;
    background-size: cover;
    background-position: center;
}
.uim-gif-item-img {
    width: 100%;
}
</style>

<template>
    <div class="uim-gif-picker uim-popover">
        <div class="uim-popover-header">
            <div class="uim-popover-search">
                <div class="uim-popover-search-icon">
                    <span class="ion-ios-search"></span>
                </div>
                <input type="text"  placeholder="Search Gifs..." class="uim-popover-search-text">
            </div>
        </div>
        <div class="uim-popover-body uim-gif-list">
            <div class="uim-gif-item" v-for="img in list" :style="{ 'background-image': `url(${ img.src })` }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            state: {
                loading: false
            },
            list: [{
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }, {
                src: 'https://media.tenor.co/images/198e0db8be06871e6f1d23019a58f647/tenor.gif'
            }]
        }
    }
}
</script>
