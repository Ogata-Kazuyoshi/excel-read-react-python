export const xDataCreater = ():number[] =>{
    const diff = 0.1
    const max = 3000
    const result:number[] = []
    for (let i = 0; i < max ; i++){
        result.push(diff*i)
    }
    return result
}