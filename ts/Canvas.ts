export class Canvas {

    private element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(element: HTMLCanvasElement, width: number, height: number) {
        this.element = element;
        this.context = this.element.getContext("2d") as CanvasRenderingContext2D;
        this.resize(width, height);
    }

    public resize(width: number, height: number): void {
        this.element.width = width;
        this.element.height = height;
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
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

    public drawGrid(viewX: number, viewY: number, cellSize: number, color: string = 'black'): void {

        const centerX = (this.element.width / 2) + viewX;
        const centerY = (this.element.height / 2) + viewY;

        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        const halfCellSize = cellSize / 2;

        for (let x = centerX + halfCellSize; x < this.element.width; x += cellSize) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.element.height);
            this.context.stroke();
            this.context.fillText(Math.round((x - centerX) / cellSize).toString(), x + halfCellSize, centerY);
        }
        for (let x = centerX - halfCellSize; x > 0; x -= cellSize) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.element.height);
            this.context.stroke();
            this.context.fillText(Math.round((x - centerX) / cellSize).toString(), x + halfCellSize, centerY);
        }

        for (let y = centerY + halfCellSize; y < this.element.height; y += cellSize) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.element.width, y);
            this.context.stroke();
            this.context.fillText(Math.round((y - centerY) / cellSize).toString(), centerX, y + halfCellSize);
        }
        for (let y = centerY - halfCellSize; y > 0; y -= cellSize) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.element.width, y);
            this.context.stroke();
            this.context.fillText(Math.round((y - centerY) / cellSize).toString(), centerX, y + halfCellSize);
        }
    }

}