import './lib/polyfill'
import SyncConsoleManager from './console-manager'

/*!
 * SyncConsole
 * (c) 2017 Luojilab
 */

/*eslint-disable*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.SyncConsoleManager = factory())
}(this, (function () {
    return SyncConsoleManager
})))

// eslint-disable-next-line
__webpack_require__.p = 'http://sync.bood.in/'

