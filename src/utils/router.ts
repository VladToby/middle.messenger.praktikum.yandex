import Router from "../core/Router";

const router = new Router('#app');

const start = () => {
    router.start();
}

const goToLogin = () => {
    router.go('/login');
}

const goToRegister = () => {
    router.go('/signup');
}

const goToMessenger = () => {
    router.go('/messenger');
}

const goToSettings = () => {
    router.go('/settings');
}

const goToPasswordEdit = () => {
    router.go('/settings/edit-password');
}

const goToError404 = () => {
    router.go('/404');
}

const goToError500 = () => {
    router.go('/500');
}

export {
    router,
    start,
    goToLogin,
    goToRegister,
    goToMessenger,
    goToSettings,
    goToPasswordEdit,
    goToError404,
    goToError500
};
