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

export default function getType (val) {
    if (typeof val === 'undefined') return 'undefined';
    if (typeof val === 'object' && !val) return 'null';
    return ({}).toString.call(val).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
