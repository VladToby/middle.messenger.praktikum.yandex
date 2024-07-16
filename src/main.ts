import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';
import './style.less';

const pages = {
    'mainPage': [Pages.MainPage],
    'loginPage': [Pages.LoginForm],
    'registrationPage': [Pages.RegistrationForm],
    'chatPage': [Pages.ChatPage],
    'profilePage': [Pages.ProfilePage],
    'profileEditPage': [Pages.ProfileEditPage],
    'profileEditPasswordPage': [Pages.ProfileEditPasswordPage],
    'error404': [Pages.Error404Page],
    'error500': [Pages.Error500Page]
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

        case '/registration': {
            navigator('registrationPage');
            break;
        }

        case '/chat': {
            navigator('chatPage');
            break;
        }

        case '/profile': {
            navigator('profilePage');
            break;
        }

        case '/profile-edit': {
            navigator('profileEditPage');
            break;
        }

        case '/profile-edit-password': {
            navigator('profileEditPasswordPage');
            break;
        }

        case '/error404': {
            navigator('error404');
            break;
        }

        case '/error500': {
            navigator('error500');
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
