import { Canvas } from "./Canvas.js";

export class ViewPoint {

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;
    private top: number;
    private left: number;
    private bottom: number;
    private right: number;
    private element: HTMLDivElement;
    private canvas: Canvas;

    constructor(x: number = 0, y: number = 0, element: HTMLDivElement) {

        let sizesElement = element.getBoundingClientRect();

        this.updateDot(x, y);
        this.updateSizes(sizesElement.width, sizesElement.height);
        this.updateArea();

        this.element = element;
        this.canvas = new Canvas(this.element.querySelector("canvas") as HTMLCanvasElement, this.width, this.height);

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.canvas.drawGrid(this.x, this.y, 25);
        });

        console.log("Initialize", this);
        
    }

    public onMove(shiftX: number, shiftY: number): void {
        this.updateDot(this.x + shiftX, this.y + shiftY);
        this.updateArea();

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.canvas.drawGrid(this.x, this.y, 25);
        });

        console.log("Move:", this);
    }

    public onResize(): void {

        let sizesElement = this.element.getBoundingClientRect();

        this.updateSizes(sizesElement.width, sizesElement.height);
        this.updateArea();

        this.canvas.resize(this.width, this.height);

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.canvas.drawGrid(this.x, this.y, 25);
        });

        console.log("Resize", this);

    }

    private updateDot(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    private updateArea(): void {
        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;
    }

    private updateSizes(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

}