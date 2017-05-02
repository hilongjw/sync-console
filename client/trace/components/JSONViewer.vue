<style>
.json-view {
    color: #333;
}
.json-view-children .json-view {
    display: block;
}
.json-view-val .json-view {
    display: inline;
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
import getType from '../lib/get-type' 

function simpleRender (h, val, cls, key) {
    if (key) {
        return <span class="json-view">
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
            break
        case 'number':
            return simpleRender(h, val, 'json-view-val-number', key)
            break
        case 'boolean':
            return simpleRender(h, val.toString(), 'json-view-val-object', key)
            break
        case 'date':
            return simpleRender(h, val.toString(), 'json-view-val', key)
            break
        case 'error':
            let msg = val.stack || val.toString()
            return simpleRender(h, msg, 'json-view-val json-view-val-red', key)
            break
        case 'regexp':
            return simpleRender(h, val.toString(), 'json-view-val-object', key)
            break
        case 'function':
            return simpleRender(h, val.toString(), '', key)
            break
        case 'undefined':
            return simpleRender(h, 'undefined', 'json-view-val json-view-val-undefined', key)
            break
        case 'null':
            return simpleRender(h, 'null', 'json-view-val json-view-val-object', key)
            break
        case 'array':
            return simpleRender(h, h(JSONViewer, { props: { data: val, name: key }}), 'json-view-val', key)
            break
        case 'object':
            return simpleRender(h, h(JSONViewer, { props: { data: val, name: key }}), 'json-view-val', key)
            break
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
        let type
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
            default:
                break;
        }

        if (this.show) {
            childNodes = []
            for (let key in this.data) {
                childNodes.push(renderVal(h, this.data[key], key))
            }
        }

        return <div class={{ 'json-view': true, 'light': this.light }} onClick={ this.toggle }>
            { dataType }
            <div>
                <div class="json-view-children">
                { childNodes }
                </div>
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