const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const foreColor : string = "#f44336"
const backGroundColor : string = "#bdbdbd"

const updateScale : Function = (scale : number, dir : number) => {
    return scale * dir * scGap
}

const drawFilledRect : Function = (context : CanvasRenderingContext2D, sc : number) => {
    context.fillStyle = foreColor
    context.fillRect(0, 0, w, h * sc)
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += updateScale(this.scale, this.dir)
        if (Math.abs(this.scale - this.prevScale)) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
