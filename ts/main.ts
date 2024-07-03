import { Updater } from "./Updater.js";
import { View } from "./View.js";

let viewElement = document.querySelector("#view") as HTMLDivElement;
let view = new View(0, 0, viewElement);
let canMove = false;

let instance = Updater.getInstance();
console.log(instance);


viewElement.addEventListener("mousedown", (event: MouseEvent) => {
    canMove = true;
});

window.addEventListener("mouseup", (event: MouseEvent) => {
    if (canMove) {
        canMove = false;
    }
});

window.addEventListener("mousemove", (event: MouseEvent) => {
    if (canMove) {
        view.onMove(event.movementX, event.movementY);
    }
});

window.addEventListener("resize", (event: UIEvent) => {
    view.onResize();
});