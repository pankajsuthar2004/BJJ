import React from 'react';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Colors from '../theme/color';

const screenWidth = Dimensions.get('window').width;

const CustomLineChart = ({chartData}) => {
  return (
    <LineChart
      data={chartData}
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
