import Vue from 'vue'

// eslint-disable-next-line
const logTracer = new window.LogTracer.default({
    el: '#ddd', // default window
    clickCount: 5, // in 10s
    maxLogCount: 50,
    report: '',
    socket: '/log',
    Vue: Vue
})

console.log('app test')
