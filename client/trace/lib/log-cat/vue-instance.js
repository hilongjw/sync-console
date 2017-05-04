function basename (filename) {
    return filename.replace(/\/.*\//, '')
}

function processState (instance) {
    return instance._data
}

function processRouteContext (instance) {
    const route = instance.$route
    if (route) {
        const { path, query, params } = route
        const value = { path, query, params }
        if (route.fullPath) value.fullPath = route.fullPath
        if (route.hash) value.hash = route.hash
        if (route.name) value.name = route.name
        if (route.meta) value.meta = route.meta
        return value
    }
}

function getInstanceName (instance) {
  const name = instance.$options.name || instance.$options._componentTag
  if (name) {
    return name
  }
  const file = instance.$options.__file // injected by vue-loader
  if (file) {
    return basename(file)
  }
  return instance.$root === instance
    ? 'Root'
    : 'Anonymous Component'
}

export default function stringifyVue (key, val) {
    if (!val || !val._isVue) return val
    return {
        name: `[Vue instance] <${getInstanceName(val)}> `,
        state: processState(val),
        $route: processRouteContext(val)
    }
}