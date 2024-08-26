import Handlebars from 'handlebars';
import { registerComponent } from './core/RegistrationComponent';
import {goToMessenger, goToLogin, router} from "./utils/router";
import { BlockType } from "./core/Block";
import './style.less';
import AuthController from './controllers/AuthController';
import './utils/helpers';
import Store from "./core/Store";
import ChatController from "./controllers/ChatController";

type ImportValue = Record<string, string>;
type ImportGlob = Record<string, ImportValue>;

const importComponents: ImportGlob = import.meta.glob('./components/**/*.ts', { eager: true });
const importPages: ImportGlob = import.meta.glob('./pages/**/*.ts', { eager: true });

const loadImport = (importGlob: ImportGlob): ImportValue => {
    const result: ImportValue = {};
    Object.keys(importGlob).forEach((path: string) => {
        Object.keys(importGlob[path]).forEach((name: string) => {
            result[name] = importGlob[path][name];
        });
    });
    return result;
};

const pages: ImportValue = loadImport(importPages);
const components: ImportValue = loadImport(importComponents);

const registerImports = (imports: ImportValue) => {
    Object.keys(imports).forEach((name:string) => {
        const value: string = imports[name];
        if (typeof value === 'string') {
            Handlebars.registerPartial(name, value);
        } else {
            registerComponent(name, value);
        }
    });
};

registerImports(components);
registerImports(pages);

async function initApp() {
    router
        .use('/', pages.LoginPage as unknown as BlockType)
        .use('/login', pages.LoginPage as unknown as BlockType)
        .use('/signup', pages.RegistrationPage as unknown as BlockType)
        .use('/messenger', pages.ChatPage as unknown as BlockType)
        .use('/settings', pages.ProfilePage as unknown as BlockType)
        .use('/settings/edit-password', pages.ProfileEditPasswordPage as unknown as BlockType)
        .use('/404', pages.Error404Page as unknown as BlockType)
        .use('/500', pages.Error500Page as unknown as BlockType)
        .start();

    try {
        const user = await AuthController.getUser();
        if (user) {
            const currentRoute = router.getCurrentRoute();
            if (currentRoute && (
                currentRoute.match('/'))
                || currentRoute?.match('/login')
                || currentRoute?.match('/signup')
            ) {
                goToMessenger();
            }
        } else {
            goToLogin();
        }
    } catch (e) {
        console.error('Error during app initialization:', e);
        goToLogin();
    }

    const chats = await ChatController.getChats();
    Store.set({chats});
}

document.addEventListener('DOMContentLoaded', () => initApp());
