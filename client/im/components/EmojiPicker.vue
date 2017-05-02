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
.emoji-picker {
    right: calc(50% - 50px);
}
.emoji-picker::after {
    content: ' ';
    position: absolute;
    bottom: -8px;
    right: 43px;
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
.emoji-list {
    padding-top: 5px;
    height: 220px;
    overflow: auto;
}
.emoji-item {
    font-size: 25px;
    height: 28px;
    margin: 0 1% 1% 2px;
}
.emoji-group {
    text-align: left;
    padding: 0 15px;
}
.emoji-group-name {
    color: #b8c3ca;
    font-weight: 400;
    font-size: 13px;
    margin: 5px;
    text-align: left;
}
</style>

<template>
    <div class="emoji-picker uim-popover">
        <div class="uim-popover-header">
            <div class="uim-popover-search">
                <div class="uim-popover-search-icon">
                    <span class="ion-ios-search"></span>
                </div>
                <input type="text" v-model="search" placeholder="Search Emojis..." class="uim-popover-search-text">
            </div>
        </div>
        <div class="uim-popover-body emoji-list">
            <div class="emoji-group" v-for="group in results">
                <div class="emoji-group-name">{{ group.name }}</div>
                <span class="emoji-item" v-for="emoji in group.list">
                {{ emoji.value }}
                </span>
            </div>
            
        </div>
    </div>
</template>

<script>
import emojis from '../lib/emoji'

export default {
    data () {
        return {
            state: {
                loading: false
            },
            search: '',
            groups: emojis
        }
    },
    computed: {
        results () {
            if (!this.search) return this.groups

            let newGroups = []
            let newGroup = {
                name: '',
                list: []
            }
            const reg = new RegExp(this.search, 'i')
            this.groups.map(group => {
                group.list.map(emoji => {
                    if (reg.test(emoji.title)) {
                        newGroup.list.push(emoji)
                    }
                })
                
            })
            newGroups.push(newGroup)
            return newGroups
        }
    },
    mounted () {
        this.focusInput()
    },
    methods: {
        focusInput () {
            const text = this.$el.querySelector('input')
            text && text.focus && text.focus()
        }
    }
}
</script>
