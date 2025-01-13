import Snackbar from 'react-native-snackbar';
import Colors from '../theme/color';
import {Fonts} from '../assets/fonts';

type Props = {
  message: string;
  type?: 'success' | 'error';
};

export const showToast = ({message, type = 'error'}: Props) => {
  setTimeout(() => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: type == 'success' ? Colors.green : Colors.red,
      fontFamily: Fonts.semiBold,
    });
  }, 300);
};
