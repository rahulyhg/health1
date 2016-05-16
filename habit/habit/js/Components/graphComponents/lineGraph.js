import React from 'react';
import { LineChart } from 'react-d3-basic';

class LineGraph extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    var {margins, chartData, width, height, chartSeries, x, xScale, xLabel, yLabel} = this.props.chartData;
    return(
      <LineChart
          margins= {margins}
          data={chartData}
          width={width}
          height={height}
          chartSeries={chartSeries}
          x={x}
          xScale={xScale}
          xLabel= {xLabel}
          yLabel = {yLabel}
        />
    );
  }
}

export default LineGraph;
