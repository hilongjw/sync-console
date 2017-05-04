import './lib/polyfill'
import Promise from 'promise-polyfill'
import LogTracer from './tracer'

if (!window.Promise) {
    window.Promise = Promise
}

// const logTracer = new LogTracer({
//     el: '#ddd', // default window
//     clickCount: 5, // in 10s
//     maxLogCount: 50,
//     report: '',
//     socket: '/log',
//     Vue: Vue
// })

export default LogTracer
