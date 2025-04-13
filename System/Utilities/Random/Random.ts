import { Angle, Vector2D } from "..";

export class Random {
    /**
     * Генерирует случайное дробное число от 0 до указанного числа
     * @param max - максимальное значение для случайного числа
     */
    public static Float(max: number): number
    /**
     * Генерирует случайное дробное число в указанном диапазоне
     * @param min - минимальное значение для случайного числа
     * @param max - максимальное значение для случайного числа
     */
    public static Float(min: number, max: number): number
    public static Float(minOrMax: number, max?: number): number {
        if (typeof max === 'undefined') {
            return Math.random() * minOrMax;
        }
        else {
            return Math.random() * (max - minOrMax + 1) + minOrMax;
        }
    }

    /**
     * Генерирует случайное целое число от 0 до указанного числа
     * @param max - максимальное значение для случайного числа
     */
    public static Integer(max: number): number
    /**
    * Генерирует случайное целое число в указанном диапазоне
    * @param min - минимальное значение для случайного числа
    * @param max - максимальное значение для случайного числа
    */
    public static Integer(min: number, max: number): number
    public static Integer(minOrMax: number, max?: number): number {
        return Math.floor(Random.Float(minOrMax, max!));
    }

    /**
     * Генерирует случайный цвет в RGB
     */
    public static ColorRGB(): string {
        return `rgb(${Random.Integer(255)}, ${Random.Integer(255)}, ${Random.Integer(255)})`;
    }

    /**
     * Генерирует случайный цвет в HEX-коде
     */
    public static ColorHEX(): string {
        const symbols: string = '0123456789ABCDEF';
        const mask: string = '#xxxxxx';
        return mask.replace(/x/g, () => symbols.charAt(Math.random() * symbols.length));
    }

    /**
     * Генерирует случайное логическое значение true/false
     */
    public static Boolean(): boolean {
        return Random.Integer(0, 1) === 1;
    }

    /**
     * Генерирует случайный угол
     * @param degree - максимальное значение угла (по-умолчанию 360)
     */
    public static Angle(degree: number = 360): Angle {
        return Angle.degree(Random.Integer(degree));
    }

    /**
     * Генерируем случайный вектор
     * @param maxX - максимальное значение координаты x
     * @param maxY - максимальное значение координаты y
     */
    public static Vector2D(maxX: number, maxY: number): Vector2D {
        return new Vector2D(Math.random() * maxX, Math.random() * maxY);
    }
}