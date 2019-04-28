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
