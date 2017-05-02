<style>
.uim-summary-item {
    display: flex;
    padding: 32px 30px;
    border-top: 1px solid #f3f4f5;
    position: relative;
    cursor: pointer;
}
.uim-summary-item-avatar img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
}
.uim-summary-item:hover {
    background: #fbfbfb;
}
.uim-summary-item:last-child {
    border-bottom: 1px solid #f3f4f5;
}
.uim-summary-item-body {
    width: 100%;
    padding-left: 10px;
}
.uim-summary-item-content {
    position: relative;
}
.uim-summary-item-meta {
    position: relative;
}
.uim-summary-item-content-icon {
    position: absolute;
    right: 0;
    top: 0;
    color: #dadada;
}
.uim-summary-item-user {
    font-size: 13px;
    color: rgba(73,76,93,.7);
    text-overflow: ellipsis;
    white-space: nowrap;
}
.uim-summary-content-text {
    font-size: 13px;
}
.uim-summary-item-time {
    position: absolute;
    color: rgba(73,76,93,.7);
    right: 0;
    top: 0;
    font-size: 13px;
}
</style>

<template>
    <div class="uim-summary-item" @click="touch">
        <div class="uim-summary-item-avatar">
            <img :src="data.interlocutor.avatar" class="uim-summary-item-avatar">
        </div>
        <div class="uim-summary-item-body">
            <div class="uim-summary-item-meta">
                <span class="uim-summary-item-user">
                    {{ data.interlocutor.username }}
                </span>
                <span class="uim-summary-item-time">
                    {{ data.lastMessage.createdAt }}
                </span>
            </div>
            <div class="uim-summary-item-content">
                <div class="uim-summary-item-content-body">
                    <span class="uim-summary-item-user">
                       you : 
                    </span>
                    <span class="uim-summary-content-text">
                        {{ data.lastMessage.message }}
                    </span>
                    <span class="uim-summary-item-content-icon ion-chatboxes"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: Object
    },
    methods: {
        touch () {
            this.$router.push({ name: 'conversation' })
        }
    }
}
</script>