import { Canvas } from "./Canvas.js";
import { FrameFrequency } from "./frame/FrameFrequency.js";
import { FrameQueue } from "./frame/FrameQueue.js";
import { Random } from "./functions.js";
import { View } from "./View.js";

export class Particule {

    static readonly VELOCITY_MIN: number = -5;
    static readonly VELOCITY_MAX: number = +5;

    static readonly MASS_MIN: number = 1e+12;
    static readonly MASS_MAX: number = 1e+12;

    static readonly DENSITY: number = 5;
    static readonly G: number = 6.67430e-11;

    private x: number;
    private y: number; 
    private vx: number;
    private vy: number;
    private mass: number;
    private volume: number;
    private radius: number;
    private radiusBase: number;

    private view: View;
    private canvas: Canvas;

    private viewX: number;
    private viewY: number;

    public static randomize(view: View, canvas: Canvas): Particule {
        return new Particule(
            view,
            canvas,
            Random(-view.getHalfWidth(), view.getHalfWidth()),
            Random(-view.getHalfHeight(), view.getHalfHeight()),
            Random(Particule.VELOCITY_MIN, Particule.VELOCITY_MAX),
            Random(Particule.VELOCITY_MIN, Particule.VELOCITY_MAX),
            Random(Particule.MASS_MIN, Particule.MASS_MAX)
        );
    }

    constructor(view: View, canvas: Canvas, x: number, y: number, vx: number, vy: number, mass: number) {

        this.view = view;
        this.canvas = canvas;

        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.mass = mass * Particule.DENSITY;
        this.volume = this.mass / Particule.DENSITY;
        this.radiusBase = Math.cbrt((3 * this.volume) / (4 * Math.PI)) * 1e-3;
        this.radius = this.radiusBase * this.view.getZoom();
        // this.radius = Math.cbrt((3 * this.volume) / (4 * Math.PI));

        this.viewX = this.x - this.view.getX() + this.view.getHalfWidth();
        this.viewY = this.y - this.view.getY() + this.view.getHalfHeight();

        FrameQueue.getInstance().add(() => {
            this.update();
            this.draw();
        }, FrameFrequency.FOREVER);

        console.log(this);
        
    }
    
    // public onZoom(): void {
    //     this.radius /= this.view.getZoom();
    // }

    public calculateForce(particule: Particule): number {
        const distance = Math.sqrt(Math.pow(particule.x - this.x, 2) + Math.pow(particule.y - this.y, 2));
        const force = (Particule.G * this.mass * particule.mass) / Math.pow(distance, 2);
        return force;
    }

    public calculateVelocity(particule: Particule, force: number): void {
        const angle = Math.atan2(particule.y - this.y, particule.x - this.x);
        const acceleration = force / this.mass;
        const accelerationX = acceleration * Math.cos(angle);
        const accelerationY = acceleration * Math.sin(angle);
        this.updateVelocity(accelerationX, accelerationY);
    }

    public handleCollision(other: Particule): void {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Vérifiez si les particules se touchent
        if (distance < this.radius + other.radius) {
            // Calculez le vecteur normal de collision
            const nx = dx / distance;
            const ny = dy / distance;

            // Calculez la composante de la vitesse le long du vecteur normal (vitesse relative)
            const p = 2 * (this.vx * nx + this.vy * ny - other.vx * nx - other.vy * ny) / (this.mass + other.mass);

            // Mettez à jour les vitesses en fonction de la conservation de la quantité de mouvement et de l'énergie cinétique
            this.vx -= p * this.mass * nx;
            this.vy -= p * this.mass * ny;
            other.vx += p * other.mass * nx;
            other.vy += p * other.mass * ny;

            const overlap = (this.radius + other.radius) - distance + 0.01; // 0.01 est un petit tampon pour éviter la superposition
            this.x -= overlap * nx / 2;
            this.y -= overlap * ny / 2;
            other.x += overlap * nx / 2;
            other.y += overlap * ny / 2;

        }
    }

    public updateVelocity(vx: number, vy: number): void {
        this.vx += vx;
        this.vy += vy;
    }

    public update(): void {

        this.view.getParticules().forEach((particule) => {
            if (particule !== this) {
                const force = this.calculateForce(particule);
                this.calculateVelocity(particule, force);
                this.handleCollision(particule);
            }
        });

        this.x += this.vx / (1000/60);
        this.y += this.vy / (1000/60);
        
        this.viewX = (this.x - this.view.getX() + this.view.getHalfWidth()) * this.view.getZoom();
        this.viewY = (this.y - this.view.getY() + this.view.getHalfHeight()) * this.view.getZoom();
        this.radius = this.radiusBase * this.view.getZoom();

        // console.log(this.vx, this.vy);
                
    }

    // CANVAS ===
    // ==========

    public draw(): void {
        this.canvas.drawCircle(this.viewX, this.viewY, this.radius);
    }

}