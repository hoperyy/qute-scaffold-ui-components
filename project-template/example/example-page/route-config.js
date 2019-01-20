
            /**
             * This file is created by "npm run build:example-route"
            */

            import Index from './Index.vue'
            import Button from '../Button.vue'

            export default {
                routes: [
                    {
                        path: '/',
                        name: 'Index',
                        component: Index
                    },
                    {
                        path: '/quickstart',
                        redirect: '/'
                    },
                    
                {
                    path: '/button',
                    name: 'Button',
                    component: Button
                },
                ]
            }