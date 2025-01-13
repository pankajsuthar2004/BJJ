import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';

const slides = [
  {
    id: '1',
    title: `Master the Art\nAnytime, Anywhere`,
    description: `From White Belt to Black Belt, We've Got You Covered`,
    image: IMAGES.Pic1,
    btnText: 'Next',
  },
  {
    id: '2',
    title: `Connecting\nPractitioners Worldwide`,
    description: 'Built for the BJJ Community',
    image: IMAGES.Pic2,
    btnText: 'Next',
  },
  {
    id: '3',
    title: `Your Path to\nExcellence Begins Here`,
    description: 'Stay Sharp, Stay Connected',
    image: IMAGES.Pic3,
    btnText: 'Get Start Now',
  },
];

const WelcomeScreen = ({navigation}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const flatListRef = React.useRef();

  const animatedSteppers = React.useRef(
    slides.map(() => new Animated.Value(1)),
  ).current;

  const onBtnHandler = () => {
    if (activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current.scrollToIndex({index: nextIndex, animated: true});
    } else {
      navigation.replace('SignupScreen');
    }
  };

  useEffect(() => {
    animatedSteppers.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === activeIndex ? 1.5 : 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [activeIndex]);

  const renderSlide = ({item}) => (
    <SafeAreaView style={styles.slideContainer}>
      <Image source={item.image} style={styles.image} />
      <Image source={IMAGES.RacBack} style={styles.bottomImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.button} onPress={onBtnHandler}>
          <Text style={styles.buttonText}>{item.btnText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const handleScroll = event => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / wp(100));
    setActiveIndex(pageIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
      />
      <View style={styles.stepContainer}>
        {slides.map((_, stepIndex) => (
          <Animated.View
            key={stepIndex}
            style={[
              styles.stepper,
              stepIndex === activeIndex && styles.activeStepper,
              {transform: [{scale: animatedSteppers[stepIndex]}]},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    width: wp(100),
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: hp((543 / 923) * 100),
    resizeMode: 'contain',
  },
  textContainer: {
    width: wp(100 * (374 / 428)),
    height: hp(100 * (238 / 923)),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: hp(10),
  },
  title: {
    fontSize: hp((37 / 923) * 100),
    fontFamily: Fonts.medium,
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: hp((4 / 923) * 100),
    lineHeight: hp((40 / 923) * 100),
  },
  description: {
    fontSize: hp((14 / 923) * 100),
    fontFamily: Fonts.thin,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: hp((38 / 923) * 100),
  },
  button: {
    backgroundColor: Colors.red,
    borderRadius: wp(2),
    width: '100%',
    height: hp((56 / 923) * 100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    // fontFamily: Fonts.thin,
    color: Colors.white,
    fontWeight: '700',
  },
  bottomImage: {
    width: '100%',
    height: hp((478 / 923) * 100),
    resizeMode: 'cover',
    position: 'absolute',
    bottom: -45,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(100 * (40 / 923)),
    height: hp(100 * (36 / 923)),
  },
  stepper: {
    width: wp(2),
    height: wp(2),
    borderRadius: 100,
    backgroundColor: Colors.gray,
    marginHorizontal: wp(0.5),
    marginBottom: '48%',
  },
  activeStepper: {
    width: wp(10),
    height: wp(2),
    borderRadius: 100,
    backgroundColor: Colors.red,
    marginHorizontal: wp(2.5),
    marginBottom: '48%',
  },
});

export default WelcomeScreen;
