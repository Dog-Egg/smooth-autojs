declare function sleep(n: number): void

declare function currentPackage(): string

declare function currentActivity(): string

declare namespace app {
    function launch(packageName: string): boolean;
}

declare function back(): boolean;
