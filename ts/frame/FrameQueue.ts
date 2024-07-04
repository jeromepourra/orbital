import { Singleton } from "../Singleton.js";
import { FrameDetail } from "./FrameDetail.js";
import { FrameFrequency } from "./FrameFrequency.js";

export class FrameQueue extends Singleton<FrameQueue> {

    private queue: Array<FrameDetail>;
    private initialized: boolean;

    public constructor() {
        super();
        this.queue = [];
        this.initialized = false;
    }

    public initialize(): this {
        if (!this.initialized) {
            this.update();
            this.initialized = true;
        }
        return this;
    }

    public add(callback: Function, frequency: FrameFrequency, count?: number): FrameDetail {
        let detail = new FrameDetail(callback, frequency, count);
        this.queue.push(detail);
        return detail;
    }

    public remove(detail: FrameDetail): this {
        this.queue = this.queue.filter((item) => item !== detail);
        return this;
    }

    private update(): void {
        requestAnimationFrame(() => {
            this.queue.forEach((item) => {
                item.execute(this);
            });
            this.update();
        });
    }

}