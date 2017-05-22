import { getType } from '../utils'
export const isDOM = /HTML([a-zA-Z]*)Element/i

export function getAttributes (dom) {
    const attrs = []
    if (!dom || !dom.attributes) return attrs
    const attributes = dom.attributes
    for (let i = 0; i < attributes.length; i++) {
        attrs.push({
            key: attributes[i].nodeName,
            val: attributes[i].nodeValue
        })
    }
    return attrs
}

export function parseNode (dom) {
    const type = getType(dom)
    if (type === 'text') return dom.data
    if (type === 'comment') {
        return {
            is_SCONSOLE_DOM: true,
            type: type,
            attrs: [],
            children: [dom.data]
        }
    }
    if (!dom || !isDOM.test(type)) {
        return { type: type }
    }
    const children = []

    for (let i = 0, len = dom.childNodes.length; i < len; i++) {
        children.push(parseNode(dom.childNodes[i]))
    }

    return {
        is_SCONSOLE_DOM: true,
        tag: dom.tagName.toLowerCase(),
        attrs: getAttributes(dom),
        children: children // [ /*<String>*/ /* <Node> */ ]
    }
}
