export type TCanvasTextOptions = {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
    baseline?: 'top' | 'middle' | 'bottom';
};

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
        if (this.width !== width || this.height === height) {
            this.width = width;
            this.height = height;
            this.element.width = this.width;
            this.element.height = this.height;
        }
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

    public drawText(text: string, x: number, y: number, options?: TCanvasTextOptions): void {

        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'black';
        this.context.font = '14px monospace';
        
        if (options) {

            if (options.align) {
                this.context.textAlign = options.align;
            }

            if (options.baseline) {
                this.context.textBaseline = options.baseline;
            }

            if (options.fontFamily) {
                this.context.font = `${this.context.font} ${options.fontFamily}`;
            } else if (options.fontSize) {
                this.context.font = `${options.fontSize}px monospace`;
            }

            if (options.color) {
                this.context.fillStyle = options.color;
            }

        }

        this.context.fillText(text, x, y);
    }

}