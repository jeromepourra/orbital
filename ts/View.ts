import { Canvas, TCanvasTextOptions } from "./Canvas.js";
import { FrameFrequency } from "./frame/FrameFrequency.js";
import { FrameQueue } from "./frame/FrameQueue.js";
import { Particule } from "./Particule.js";

export class View {

    private static readonly INITIAL_GRID_CELL_SIZE: number = 50;
    private static readonly ZOOM_FACTOR: number = 0.1;
    private static readonly ZOOM_MAX: number = 50;
    private static readonly ZOOM_MIN: number = 0.1;

    private x: number;
    private y: number;
    private zoom: number;
    private widthBase: number;
    private heightBase: number;
    private halfWidthBase: number;
    private halfHeightBase: number;
    private width: number;
    private height: number;
    private halfWidth: number;
    private halfHeight: number;
    private top: number;
    private left: number;
    private bottom: number;
    private right: number;
    private canvas: Canvas;
    private particules: Array<Particule> = [];

    constructor(x: number, y: number, width: number, height: number, zoom: number, canvas: Canvas) {

        this.x = x;
        this.y = y;
        this.zoom = zoom;
        this.widthBase = width;
        this.heightBase = height;
        this.halfWidthBase = this.widthBase / 2;
        this.halfHeightBase = this.heightBase / 2;
        this.width = this.widthBase / this.zoom;
        this.height = this.heightBase / this.zoom;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;

        this.canvas = canvas;

        FrameQueue.getInstance().add(() => {
            this.canvas.clear();
            this.makeGrid();
            this.printInfos();
        }, FrameFrequency.FOREVER);

        // console.log("Initialize", this);

    }

    // GETTERS ===
    // ===========

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getZoom(): number {
        return this.zoom;
    }

    public getWidthBase(): number {
        return this.widthBase;
    }

    public getHeightBase(): number {
        return this.heightBase;
    }

    public getHalfWidthBase(): number {
        return this.halfWidthBase;
    }

    public getHalfHeightBase(): number {
        return this.halfHeightBase;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getHalfWidth(): number {
        return this.halfWidth;
    }

    public getHalfHeight(): number {
        return this.halfHeight;
    }

    public getTop(): number {
        return this.top;
    }

    public getLeft(): number {
        return this.left;
    }

    public getBottom(): number {
        return this.bottom;
    }

    public getRight(): number {
        return this.right;
    }

    public getCanvas(): Canvas {
        return this.canvas;
    }

    public getParticules(): Array<Particule> {
        return this.particules;
    }

    public addParticule(particule: Particule): void {
        this.particules.push(particule);
    }

    public addParticules(particules: Array<Particule>): void {
        particules.forEach((particule: Particule) => {
            this.addParticule(particule);
        });
    }

    public onMouseMove(mouseX: number, mouseY: number): void {
        // This is a test method !
    }

    public onMove(shiftX: number, shiftY: number): void {

        const newX = this.x - shiftX / this.zoom;
        const newY = this.y - shiftY / this.zoom;

        this.updateCenter(newX, newY);
        this.updateArea();
        // console.log("Move:", this);

    }

    public onResize(width: number, height: number): void {

        this.updateBaseSizes(width, height);
        this.updateSizes();
        this.updateArea();
        this.updateSizesCanvas();
        // console.log("Resize", this);

    }

    public onZoom(deltaY: number, mouseX: number, mouseY: number, factor: number = View.ZOOM_FACTOR): void {
        if (deltaY > 0) {
            this.onZoomOut(mouseX, mouseY, factor);
        } else {
            this.onZoomIn(mouseX, mouseY, factor);
        }
    }

    public onZoomIn(mouseX: number, mouseY: number, factor: number): void {
        const newLogZoom = Math.log(this.zoom) + factor;
        const newZoom = Math.exp(newLogZoom);
        this.updateZoom(mouseX, mouseY, newZoom);
    }

    public onZoomOut(mouseX: number, mouseY: number, factor: number): void {
        const newLogZoom = Math.log(this.zoom) - factor;
        const newZoom = Math.exp(newLogZoom);
        this.updateZoom(mouseX, mouseY, newZoom);
    }

    private updateZoom(mouseX: number, mouseY: number, zoom: number): void {

        // Calculate the position of the mouse in the canvas before zoom
        const preZoomX = mouseX / this.zoom - this.halfWidth + this.x;
        const preZoomY = mouseY / this.zoom - this.halfHeight + this.y;

        this.zoom = Math.max(View.ZOOM_MIN, Math.min(zoom, View.ZOOM_MAX));
        this.updateSizes();
        this.updateArea();

        // Calculate the position of the mouse in the canvas after zoom
        const postZoomX = mouseX / this.zoom - this.halfWidth;
        const postZoomY = mouseY / this.zoom - this.halfHeight;

        this.updateCenter(preZoomX - postZoomX, preZoomY - postZoomY);

    }

    private updateCenter(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    private updateBaseSizes(width: number, height: number): void {
        this.widthBase = width;
        this.heightBase = height;
        this.halfWidthBase = this.widthBase / 2;
        this.halfHeightBase = this.heightBase / 2;
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

    private updateSizesCanvas() {
        this.canvas.updateSizes(this.widthBase, this.heightBase);
    }

    private makeGrid(): void {

        const cellSize = View.INITIAL_GRID_CELL_SIZE * this.zoom;
        const halfCellSize = cellSize / 2;
        const centerX = (this.halfWidth - this.x) * this.zoom;
        const centerY = (this.halfHeight - this.y) * this.zoom;

        const textOptions: TCanvasTextOptions = {
            align: "center",
            baseline: "middle",
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

    private printInfos(): void {

        document.querySelector("#zoom").textContent = this.zoom.toFixed(3);

        document.querySelector("#area-top").textContent = this.top.toFixed(0);
        document.querySelector("#area-left").textContent = this.left.toFixed(0);
        document.querySelector("#area-bottom").textContent = this.bottom.toFixed(0);
        document.querySelector("#area-right").textContent = this.right.toFixed(0);

        document.querySelector("#point-width").textContent = this.x.toFixed(0);
        document.querySelector("#point-height").textContent = this.y.toFixed(0);

        document.querySelector("#square-width").textContent = this.width.toFixed(0);
        document.querySelector("#square-height").textContent = this.height.toFixed(0);

    }

}