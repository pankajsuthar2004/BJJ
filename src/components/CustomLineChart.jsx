import React from 'react';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Colors from '../theme/color';

const screenWidth = Dimensions.get('window').width;

const CustomLineChart = ({chartData}) => {
  const labels = chartData?.labels ?? [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  const datasets =
    Array.isArray(chartData?.datasets) && chartData.datasets.length > 0
      ? chartData.datasets.map(ds => ({
          data: Array.isArray(ds?.data) ? ds.data : [0, 0, 0, 0, 0, 0, 0],
          color: ds?.color,
        }))
      : [{data: [0, 0, 0, 0, 0, 0, 0]}];

  return (
    <LineChart
      data={{labels, datasets}}
      width={screenWidth - 40}
      height={200}
      chartConfig={{
        backgroundColor: Colors.white,
        backgroundGradientFrom: Colors.white,
        backgroundGradientTo: Colors.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        fillShadowGradient: 'transparent',
        fillShadowGradientOpacity: 0,
        style: {borderRadius: 10},
        propsForDots: {
          r: '0',
          strokeWidth: '5',
          stroke: Colors.red,
        },
      }}
      bezier
      style={{borderRadius: 16}}
    />
  );
};

export default CustomLineChart;
