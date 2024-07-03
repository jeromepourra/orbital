import { Canvas } from "./Canvas.js";
import { Updater } from "./Updater.js";

export class View {


    private static readonly INITIAL_X: number = 0;
    private static readonly INITIAL_Y: number = 0;
    private static readonly INITIAL_ZOOM: number = 1;
    private static readonly INITIAL_GRID_CELL_SIZE: number = 50;

    private static readonly ZOOM_FACTOR: number = 0.1;
    private static readonly ZOOM_MAX: number = 3;
    private static readonly ZOOM_MIN: number = 0.5;

    private x: number;
    private y: number;
    private zoom: number;
    private widthBase: number;
    private heightBase: number;
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

    constructor(element: HTMLDivElement, x?: number, y?: number, zoom?: number) {

        let sizesElement = element.getBoundingClientRect();

        this.x = x || View.INITIAL_X;
        this.y = y || View.INITIAL_Y;
        this.zoom = zoom || View.INITIAL_ZOOM;
        this.widthBase = sizesElement.width;
        this.heightBase = sizesElement.height;
        this.width = this.widthBase / this.zoom;
        this.height = this.heightBase / this.zoom;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;

        this.element = element;
        this.canvas = new Canvas(this.element.querySelector("canvas") as HTMLCanvasElement, this.width, this.height);

        this.drawCanvas();

        console.log("Initialize", this);
        
    }

    public drawCanvas() {
        this.canvas.updateSizes(this.width, this.height);
        Updater.getInstance().add(() => {
            this.canvas.clear();
            this.makeGrid();
        });
    }

    public onMove(shiftX: number, shiftY: number): void {

        let newX = this.x + shiftX / this.zoom;
        let newY = this.y + shiftY / this.zoom;

        this.updateCenter(newX, newY);
        this.updateArea();
        this.drawCanvas();
        // console.log("Move:", this);
    }

    public onResize(): void {
        let sizesElement = this.element.getBoundingClientRect();
        this.updateBaseSizes(sizesElement.width, sizesElement.height);
        this.updateSizes();
        this.updateArea();
        this.drawCanvas();
        // console.log("Resize", this);
    }

    public onZoomIn(factor: number = View.ZOOM_FACTOR): void {
        let newZoom = this.zoom + factor;
        if (newZoom > View.ZOOM_MAX) {
            newZoom = View.ZOOM_MAX;
        }
        this.updateZoom(newZoom);
    }

    public onZoomOut(factor: number = View.ZOOM_FACTOR): void {
        let newZoom = this.zoom - factor;
        if (newZoom < View.ZOOM_MIN) {
            newZoom = View.ZOOM_MIN;
        }
        this.updateZoom(newZoom);
    }

    private updateZoom(zoom: number): void {
        this.zoom = Math.max(0.1, zoom);
        console.log("Zoom:", this.zoom, "Sizes:", this.width + ":" + this.height);
        this.updateSizes();
        this.updateArea();
        this.drawCanvas();
    }

    private updateCenter(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    private updateBaseSizes(width: number, height: number): void {
        this.widthBase = width;
        this.heightBase = height;
    }

    private updateSizes(): void {
        this.width = this.widthBase / this.zoom;
        this.height = this.heightBase / this.zoom;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

    private updateArea(): void {
        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;
    }

    private makeGrid(): void {

        const cellSize = View.INITIAL_GRID_CELL_SIZE;
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