import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.ts.vue';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

createApp(App)
    .use(createPinia())
    .use(vuetify)
    .mount('#app');