<template>
    <div>
        <div>
            <div v-for="client in clientList" @click="choose(client)">
                {{ client }}
            </div>
        </div>
        <input type="text" v-model="code" @keyup.enter="fire">
        <button @click="fire">OK</button>
    </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'

const client = io.connect('http://localhost:8666/log')

export default {
    data () {
        return {
            clientList: [],
            code: '',
            target: ''
        }
    },
    mounted () {
        this.queryClient()
    },
    methods: {
        queryClient () {
            axios({
                url: '/clients'
            })
            .then(res => {
                this.clientList = res.data
            })
        },
        choose (client) {
            this.target = client
        },
        fire () {
            client.emit('run-code', {
                target: this.target,
                code: this.code
            })
            this.code = ''
        }
    }
}
</script>