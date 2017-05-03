import VueRouter from 'vue-router'
import Vue from 'vue'
import Console from '../views/Console.vue'
import History from '../views/History.vue'
import Application from '../views/Application.vue'
import Report from '../views/Report.vue'
import SystemView from '../views/System.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/console',
        name: 'console',
        component: Console
    }, {
        path: '/history',
        name: 'history',
        component: History
    }, {
        path: '/application',
        name: 'application',
        component: Application
    }, {
        path: '/report',
        name: 'report',
        component: Report
    }, {
        path: '/system',
        name: 'system',
        component: SystemView
    }
]

const router = new VueRouter({
    mode: 'abstract',
    routes
})

export default router
