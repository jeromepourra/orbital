import { FrameFrequency } from "./FrameFrequency.js";
import { FrameQueue } from "./FrameQueue.js";

export class FrameDetail {

    private callback: Function;
    private frequency: FrameFrequency;
    private count?: number;

    public constructor(callback: Function, frequency: FrameFrequency, count: number) {
        this.callback = callback;
        this.frequency = frequency;
        if (this.frequency === FrameFrequency.MULTIPLE) {
            this.count = count;
        }
    }

    public execute(queue: FrameQueue): void {
        this.callback();
        switch (this.frequency) {
            case FrameFrequency.FOREVER:
                break;
            case FrameFrequency.ONCE:
                queue.remove(this);
                break;
            case FrameFrequency.MULTIPLE:
                this.count--;
                if (this.count === 0) {
                    queue.remove(this);
                }
                break;
        }
    }

}