export abstract class Singleton<T> {

    private static instances: Map<string, any> = new Map();

    protected constructor() {
        console.log("Singleton constructor");
    }

    public static getInstance<T>(this: new () => T): T {
        const className = this.name;
        console.log(className);
        
        if (!Singleton.instances.has(className)) {
            Singleton.instances.set(className, new this());
        }
        return Singleton.instances.get(className);
    }

}