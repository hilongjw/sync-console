var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch (node, patches) {
    dfsWalk(node, patches)
    return node
}

function dfsWalk (node, patches) {
    let currentPatches = patches[node.index]

    let len = node.children ? node.children.length : 0
    for (let i = 0; i < len; i++) {
        let child = node.children[i]
        dfsWalk(child, patches)
    }

    if (currentPatches) {
        applyPatches(node, currentPatches)
    }
}

function applyPatches (node, currentPatches) {
    currentPatches.map(currentPatch => {
        switch (currentPatch.type) {
        case REPLACE:
            node = currentPatch.node
            break
        case REORDER:
            reorderChildren(node, currentPatch.moves)
            break
        case PROPS:
            setProps(node, currentPatch.props)
            break
        case TEXT:
            node.content = currentPatch.content
            break
        default:
            throw new Error('Unknown patch type ' + currentPatch.type)
        }
    })
}

function setProps (node, propsPatches) {
    let key
    for (key in propsPatches) {
        if (propsPatches[key] === undefined) {
            delete node.props[key]
        } else {
            node.props[key] = propsPatches[key]
        }
    }
}

function reorderChildren (node, moves) {
    moves.forEach(move => {
        if (!node.children) return
        if (move.type === 0) {
            node.children.splice(move.index, 1)
        } else {
            node.children.splice(move.index, 0, move.item)
        }
    })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

module.exports = patch
