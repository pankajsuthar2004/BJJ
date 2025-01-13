import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const hp = (percentage: string | number) => {
  return heightPercentageToDP(percentage);
};

export const wp = (percentage: string | number) => {
  return widthPercentageToDP(percentage);
};
