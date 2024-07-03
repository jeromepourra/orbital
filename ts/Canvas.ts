export class Canvas {

    private element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(element: HTMLCanvasElement, width: number, height: number) {
        this.element = element;
        this.context = this.element.getContext("2d") as CanvasRenderingContext2D;
        this.updateSizes(width, height);
    }

    public updateSizes(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.element.width = this.width;
        this.element.height = this.height;
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    public drawRect(x: number, y: number, width: number, height: number, color: string = 'black'): void {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    public drawCircle(x: number, y: number, radius: number, color: string = 'black'): void {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number, color: string = 'black'): void {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.strokeStyle = color;
        this.context.stroke();
        this.context.closePath();
    }

    public drawText(text: string, x: number, y: number, color: string = 'black'): void {
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }

    public drawTextCenter(text: string, x: number, y: number, color: string = 'black'): void {
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.drawText(text, x, y, color);
    }

}