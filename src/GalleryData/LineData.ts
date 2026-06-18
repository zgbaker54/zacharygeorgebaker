// generate line data for a Linear, Exponential, and Sinusoidal signals

type Mode = 'linear' | 'exponential' | 'sinusoidal';

interface DataPoint {
  x: number;
  y: number | null;
}

interface Series {
  id: string;
  color: string;
  data: DataPoint[];
}

let get_data = (mode: Mode): DataPoint[] => {
  let data: DataPoint[] = []
  for (let i = 0; i < 10; i++){
    let y_val: number | null = null
    if (mode === 'linear'){
      y_val = i
    } else if (mode ==='exponential'){
      y_val = (i / 2) ** 2
    } else if (mode ==='sinusoidal'){
      y_val = Math.sin(i) * 3 + 8
    } else {
      throw new Error(`Undefined mode: ${mode}`)
    }
    data.push({
      "x": i,
      "y": y_val,
    })
  }
  return data
}

export const line_data = (modes: Mode[]): Series[] => {
  let result: Series[] = modes.map((mode: Mode) => {
    return {
      "id": mode,
      "color": "hsl(291, 70%, 50%)",
      "data": get_data(mode)
    }
  })
  return result
}