import { Canvas, TCanvasTextOptions } from "./Canvas.js";
import { Updater } from "./Updater.js";

export class View {


    private static readonly INITIAL_X: number = 0;
    private static readonly INITIAL_Y: number = 0;
    private static readonly INITIAL_ZOOM: number = 1;
    private static readonly INITIAL_GRID_CELL_SIZE: number = 50;

    private static readonly ZOOM_FACTOR: number = 0.1;
    private static readonly ZOOM_MAX: number = 50;
    private static readonly ZOOM_MIN: number = 0.1;

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
        this.width = this.widthBase * this.zoom;
        this.height = this.heightBase * this.zoom;
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
        Updater.getInstance().add(() => {
            this.canvas.clear();
            this.makeGrid();
        });
    }

    public updateSizesCanvas() {
        this.canvas.updateSizes(this.widthBase, this.heightBase);
    }

    public onMove(shiftX: number, shiftY: number): void {

        let newX = this.x + shiftX;
        let newY = this.y + shiftY;

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
        this.updateSizesCanvas();
        this.drawCanvas();
        // console.log("Resize", this);
    }

    public onZoomIn(factor: number = View.ZOOM_FACTOR): void {
        let newLogZoom = Math.log(this.zoom) + factor;
        let newZoom = Math.exp(newLogZoom);
        this.updateZoom(Math.min(newZoom, View.ZOOM_MAX));
    }

    public onZoomOut(factor: number = View.ZOOM_FACTOR): void {
        let newLogZoom = Math.log(this.zoom) - factor;
        let newZoom = Math.exp(newLogZoom);
        this.updateZoom(Math.max(newZoom, View.ZOOM_MIN));
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
        this.width = this.widthBase * this.zoom;
        this.height = this.heightBase * this.zoom;
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

        const cellSize = View.INITIAL_GRID_CELL_SIZE * this.zoom;
        const halfCellSize = cellSize / 2;
        const centerX = (this.widthBase / 2) + this.x;
        const centerY = (this.heightBase / 2) + this.y;

        const textOptions: TCanvasTextOptions = {
            center: true,
            fontSize: Math.floor(Math.min(14, cellSize / 2))
        };

        for (let x = centerX + halfCellSize; x < this.widthBase; x += cellSize) {
            this.canvas.drawLine(x, 0, x, this.heightBase);
            this.canvas.drawText(Math.ceil((x - centerX) / cellSize).toString(), x + halfCellSize, centerY, textOptions);
        }
        for (let x = centerX - halfCellSize; x > 0; x -= cellSize) {
            this.canvas.drawLine(x, 0, x, this.heightBase);
            this.canvas.drawText(Math.ceil((x - centerX) / cellSize).toString(), x + halfCellSize, centerY, textOptions);
        }

        for (let y = centerY + halfCellSize; y < this.heightBase; y += cellSize) {
            this.canvas.drawLine(0, y, this.widthBase, y);
            this.canvas.drawText(Math.ceil((y - centerY) / cellSize).toString(), centerX, y + halfCellSize, textOptions);
        }
        for (let y = centerY - halfCellSize; y > 0; y -= cellSize) {
            this.canvas.drawLine(0, y, this.widthBase, y);
            this.canvas.drawText(Math.ceil((y - centerY) / cellSize).toString(), centerX, y + halfCellSize, textOptions);
        }

    }

}