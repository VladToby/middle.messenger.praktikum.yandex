import Handlebars from 'handlebars';
import { registerComponent } from './core/RegistrationComponent';
import './style.less';

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

const navigator = (pageName: string) => {
    const Page = pages[pageName];
    if (Page) {
        const app = document.getElementById('app');
        if (app) {
            if (typeof Page === 'function') {
                const page = new Page({});
                const content = page.getContent();
                if (content) {
                    app.innerHTML = '';
                    app.appendChild(content);
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    navigator('MainPage');
});

document.addEventListener('click', (event) => {
    const target: HTMLElement = event.target as HTMLElement;
    const page = target.getAttribute('page');
    if (page) {
        navigator(page);

        event.preventDefault();
        event.stopImmediatePropagation();
    }
});

document.addEventListener('navigate', (event: Event) => {
    const customEvent = event as CustomEvent;
    const page = customEvent.detail.page;
    if (page) {
        navigator(page);
    }
});
