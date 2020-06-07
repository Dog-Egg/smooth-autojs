import RouteMap from "../src/core/route-map";

test('test RouteMap', () => {
    const routeMap = new RouteMap(['A', 'B', 'C', 'D']);
    expect(routeMap.next()).toBe('A')
    expect(routeMap.next()).toBe('B')
    expect(routeMap.next()).toBe('C')
    expect(routeMap.next()).toBe('D')
    expect(() => routeMap.next()).toThrow(RouteMap.stop)

    const routeMap2 = new RouteMap(['A', 'B', 'C', 'D'], {init: [0, 1, 2, 3, 1]});
    expect(routeMap2.next()).toBe('A')
    expect(routeMap2.next()).toBe('B')
    expect(routeMap2.next()).toBe('C')
    expect(routeMap2.next()).toBe('D')
    expect(routeMap2.next()).toBe('B')
    expect(routeMap2.next()).toBe('C')

    const routeMap3 = new RouteMap(['A', 'B', 'C', 'D', 'E'], {init: [0, 1, 2, 3], other: [0, 1, 3, 2, 4]});
    expect(routeMap3.next()).toBe('A')
    expect(routeMap3.next()).toBe('B')
    expect(routeMap3.next()).toBe('C')
    expect(routeMap3.next()).toBe('D')
    routeMap3.switchTo('other')
    expect(routeMap3.next()).toBe('C')
    expect(routeMap3.next()).toBe('E')
    expect(() => routeMap.next()).toThrow(RouteMap.stop)
})
