/*eslint-disable*/
/**
 *
 * fork from WechatFE vconsole util
 */

// Yanked from https://git.io/vS8DV re-used under CC0
// with some tiny modifications
export function isError (value) {
  switch ({}.toString.call(value)) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return value instanceof Error;
  }
}

/*
* getLocationHref
* @param
* @return  string
*/
export function getLocationHref() {
    if (typeof document === 'undefined' || typeof document.location === 'undefined')
        return '';

    return document.location.href;
}

/*
* getParams 
* rewrite
* http://stackoverflow.com/questions/10126956/capture-value-out-of-query-string-with-regex
*/
export function getParams (str, mutli) {
   var queryString = str || window.location.search || '';
   var keyValPairs = [];
   var params      = {};
   queryString     = queryString.replace(/.*?\?/,"");

   if (queryString.length)
   {
      keyValPairs = queryString.split('&');
      for (let pairNum in keyValPairs)
      {
         var key = keyValPairs[pairNum].split('=')[0];
         if (!key.length) continue;
         if (mutli) {
            if (typeof params[key] === 'undefined') params[key] = [];
            params[key].push(keyValPairs[pairNum].split('=')[1]);
         } else {
            params[key] = keyValPairs[pairNum].split('=')[1]
         }
      }
   }
   return params;
}
/**
 * pad num
 * @param  int  num
 * @return  string
 */
export function pad (num) {
  if (num < 10) return '0' + num
  return num
}

/**
 * get formatted date by timestamp
 * @param  int    time
 * @return  object
 */
export function getDate (time) {
    const d = time > 0 ? new Date(time) : new Date()
    const day = pad(d.getDate())
    const month = pad(d.getMonth() + 1)
    const year = pad(d.getFullYear())
    const hour = pad(d.getHours())
    const minute = pad(d.getMinutes())
    const second = pad(d.getSeconds())
    let millisecond = pad(d.getMilliseconds())
    if (millisecond < 100) {
      millisecond = '0' + millisecond
    }

    return {
        time: (+d),
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond
    }
}

/*
* formart date
*/
export function formatTime (time) {
  const date = getDate(time)
  return date.year + '-' + date.month + '-' + date.day + ' ' + date.hour + ':' + date.minute + ':' + date.second
}

/**
 * determines whether the passed value is a specific type
 * @param mixed value
 * @return boolean
 */
export function isNumber(value) {
    return Object.prototype.toString.call(value) == '[object Number]';
}
export function isString(value) {
    return Object.prototype.toString.call(value) == '[object String]';
}
export function isArray(value) {
    return Object.prototype.toString.call(value) == '[object Array]';
}
export function isBoolean(value) {
    return Object.prototype.toString.call(value) == '[object Boolean]';
}
export function isUndefined(value) {
    return Object.prototype.toString.call(value) == '[object Undefined]';
}
export function isNull(value) {
    return Object.prototype.toString.call(value) == '[object Null]';
}
export function isSymbol(value) {
    return Object.prototype.toString.call(value) == '[object Symbol]';
}
export function isObject(value) {
    return (
        Object.prototype.toString.call(value) == '[object Object]' ||
        // if it isn't a primitive value, then it is a common object
        (!isNumber(value) &&
            !isString(value) &&
            !isBoolean(value) &&
            !isArray(value) &&
            !isNull(value) &&
            !isFunction(value) &&
            !isUndefined(value) &&
            !isSymbol(value)
        )
    );
}
export function isFunction(value) {
    return Object.prototype.toString.call(value) == '[object Function]';
}
export function isElement(value) {
    return (
        typeof HTMLElement === 'object' ? value instanceof HTMLElement : //DOM2
        value && typeof value === "object" && value !== null && value.nodeType === 1 && typeof value.nodeName === "string"
    );
}

/**
 * HTML encode a string
 * @param string text
 * @return string
 */
// export function htmlEncode(text) {
//     return document.createElement('a').appendChild(document.createTextNode(text)).parentNode.innerHTML;
// }

/**
 * get an object's all keys ignore whether they are not enumerable
 */
export function getObjAllKeys(obj) {
    if (!isObject(obj) && !isArray(obj)) {
        return [];
    }
    let dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    let keys = [];
    for (let key in obj) {
        if (dontEnums.indexOf(key) < 0) {
            keys.push(key);
        }
    }
    keys = keys.sort();
    return keys;
}

/**
 * get an object's prototype name
 */
export function getObjName(obj) {
    return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '');
}

/*
 * Returns the type of the argument
 * @param {Any}    val    Value to be tested
 * @returns    {String}    type name for argument
 */

// string
// number
// boolean
// array
// object
// null
// undefined
// function
// date
// regexp
// error
export function getType(val) {
    if (typeof val === 'undefined') return 'undefined'
    if (typeof val === 'object' && !val) return 'null'
    return ({}).toString.call(val).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

const debugFlag = /__logtracer=/
export function checkFlag() {
    const str = window.location.search || ''
    return debugFlag.test(str)
}

export function getUniqueId() {
    let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0
        let v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
    return id
}

/**
 * localStorage methods
 */
export function setStorage (key, value) {
    if (!window.localStorage) return false
    key = '__SyncConsole_' + key
    let status = true
    try {
        localStorage.setItem(key, value)
    } catch (e) {
        console.debug(e)
        status = false
    }
    return status
}

export function getStorage (key) {
    if (!window.localStorage) return
    key = '__SyncConsole_' + key
    return localStorage.getItem(key)
}
