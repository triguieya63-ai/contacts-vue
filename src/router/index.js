import { createRouter, createWebHashHistory } from 'vue-router'
import ListeContacts from '../views/ListeContacts.vue'
import DetailContact from '../views/DetailContact.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'liste', component: ListeContacts },
    { path: '/contact/nouveau', name: 'ajout', component: DetailContact },
    { path: '/contact/:id', name: 'detail', component: DetailContact, props: true },
  ],
})