import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import SVG from '../../assets/svg';
import {hp, wp} from '../../utility/ResponseUI';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        The support allows users to seek help, report issues, or provide
        feedback.
      </Text>
      <Text style={styles.label}>find support below</Text>
      <TouchableOpacity style={styles.btnView}>
        <SVG.Contact />
        <Text style={styles.btnText}>Contact options</Text>
        <SVG.WhiteRight />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnView}>
        <SVG.Question />
        <Text style={styles.btnText}>FAQs</Text>
        <SVG.WhiteRight />
      </TouchableOpacity>
      <TouchableOpacity style={styles.liveView}>
        <SVG.Chat />
        <Text style={styles.liveBtn}>Live Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 15,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.litegray,
  },
  label: {
    fontSize: 20,
    color: Colors.white,
    marginTop: 15,
  },
  btnView: {
    backgroundColor: Colors.darkGray,
    paddingVertical: 15,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.normal,
    flex: 1,
  },
  liveView: {
    backgroundColor: Colors.red,
    width: wp((127 / 430) * 100),
    height: hp((56 / 919) * 100),
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  liveBtn: {
    textAlign: 'center',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
