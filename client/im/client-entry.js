// import { app } from './app'

// const el = document.createElement('div')
// document.body.appendChild(el)

// app.$mount(el)
import Vue from 'vue'

// eslint-disable-next-line
const logTracer = new window.LogTracer({
    el: '#ddd', // default window
    clickCount: 5, // in 10s
    maxLogCount: 50,
    report: '',
    socket: '/log',
    Vue: Vue
})
