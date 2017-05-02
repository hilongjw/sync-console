import VueRouter from 'vue-router'
import Vue from 'vue'
import Summary from '../views/Summary.vue'
import Conversation from '../views/Conversation.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/summary',
        name: 'summary',
        component: Summary
    },
    {
        path: '/conversation',
        name: 'conversation',
        component: Conversation
    },
    {
        path: '*',
        redirect: '/summary'
    }
]

const router = new VueRouter({
    routes
})

export default router
