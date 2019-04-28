const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const foreColor : string = "#f44336"
const backGroundColor : string = "#bdbdbd"

const updateScale : Function = (scale : number, dir : number) => {
    return scale * dir * scGap
}
