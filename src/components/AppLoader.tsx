import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import Colors from '../theme/color';

enum LoaderSize {
  large = 'large',
  small = 'small',
}

interface AddLoaderProps {
  type?: 'window' | 'view' | 'none';
  size?: 'small' | 'large';
  loading: boolean;
  color?: string;
}

const AppLoader = ({
  type = 'window',
  size = LoaderSize.large,
  loading = false,
  color = Colors.red,
}: AddLoaderProps) => {
  const Loader = (
    <ActivityIndicator animating={loading} size={size} color={color} />
  );

  let view;
  if (type === 'view') {
    view = <View style={styles.loader}>{Loader}</View>;
  } else if (type === 'window') {
    view = (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>{Loader}</View>
      </Modal>
    );
  } else {
    view = Loader;
  }

  return view;
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  loader: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default AppLoader;
