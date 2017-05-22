<style>
.rd-console-dom-view-block {
    padding-left: 10px;
}
.rd-console-dom-v-tag-name {
    color: #9C27B0;
}
.rd-console-dom-v-attr-key {
    color: #FF9800;
}
.rd-console-dom-v-attr-val {
    color: #03A9F4;
}
.rd-console-dom-v-attr-gray {
    color: #03A9F4;
}
.rd-console-dom-v-comment {
    color: #5b8827;
}
</style>

<!-- <template>
    <div class="rd-console-dom-view">
        <div class="rd-console-dom-view-block">
            
        </div>
    </div>
</template> -->

<script>
function renderAttrs (h, node) {
    if (!node || !node.attrs || !node.attrs.length) return ''
    return node.attrs.map(item => {
        return <span>
        {' '}<span class="rd-console-dom-v-attr-key">{item.key}</span>
        {'="'}
        <span class="rd-console-dom-v-attr-val">{ item.val }</span>
        {'"'}
        </span>
    })
}

function renderTag (h, node, fold) {
    if (typeof node === 'string') return node
    if (node.type && node.type === 'comment') return <span class="rd-console-dom-v-comment">{`<!-- ${node.children} -->`}</span>

    const startTag = <span class="rd-console-dom-v-tag-name">
        { '<' + node.tag }{renderAttrs(h, node)}{ '>' }
    </span>

    const endTag = <span class="rd-console-dom-v-tag-name">
        { '</' + node.tag + '>' }
    </span>

    let children

    if (!fold) {
        if (node.children && node.children.length) {
            children = node.children.map(c => {
                return h(DOMViewer, {
                    props: {
                        data: c
                    }
                })
            })
        }
    } else {
        if (node.children && node.children.length) {
            children = '...'
        }
    }

    return [startTag, children, endTag]
}

const DOMViewer = {
    props: ['data'],
    data () {
        return {
            fold: true
        }
    },
    render (h) {
        return <div class="rd-console-dom-view" onClick={ this.toggle }>
            <div class="rd-console-dom-view-block">
                { renderTag(h, this.data, this.fold) }
            </div>
        </div>
    },
    methods: {
        toggle (e) {
            e.stopPropagation()
            this.fold = !this.fold
        }
    }
}

export default DOMViewer
</script>
