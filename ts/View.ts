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
    private element: HTMLDivElement;
    private elementRect: DOMRect;
    private canvas: Canvas;

    constructor(element: HTMLDivElement, x?: number, y?: number, zoom?: number) {

        this.element = element;
        this.elementRect = element.getBoundingClientRect();

        this.x = x || View.INITIAL_X;
        this.y = y || View.INITIAL_Y;
        this.zoom = zoom || View.INITIAL_ZOOM;
        this.widthBase = this.elementRect.width;
        this.heightBase = this.elementRect.height;
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

        this.element = element;
        this.canvas = new Canvas(this.element.querySelector("canvas") as HTMLCanvasElement, this.width, this.height);

        this.drawCanvas();

        // console.log("Initialize", this);

    }

    public getElementRect(): DOMRect {
        return this.elementRect;
    }

    public drawCanvas() {
        Updater.getInstance().add(() => {
            this.canvas.clear();
            this.makeGrid();
            this.printInfos();
        });
    }

    public updateSizesCanvas() {
        this.canvas.updateSizes(this.widthBase, this.heightBase);
    }

    public onMouseMove(mouseX: number, mouseY: number): void {

        let shiftCenterX = mouseX - this.halfWidthBase;
        let shiftCenterY = mouseY - this.halfHeightBase;

        let shiftX = (shiftCenterX - this.x) / this.zoom;
        let shiftY = (shiftCenterY - this.y) / this.zoom;
        
    }

    public onMove(shiftX: number, shiftY: number): void {

        let newX = this.x - shiftX;
        let newY = this.y - shiftY;

        this.updateCenter(newX, newY);
        this.updateArea();
        this.drawCanvas();
        // console.log("Move:", this);

    }

    public onResize(): void {

        this.elementRect = this.element.getBoundingClientRect();
        this.updateBaseSizes(this.elementRect.width, this.elementRect.height);
        this.updateSizes();
        this.updateArea();
        this.updateSizesCanvas();
        this.drawCanvas();
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

        let newLogZoom = Math.log(this.zoom) + factor;
        let newZoom = Math.exp(newLogZoom);

        // let shiftCenterX = mouseX - this.halfWidthBase;
        // let shiftCenterY = mouseY - this.halfHeightBase;

        // let shiftX = (shiftCenterX - this.x) / this.zoom;
        // let shiftY = (shiftCenterY - this.y) / this.zoom;

        // console.log(shiftX, shiftY);

        // ====================================================================
        // La partie du dessus est good !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // ====================================================================
        
        // this.updateCenter(shiftX, shiftY);

        // // Coordonnées du point par rapport auquel on veut zoomer (dans le système de coordonnées de la vue)
        // let pointXInView = this.x;
        // let pointYInView = this.y;

        // console.log(pointXInView, pointYInView);


        // // Appliquer le nouveau zoom
        // this.zoom = newZoom;

        // // // Mise à jour des dimensions de la vue basée sur le nouveau zoom
        // // this.halfWidth *= newZoom / Math.exp(newLogZoom - factor);
        // // this.halfHeight *= newZoom / Math.exp(newLogZoom - factor);

        // // Calculer le déplacement nécessaire pour que le point sous le curseur reste inchangé
        // let newPointXInView = pointXInView * newZoom / Math.exp(newLogZoom - factor);
        // let newPointYInView = pointYInView * newZoom / Math.exp(newLogZoom - factor);

        // // Mettre à jour la position de la vue pour appliquer le décalage
        // this.x += pointXInView - newPointXInView;
        // this.y += pointYInView - newPointYInView;

        // Mise à jour de la vue ou d'autres éléments nécessaires
        this.updateZoom(newZoom);

    }

    public onZoomOut(mouseX: number, mouseY: number, factor: number): void {
        let newLogZoom = Math.log(this.zoom) - factor;
        let newZoom = Math.exp(newLogZoom);
        this.updateZoom(newZoom);
    }

    private updateZoom(zoom: number): void {
        this.zoom = Math.max(View.ZOOM_MIN, Math.min(zoom, View.ZOOM_MAX));
        this.updateSizes();
        this.updateArea();
        console.log("Zoom:", this.zoom, "\nSizes", Math.round(this.width), Math.round(this.height), "\nArea:", Math.round(this.top), Math.round(this.left), Math.round(this.bottom), Math.round(this.right));
        this.drawCanvas();
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

    private makeGrid(): void {

        const cellSize = View.INITIAL_GRID_CELL_SIZE * this.zoom;
        const halfCellSize = cellSize / 2;
        const centerX = (this.widthBase / 2) - this.x;
        const centerY = (this.heightBase / 2) - this.y;

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

    }

}