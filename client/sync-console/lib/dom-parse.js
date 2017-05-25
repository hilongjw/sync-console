import { getType } from '../utils'
import listDiff from './list-diff'
import patch from './patch'

export const isDOM = /HTML([a-zA-Z]*)Element/i

export function getAttributes (dom) {
    let props = {}
    if (!dom || !dom.attributes) return props
    const attributes = dom.attributes
    for (let i = 0; i < attributes.length; i++) {
        props[attributes[i].nodeName] = attributes[i].nodeValue
    }
    return props
}

let globalIndex = 0
export function parseNode (dom, index = { i: 1 }) {
    const type = getType(dom)
    if (type === 'text') {
        return {
            key: dom.data,
            type: 'string',
            props: {},
            index: index.i++,
            content: dom.data
        }
    }
    if (type === 'comment') {
        return {
            key: dom.data,
            index: index.i++,
            is_SCONSOLE_DOM: true,
            type: type,
            props: {},
            children: [dom.data]
        }
    }
    if (!dom || !isDOM.test(type)) {
        return { type: type }
    }

    if (!dom.__sync_console_key__) dom.__sync_console_key__ = ++globalIndex

    const children = []

    for (let i = 0, len = dom.childNodes.length; i < len; i++) {
        children.push(parseNode(dom.childNodes[i], index))
    }

    return {
        key: dom.__sync_console_key__,
        index: index.i++,
        is_SCONSOLE_DOM: true,
        tag: dom.tagName.toLowerCase(),
        props: getAttributes(dom),
        children: children // [ /*<String>*/ /* <Node> */ ]
    }
}

function isIgnoreChildren (node) {
    return (node.props && node.props.hasOwnProperty('ignore'))
}

function treeWalker (newNode, oldNode, patches) {
    let currentPatch = []

    if (newNode === null) return

    if (oldNode.type === 'string' && newNode.type === 'string') {
        if (newNode.content !== oldNode.content) {
            currentPatch.push({ type: patch.TEXT, content: newNode.content })
        }
    } else if (oldNode.tag === newNode.tag && oldNode.key === newNode.key) {
        var propsPatches = diffProps(oldNode, newNode)
        if (propsPatches) {
            currentPatch.push({ type: patch.PROPS, props: propsPatches })
        }
        if (!isIgnoreChildren(newNode)) {
            diffChildren(
                oldNode.children,
                newNode.children,
                patches,
                currentPatch
            )
        }
    } else {
        currentPatch.push({ type: patch.REPLACE, node: newNode })
    }

    if (currentPatch.length) {
        patches[oldNode.index] = currentPatch
    }
}

function diffProps (oldNode, newNode) {
    var count = 0
    var oldProps = oldNode.props || {}
    var newProps = newNode.props || {}

    var key, value
    var propsPatches = {}

    for (key in oldProps) {
        value = oldProps[key]
        if (newProps[key] !== value) {
            count++
            propsPatches[key] = newProps[key]
        }
    }

    for (key in newProps) {
        value = newProps[key]
        if (!oldProps.hasOwnProperty(key)) {
            count++
            propsPatches[key] = newProps[key]
        }
    }

    if (count === 0) {
        return null
    }

    return propsPatches
}

function diffChildren (oldChildren = [], newChildren = [], patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
        currentPatch.push(reorderPatch)
    }

    oldChildren.map((child, i) => {
        treeWalker(newChildren[i], child, patches)
    })
}

export function diffElement (newTree, oldTree) {
    let patches = {}

    treeWalker(newTree, oldTree, patches)

    return patches
}

export function patchElement (node, patches) {
    patch(node, patches)
}
