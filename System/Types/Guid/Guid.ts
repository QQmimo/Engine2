export class Guid {
    public static new(): string {
        const symbols: string = "0123456789ABCDEF";
        const mask: string = "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx";
        return mask.replace(/x/g, c => symbols.charAt(Math.random() * symbols.length));
    }
}