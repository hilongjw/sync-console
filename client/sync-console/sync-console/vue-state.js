import { camelize } from '../utils'

function basename (filename) {
    return filename.replace(/\/.*\//, '')
}

let isLegacy = false
const propModes = ['default', 'sync', 'once']

function getInstanceName (instance) {
    const name = instance.$options.name || instance.$options._componentTag
    if (name) {
        return name
    }
    const file = instance.$options.__file // injected by vue-loader
    if (file) {
        return basename(file)
    }
    return instance.$root === instance ? 'Root' : 'Anonymous Component'
}

/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processProps (instance) {
    let props
    if (isLegacy && (props = instance._props)) {
        // 1.x
        return Object.keys(props).map(key => {
            const prop = props[key]
            const options = prop.options
            return {
                type: 'props',
                key: prop.path,
                value: instance[prop.path],
                meta: {
                    type: options.type ? getPropType(options.type) : 'any',
                    required: !!options.required,
                    mode: propModes[prop.mode]
                }
            }
        })
    } else if ((props = instance.$options.props)) {
        // 2.0
        const propsData = []
        for (let key in props) {
            const prop = props[key]
            key = camelize(key)
            propsData.push({
                type: 'props',
                key,
                value: instance[key],
                meta: {
                    type: prop.type ? getPropType(prop.type) : 'any',
                    required: !!prop.required
                }
            })
        }
        return propsData
    } else {
        return []
    }
}

/**
 * Convert prop type constructor to string.
 *
 * @param {Function} fn
 */

const fnTypeRE = /^(?:function|class) (\w+)/

function getPropType (type) {
    const match = type.toString().match(fnTypeRE)
    return typeof type === 'function' ? (match && match[1]) || 'any' : 'any'
}

/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processState (instance) {
    const props = isLegacy ? instance._props : instance.$options.props
    const getters =
        instance.$options.vuex &&
        instance.$options.vuex.getters
    return Object.keys(instance._data)
        .filter(key => (!(props && key in props) &&
            !(getters && key in getters)
        ))
        .map(key => ({
            key,
            value: instance._data[key]
        }))
}

/**
 * Process the computed properties of an instance.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processComputed (instance) {
    const computed = []
    const defs = instance.$options.computed || {}
        // use for...in here because if 'computed' is not defined
        // on component, computed properties will be placed in prototype
        // and Object.keys does not include
        // properties from object's prototype
    for (const key in defs) {
        const def = defs[key]
        const type = typeof def === 'function' && def.vuex ? 'vuex bindings' : 'computed'
            // use try ... catch here because some computed properties may
            // throw error during its evaluation
        let computedProp = null
        try {
            computedProp = {
                type,
                key,
                value: instance[key]
            }
        } catch (e) {
            computedProp = {
                type,
                key,
                value: '(error during evaluation)'
            }
        }

        computed.push(computedProp)
    }

    return computed
}

/**
 * Process possible vue-router $route context
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processRouteContext (instance) {
    const route = instance.$route
    if (route) {
        const { path, query, params } = route
        const value = { path, query, params }
        if (route.fullPath) value.fullPath = route.fullPath
        if (route.hash) value.hash = route.hash
        if (route.name) value.name = route.name
        if (route.meta) value.meta = route.meta
        return [{
            key: '$route',
            value
        }]
    } else {
        return []
    }
}

/**
 * Process Vuex getters.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processVuexGetters (instance) {
    const getters =
        instance.$options.vuex &&
        instance.$options.vuex.getters
    if (getters) {
        return Object.keys(getters).map(key => {
            return {
                type: 'vuex getters',
                key,
                value: instance[key]
            }
        })
    } else {
        return []
    }
}

/**
 * Process vue-rx observable bindings.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processObservables (instance) {
    var obs = instance.$observables
    if (obs) {
        return Object.keys(obs).map(key => {
            return {
                type: 'observables',
                key,
                value: instance[key]
            }
        })
    } else {
        return []
    }
}

/**
 * Get the detailed information of an inspected instance.
 *
 * @param {Number} id
 * fork form vue devtool https://github.com/vuejs/vue-devtools/blob/master/src/backend/index.js
 */

function getInstanceDetails (instance) {
    if (!instance) {
        return {}
    } else {
        const Vue = instance.constructor
        if (Vue && Vue.version) {
            isLegacy = Vue.version && Vue.version.split('.')[0] === '1'
        }
        return {
            id: instance._uid,
            _isVue: true,
            name: getInstanceName(instance),
            state: processProps(instance).concat(
                processState(instance),
                processComputed(instance),
                processRouteContext(instance),
                processVuexGetters(instance),
                processObservables(instance)
            )
        }
    }
}

export default function stringifyVue (key, val) {
    if (!val || !val._isVue) return val
    return getInstanceDetails(val)
}
