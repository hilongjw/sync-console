<style>
.json-view {
    color: #333;
    word-break: break-all;
}
.json-view-children .json-view {
    display: block;
}
.json-view-val .json-view {
    display: inline;
}
.json-view .json-view-simple {
    display: block;
}
.json-view.light .json-view {
    background: none;
    color: #fff;
}
.json-view.light {
    background: none;
    color: #fff;
}
.json-view-children {
    margin-left: 20px;
}
.json-view-inline {
     display: flex;
}
.json-view-key {
    color: #9C27B0;
    flex-shrink: 0;
}
.json-view-split {
    margin-right: 6px;
    margin-left: 2px;
}
.json-view-val-number {
    color: #3F51B5;
}
.json-view-val-array {
    color: #3F51B5;
}
.json-view-val-object {
    color: #a927b0;
}
.json-view-val-red {
    color: #E91E63;
}
.json-view-val-undefined {
    color: #9E9E9E;
}
</style>

<script>
import DOMViewer from './DOMViewer.vue'
import { getType } from '../utils/'

function simpleRender (h, val, cls, key) {
    if (key) {
        return <span class="json-view json-view-simple">
            <span class="json-view-key">{ key }</span>
            <span class="json-view-split">:</span>
            <span class={ cls }> {val } </span>
        </span>
    } else {
        return <span class={ 'json-view ' + cls }> {val } </span>
    }
}

function renderVal (h, val, key) {
    const type = getType(val)

    switch (type) {
    case 'string':
        return simpleRender(h, val, 'json-view-val-string', key)
    case 'number':
        return simpleRender(h, val, 'json-view-val-number', key)
    case 'boolean':
        return simpleRender(h, val.toString(), 'json-view-val-object', key)
    case 'date':
        return simpleRender(h, val.toString(), 'json-view-val', key)
    case 'error':
        let msg = val.stack || val.toString()
        return simpleRender(h, msg, 'json-view-val json-view-val-red', key)
    case 'regexp':
        return simpleRender(h, val.toString(), 'json-view-val-object', key)
    case 'function':
        return simpleRender(h, val.toString(), '', key)
    case 'undefined':
        return simpleRender(h, 'undefined', 'json-view-val json-view-val-undefined', key)
    case 'null':
        return simpleRender(h, 'null', 'json-view-val json-view-val-object', key)
    case 'array':
        return simpleRender(h, h(JSONViewer, {props: { data: val, name: key }}), 'json-view-val', key)
    case 'object':
        return simpleRender(h, h(JSONViewer, {props: { data: val, name: key }}), 'json-view-val', key)
    }
}

const JSONViewer = {
    props: ['data', 'name', 'light'],
    data () {
        return {
            show: false
        }
    },
    render (h) {
        let dataType = getType(this.data)

        if (this.data && this.data.is_SCONSOLE_DOM) {
            return h(DOMViewer, {
                props: {
                    data: this.data
                }
            })
        }

        let childNodes

        if (dataType === 'array') {
            dataType = [<span class="json-view-val-array">Array</span>, <span> { `(${this.data.length})`} </span>]
        }

        if (dataType === 'object') {
            dataType = [<span class="json-view-val-object">Object</span>]
        }

        switch (dataType) {
        case 'string':
            return renderVal(h, this.data)
        case 'number':
            return renderVal(h, this.data)
        case 'boolean':
            return renderVal(h, this.data)
        case 'date':
            return renderVal(h, this.data)
        case 'error':
            return renderVal(h, this.data)
        case 'regexp':
            return renderVal(h, this.data)
        }

        if (this.show) {
            childNodes = []
            for (let key in this.data) {
                childNodes.push(renderVal(h, this.data[key], key))
            }
            if (!childNodes.length) childNodes = JSON.stringify(this.data)
        }

        return <div class={{ 'json-view': true, 'light': this.light }} onClick={ this.toggle }>
            <i>{ dataType }</i>
            <div class="json-view-children">
            { childNodes }
            </div>
        </div>
    },
    methods: {
        toggle (e) {
            e.stopPropagation()
            this.show = !this.show
        }
    }
}

export default JSONViewer
</script>
