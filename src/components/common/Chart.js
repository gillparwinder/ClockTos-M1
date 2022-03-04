import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
//const chartConfig = {
//  backgroundColor: 'white',
//  backgroundGradientFrom: '#1E2923',
//  backgroundGradientTo: '#08130D',
//  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
//  style: {
//    borderRadius: 16,
//  },
//};
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
const data = [
  {
    name: 'Seoul',
    population: 21500000,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Toronto',
    population: 2800000,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Beijing',
    population: 527612,
    color: 'red',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'New York',
    population: 8538000,
    color: '#ffffff',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Moscow',
    population: 11920000,
    color: 'rgb(0, 0, 255)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];
export class Chart extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      data,
      width,
      height,
      accessor,
      backgroundColor,
      paddingLeft,
      hasLegend,
      center,
    } = this.props;
    return (
      //<PieChart
      //  data={data}
      //  width={width}
      //  height={height}
      //  chartConfig={chartConfig}
      //  accessor={accessor}
      //  backgroundColor={backgroundColor ? backgroundColor : 'transparent'}
      //  paddingLeft={paddingLeft}
      //  hasLegend={hasLegend}
      //  center={center}
      ///>
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        accessor={accessor}
        backgroundColor={backgroundColor}
        paddingLeft={paddingLeft}
        center={center}
        absolute
        hasLegend={hasLegend}
      />
    );
  }
}
