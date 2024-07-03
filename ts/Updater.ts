import { Singleton } from "./Singleton.js";

export class Updater extends Singleton<Updater> {

    private stack: Array<Function>;
    private initialized: boolean;

    public constructor() {
        super();
        this.stack = [];
        this.initialized = false;
    }

    public initialize(): this {
        if (!this.initialized) {
            this.update();
            this.initialized = true;
        }
        return this;
    }

    public add(callback: Function): this {
        this.stack.push(callback);
        return this;
    }

    public remove(callback: Function): this {
        this.stack = this.stack.filter((item) => item !== callback);
        return this;
    }

    private update(): void {
        requestAnimationFrame(() => {
            this.stack.forEach((callback) => {
                callback();
            });
            this.update();
        });
    }

}