const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const foreColor : string = "#f44336"
const backGroundColor : string = "#bdbdbd"
const nodes : number = 5

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
            cb(this.prevScale)
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb(this.dir)
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

class FillAppendCanvasNode {

    state : State = new State()
    prev : FillAppendCanvasNode
    next : FillAppendCanvasNode
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    constructor(private i : number) {
        this.addNeighbor()
        this.initCanvas()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new FillAppendCanvasNode(this.i + 1)
            this.next.prev = this
        }
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
    }

    draw() {
        this.context.fillStyle = backGroundColor
        this.context.fillRect(0, 0, w, h)
        this.context.fillStyle = foreColor
        this.context.fillRect(0, 0, w, h)
    }

    update(cb : Function) {
        this.state.update((scale) => {
            if (scale == -1) {
                document.body.removeChild(this.canvas)
            }
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.state.startUpdating((dir) => {
            if (dir == 1) {
                document.body.appendChild(this.canvas)
                window.scrollBy(0, h)
            }
            cb()
        })
    }

    getNext(dir : number, cb : Function) : FillAppendCanvasNode {
        var curr : FillAppendCanvasNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class FillAppendCanvasList {

    curr : FillAppendCanvasNode = new FillAppendCanvasNode(0)
    dir : number = 1

    draw() {
        this.curr.draw()
    }

    update(cb : Function) {
        this.curr.update(cb)
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }
}

class StageController {

    facl : FillAppendCanvasList = new FillAppendCanvasList()
    animator : Animator = new Animator()

    draw() {
        this.facl.draw()
    }

    handleTap() {
        this.facl.startUpdating(() => {
            this.animator.start(() => {
                this.facl.update(() => {
                    this.animator.stop()
                })
            })
        })
    }
}
