import { Updater } from "./Updater.js";
import { View } from "./View.js";

Updater.getInstance().initialize();

let viewElement = document.querySelector("#view") as HTMLDivElement;
let view = new View(viewElement);
let canMove = false;

// FOR TESTING
viewElement.addEventListener("mousemove", function(event: MouseEvent) { 
    let viewRect = view.getElementRect();
    view.onMouseMove(event.clientX - viewRect.left, event.clientY - viewRect.top);
});

viewElement.addEventListener("mousedown", function(event: MouseEvent) {
    canMove = true;
});

viewElement.addEventListener("wheel", function(event: WheelEvent) {
    let viewRect = view.getElementRect();
    view.onZoom(event.deltaY, event.clientX - viewRect.left, event.clientY - viewRect.top);
});

window.addEventListener("mouseup", function(event: MouseEvent) {
    if (canMove) {
        canMove = false;
    }
});

window.addEventListener("mousemove", function(event: MouseEvent) {
    if (canMove) {
        view.onMove(event.movementX, event.movementY);
    }
});

window.addEventListener("resize", function(event: UIEvent) {
    view.onResize();
});