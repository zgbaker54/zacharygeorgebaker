
// generate line data for a Linear, Exponential, and Sinusoidal signals

let get_data = (mode) => {
  let data = []
  for (let i = 0; i < 10; i++){
    let y_val = null
    if (mode === 'linear'){
      y_val = i
    } else if (mode ==='exponential'){
      y_val = (i / 2) ** 2
    } else if (mode ==='sinusoidal'){
      y_val = Math.sin(i) * 3 + 8
    } else {
      throw new Error(`Undefined mode: ${mode}`)
    }
    console.log(mode, y_val)
    data.push({
      "x": i,
      "y": y_val,
    })
  }
  return data
}

export const line_data = (modes) => {
  let result = modes.map((mode) => {
    return {
      "id": mode,
      "color": "hsl(291, 70%, 50%)",
      "data": get_data(mode)
    }
  })
  console.log(result)
  return result
}