export type LocationName = 'start' | 'end'
export type Location = {
    packageName?: string
    version?:
        | string
        | number
        | Array<string | number>
        | ((version: { name: string, code: number }) => {})
    view?: (context: { activity: string }) => boolean
}

export interface Action<T = any> {
    location?:
        | Location
        | ((locationName: LocationName) => Location)
    stateful?: boolean
    waitingTime?: number
    do: () => T
    callback?: (result: T) => void
    errorback?: (e: Error) => void
}
