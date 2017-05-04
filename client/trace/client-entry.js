import './lib/polyfill'
import LogTracer from './tracer'

// const logTracer = new LogTracer({
//     el: '#ddd', // default window
//     clickCount: 5, // in 10s
//     maxLogCount: 50,
//     report: '',
//     socket: '/log',
//     Vue: Vue
// })

// eslint-disable-next-line
__webpack_require__.p = '/' //'http://192.168.18.39:8666/'

export default LogTracer
