import { Box } from '@mui/material';
import { ResponsiveLine } from '@nivo/line'
import './styles/Global.css';


export default function GalleryLinePlotsContent(){
    // GalleryLinePlotsContent showcases line plotting powered by Nivo

    // helper function to get data for line chart
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
          data.push({
            "x": i,
            "y": y_val,
          })
        }
        return data
      }

    // data for line chart
    const line_data = (modes) => {
    let result = modes.map((mode) => {
        return {
        "id": mode,
        "color": "hsl(291, 70%, 50%)",
        "data": get_data(mode)
        }
    })
    return result
    }

    // line chart from Nivo
    const MyResponsiveLine = ({ line_data }) => (
        <ResponsiveLine
            data={line_data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'X Value',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Y Value',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )

    // content to show for line plot exhibit
    let line_plot_content = <Box className='Box'>
        <Box className='galleryCaption'>
            This exhibit shows sample data plotted in a line chart. It is powered by <a href="https://nivo.rocks/" target='_blank' rel="noreferrer">Nivo</a>.
        </Box>
        <Box className='galleryChart'>
            <MyResponsiveLine line_data={line_data([
                'linear',
                'exponential',
                'sinusoidal',
            ])} />
        </Box>
    </Box>
    return line_plot_content;
}