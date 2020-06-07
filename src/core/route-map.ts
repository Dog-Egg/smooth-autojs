interface Routes {
    [name: string]: number[]
}

class RouteMap<T> {
    private readonly _nodes: T[]
    private readonly _routes: Routes
    private _currentRoute: string = 'init'
    private _routePointer: number = -1

    static stop = new Error('No next')

    constructor(nodes: T[], routes?: Routes) {
        if (!routes) {
            routes = {[this._currentRoute]: nodes.map((_, index) => index)}
        }
        this._routes = routes
        this._nodes = nodes
    }

    get _route() {
        return this._routes[this._currentRoute]
    }

    switchTo(name: string) {
        const nodePointer = this._route[this._routePointer]
        this._currentRoute = name
        const routePointer = this._route.indexOf(nodePointer)
        this._routePointer = routePointer > -1 ? routePointer : 0
    }

    next(): T {
        const nodePointer = this._route[this._routePointer + 1]
        if (nodePointer === undefined || nodePointer < 0 || nodePointer >= this._nodes.length) {
            throw RouteMap.stop
        } else {
            this._routePointer = this._route.indexOf(nodePointer)
            return this._nodes[nodePointer]
        }
    }
}

export default RouteMap
