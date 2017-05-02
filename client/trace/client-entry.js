import { app } from './app'

const el = document.createElement('div')
document.body.appendChild(el)

console.log('will mount')

app.$mount(el)

console.log('mounted', [1,2,3, {a: [{ a: 1}]}])