export class Helpers {
    public static getRouteUniqueName(
        method: string,
        version: string,
        action: string
    ): string {
        return `${method.toUpperCase()}.${version}.${action}`;
    }
}