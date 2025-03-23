import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import {useNavigation} from '@react-navigation/native';

const GymJumperScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('$50');

  const plans = [
    {price: '$50', description: 'Billed Monthly'},
    {price: '$550', description: 'Billed Yearly'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Plan</Text>

      {plans.map(plan => (
        <TouchableOpacity
          key={plan.price}
          style={[
            styles.planContainer,
            selectedPlan === plan.price && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan(plan.price)}>
          <View style={styles.planContent}>
            <View>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.description}>{plan.description}</Text>
            </View>
            {selectedPlan === plan.price ? <SVG.Select /> : <SVG.Unselect />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={() => navigation.navigate('Invoice Detail')}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
    fontFamily: Fonts.normal,
  },
  planContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPlan: {
    borderColor: 'red',
    borderWidth: 2,
  },
  planContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  price: {
    fontSize: 24,
    fontFamily: Fonts.normal,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  backButton: {
    borderColor: 'white',
    borderWidth: 2,
  },
  nextButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GymJumperScreen;
