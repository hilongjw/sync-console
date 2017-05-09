/*eslint-disable*/
import objectAssign from 'object-assign'
import Promise from 'promise-polyfill'

if (!window.Promise) {
    window.Promise = Promise
}

if (!Object.assign) {
    Object.assign = objectAssign
}

// Array.map polyfill
if (!Array.prototype.map) {
    Array.prototype.map = function (fn) {
        var rv = []

        for (var i = 0, l = this.length; i < l; i++)
            rv.push(fn(this[i]));

        return rv
    }
}

// Array.filter polyfill
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fn) {
        var rv = []

        for (var i = 0, l = this.length; i < l; i++)
            if (fn(this[i])) rv.push(this[i])

        return rv
    }
}



