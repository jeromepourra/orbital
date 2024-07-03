import { Canvas } from "./Canvas.js";

export type ViewProperties = {
    x: number;
    y: number;
    width: number;
    height: number;
    halfWidth: number;
    halfHeight: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    element: HTMLElement;
};

export class View {

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

        this.updateCenter(x, y);
        this.updateSizes(sizesElement.width, sizesElement.height);
        this.updateArea();

        this.element = element;
        this.canvas = new Canvas(this.element.querySelector("canvas") as HTMLCanvasElement, this.width, this.height);

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.makeGrid(25);
        });

        console.log("Initialize", this);
        
    }

    public getProperties(): ViewProperties {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            halfWidth: this.halfWidth,
            halfHeight: this.halfHeight,
            top: this.top,
            left: this.left,
            bottom: this.bottom,
            right: this.right,
            element: this.element
        };
    }

    public onMove(shiftX: number, shiftY: number): void {
        this.updateCenter(this.x + shiftX, this.y + shiftY);
        this.updateArea();

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.makeGrid(25);
        });

        console.log("Move:", this);
    }

    public onResize(): void {

        let sizesElement = this.element.getBoundingClientRect();

        this.updateSizes(sizesElement.width, sizesElement.height);
        this.updateArea();

        this.canvas.updateSizes(this.width, this.height);

        requestAnimationFrame(() => {
            this.canvas.clear();
            this.makeGrid(25);
        });

        console.log("Resize", this);

    }

    private updateCenter(x: number, y: number): void {
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

    private makeGrid(cellSize: number): void {

        const halfCellSize = cellSize / 2;
        const centerX = (this.width / 2) + this.x;
        const centerY = (this.height / 2) + this.y;

        for (let x = centerX + halfCellSize; x < this.width; x += cellSize) {
            this.canvas.drawLine(x, 0, x, this.height);
            this.canvas.drawTextCenter(Math.round((x - centerX) / cellSize).toString(), x + halfCellSize, centerY);
        }
        for (let x = centerX - halfCellSize; x > 0; x -= cellSize) {
            this.canvas.drawLine(x, 0, x, this.height);
            this.canvas.drawTextCenter(Math.round((x - centerX) / cellSize).toString(), x + halfCellSize, centerY);
        }

        for (let y = centerY + halfCellSize; y < this.height; y += cellSize) {
            this.canvas.drawLine(0, y, this.width, y);
            this.canvas.drawTextCenter(Math.round((y - centerY) / cellSize).toString(), centerX, y + halfCellSize);
        }
        for (let y = centerY - halfCellSize; y > 0; y -= cellSize) {
            this.canvas.drawLine(0, y, this.width, y);
            this.canvas.drawTextCenter(Math.round((y - centerY) / cellSize).toString(), centerX, y + halfCellSize);
        }

    }

}