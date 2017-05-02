<style>
.uim-user {
    position: relative;
    display: flex;
    box-sizing: border-box;
    cursor: pointer;
    padding: 5px;
}
.uim-user-content {
}
.uim-user-name {
    color: #fff;
    font-size: 16px;
    line-height: 1.2em;
}
.uim-user-intro {
    color: hsla(0,0%,100%,.8);
    font-size: 13px;
    line-height: 1.1em;
}
.uim-user-status {
    background: #b5ff5e;
    height: 6px;
    width: 6px;
    position: absolute;
    bottom: 4px;
    right: 0px;
    border-radius: 50%;
    border: 2px solid #1f8ceb;
}
.uim-user-avatar {
    position: relative;
    flex-shrink: 0;
    margin-right: 10px;
}
.uim-user-avatar img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
}
</style>

<template>
    <div class="uim-user">
        <div class="uim-user-avatar">
            <img :src="user.avatar" class="uim-conversation-item-avatar">
            <div v-if="status" class="uim-user-status"></div>
        </div>
        <div class="uim-user-content" v-if="name">
            <div class="uim-user-name">
                {{ user.username }}
            </div>
            <div class="uim-user-intro">
                {{ user.intro }}
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: Object,
        status: Boolean,
        name: Boolean
    }
}
</script>