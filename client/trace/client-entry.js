// import { app } from './app'
// import Vue from 'vue'
import LogTracer from './tracer'

// const logTracer = new LogTracer({
//     el: '#ddd', // default window
//     clickCount: 5, // in 10s
//     maxLogCount: 50,
//     report: '',
//     socket: '/log',
//     Vue: Vue
// })

window.LogTracer = LogTracer

export default LogTracer
