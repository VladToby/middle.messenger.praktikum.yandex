import Route from './Route';
import { BlockType } from './Block';

class Router {
    static __instance: Router | undefined;

    protected _routes: Route[] = [];
    protected _history: History = window.history;
    protected _currentRoute: Route | null = null;
    protected _rootQuery: string = '';

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._rootQuery = rootQuery;

        Router.__instance = this;

        window.addEventListener('popstate', this._onPopState.bind(this));
    }

    use(pathname: string, block: BlockType) {
        const route: Route = new Route(pathname, block, {rootQuery: this._rootQuery});
        this._routes.push(route);

        return this;
    }

    start() {
        window.onpopstate = (event) => {
            const window = event.currentTarget as Window;
            if (window) {
                this._onRoute(window.location.pathname);
            }
        };

        this._onRoute(window.location.pathname);
    }

    private _onPopState = () => {
        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (!route) {
            return;
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    go(pathname: string) {
        this._history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        this._history.back();
    }

    forward() {
        this._history.forward();
    }

    getRoute(pathname: string) {
        return this._routes.find(route => route.match(pathname));
    }

    getCurrentRoute() {
        return this._currentRoute;
    }
}

export default Router;
