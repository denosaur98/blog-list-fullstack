import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus, faMinus, faXmark, faPenToSquare, faComment, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faMinus, faXmark, faPenToSquare, faComment, faTrash, faUserCircle)

createApp(App).use(router).use(createPinia()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')