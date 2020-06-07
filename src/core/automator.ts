import {Action, Location, LocationName} from "./action";

class CompletedError extends Error {
}

class Automator {
    private readonly actions: Action[]
    private completed: boolean = false
    private pointer: number = 0

    constructor(actions: Action[]) {
        this.actions = actions
    }

    next() {
        if (this.completed) {
            throw new CompletedError()
        }

        let action = this.actions[this.pointer]
        if (!action) {
            this.complete(true)
        }

        // check start location
        if (!Automator.checkLocation("start", action)) {
            action = this.calibrate()
        }

        // execute
        let result
        try {
            result = action.do()
        } catch (e) {
            if (e instanceof CompletedError) {
                throw e
            } else {
                action.errorback && action.errorback(e)
            }
            return
        }

        // check end location
        const t = Date.now()
        const waitingTime = action.waitingTime || 1500
        while (true) {
            if (Automator.checkLocation('end', action)) {
                break
            }

            if (Date.now() - t > waitingTime) {
                return
            }

            sleep(300)
        }

        // success
        action.callback && action.callback(result)
    }

    runUntilCompleted() {
        while (true) {
            try {
                this.next()
            } catch (e) {
                if (e instanceof CompletedError) {
                    return
                } else {
                    throw e
                }
            }
        }
    }

    complete(immediate: boolean = false) {
        this.completed = true
        if (immediate) {
            throw new CompletedError()
        }
    }

    private calibrate(): Action {
        this.pointer = 0
        while (true) {
            const action = this.actions[this.pointer]

            if (!action || action.stateful) {
                break
            }

            if (Automator.checkLocation("start", action)) {
                return action
            }

            this.pointer++
        }
        back()
        sleep(1500)
        return this.calibrate()
    }

    private static checkLocation(locationName: LocationName, action: Action) {
        if (action.location) {
            const location: Location = typeof action.location === 'function' ? action.location(locationName) : action.location

            const packageName = location.packageName
            if (packageName && packageName !== currentPackage()) {
                this.launchApp(packageName)
            }

            const view = location.view
            if (view) {
                return view({activity: currentActivity()})
            }
        }

        return true
    }

    private static launchApp(packageName: string): void {
        if (app.launch(packageName)) {
            const t = Date.now()
            while (true) {
                if (packageName === currentPackage()) {
                    return
                } else if (Date.now() - t >= 5000) {
                    back()
                    sleep(1000)
                    return this.launchApp(packageName)
                }
            }
        }
        throw new Error(`The application for "${packageName}" is not installed`)
    }
}
