export function Random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}