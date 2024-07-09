import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import '../style.less';

const pages = {
    'mainPage': [Pages.MainPage],
    'loginPage': [Pages.LoginForm],
}

Object.entries(Components).forEach(([ name, component ]) => {
    Handlebars.registerPartial(name, component);
});

const navigator = (page) => {
    const [src, args] = pages[page];
    const handlebars = Handlebars.compile(src);
    document.getElementById('app').innerHTML = handlebars(args);
}

document.addEventListener('DOMContentLoaded', (e) => {
    const path = e.target.location.pathname;

    switch (path) {
        case '/main-page': {
            navigator('mainPage');
            break;
        }

        case '/login': {
            navigator('loginPage');
            break;
        }

        default: {
            window.location.pathname = '/main-page';
            break;
        }
    }
});


document.addEventListener('click', (event) => {
    const page = event.target.getAttribute('page');

    if (page) {
        navigator(page);

        event.preventDefault();
        event.stopImmediatePropagation();
    }
});