import './lib/polyfill'
import syncConsoleManager from './console-manager'

// const logTracer = new LogTracer({
//     el: '#ddd', // default window
//     clickCount: 5, // in 10s
//     maxLogCount: 50,
//     report: '',
//     socket: '/log',
//     Vue: Vue
// })

// eslint-disable-next-line
__webpack_require__.p = '/' // 'http://covteam.u.qiniudn.com/'

export default syncConsoleManager
