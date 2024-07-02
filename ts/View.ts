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
    private element: HTMLElement;
    private rectElement: DOMRect;

    constructor(x: number = 0, y: number = 0, element: HTMLElement) {

        this.element = element;
        this.rectElement = this.element.getBoundingClientRect();

        this.x = x;
        this.y = y;

        this.width = this.rectElement.width;
        this.height = this.rectElement.height;

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;

        console.log("Initialize", this);
        
    }

    public onMove(shiftX: number, shiftY: number): void {
        this.x += shiftX;
        this.y += shiftY;
        console.log("Move: ", { x: this.x, y: this.y});
    }

    public onResize(): void {

        this.rectElement = this.element.getBoundingClientRect();

        this.width = this.rectElement.width;
        this.height = this.rectElement.height;

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        this.top = this.y - this.halfHeight;
        this.left = this.x - this.halfWidth;
        this.bottom = this.y + this.halfHeight;
        this.right = this.x + this.halfWidth;

        console.log("Resize", this);

    }

}