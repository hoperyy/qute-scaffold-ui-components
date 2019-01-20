// import Button from './components/Button/index.js'

const install = function (Vue) {
    if (install.installed) {
        return
    }

    // Vue.component(Button.name, Button)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const version = '1.0.0'

export {
    install,
    version,
    // Button,
}
