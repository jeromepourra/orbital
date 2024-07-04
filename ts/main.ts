import { Canvas } from "./Canvas.js";
import { FrameFrequency } from "./frame/FrameFrequency.js";
import { FrameQueue } from "./frame/FrameQueue.js";
import { Particule } from "./Particule.js";
import { View } from "./View.js";

FrameQueue.getInstance().initialize();

let canMove = false;
let viewElement = document.querySelector("#view") as HTMLDivElement;
let rectView = viewElement.getBoundingClientRect();

let canvas = new Canvas(viewElement.querySelector("canvas") as HTMLCanvasElement, rectView.width, rectView.height);

let view = new View(0, 0, rectView.width, rectView.height, 1, canvas);

let particules = [];
for (let i = 0; i < 10; i++) {
    particules.push(Particule.randomize(view, canvas));
}

view.addParticules(particules);

// FOR TESTING
viewElement.addEventListener("mousemove", function(event: MouseEvent) { 
    rectView = viewElement.getBoundingClientRect();
    view.onMouseMove(event.clientX - rectView.left, event.clientY - rectView.top);
});

viewElement.addEventListener("click", function(event: MouseEvent) {
    view.addParticule(Particule.randomize(view, canvas));
});

viewElement.addEventListener("mousedown", function(event: MouseEvent) {
    canMove = true;
});

viewElement.addEventListener("wheel", function(event: WheelEvent) {
    rectView = viewElement.getBoundingClientRect();
    view.onZoom(event.deltaY, event.clientX - rectView.left, event.clientY - rectView.top);
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
    rectView = viewElement.getBoundingClientRect();
    view.onResize(rectView.width, rectView.height);
});