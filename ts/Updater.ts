import { Singleton } from "./Singleton.js";

export class Updater extends Singleton<Updater> {

    private stack: Array<Function> = [];

    protected constructor() {
        super();
    }

    public add(callback: Function): void {
        this.stack.push(callback);
    }

    public remove(callback: Function): void {
        this.stack = this.stack.filter((item) => item !== callback);
    }

    update() {
        requestAnimationFrame(() => {
            this.stack.forEach((callback) => {
                callback();
            });
            console.log("ici");
            // this.update();
        });
    }

}