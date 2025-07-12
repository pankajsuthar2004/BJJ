import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const GymJumperScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {gymId, gymName} = route.params || {};

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!gymId) {
        console.warn('No gym ID provided');
        return;
      }

      try {
        const response = await makeRequest({
          endPoint: EndPoints.GymPlans,
          method: 'POST',
          body: {
            gym_id: gymId,
          },
        });

        setPlans(response?.data || response || []);
      } catch (error) {
        console.error(error);
        showToast({message: 'Failed to fetch plans', type: 'error'});
      }
    };

    fetchPlans();
  }, [gymId]);

  const handleBuyPlan = async () => {
    if (!selectedPlanId) {
      showToast({message: 'Please select a plan', type: 'warning'});
      return;
    }

    try {
      await makeRequest({
        endPoint: EndPoints.BuyPlan,
        method: 'POST',
        body: {
          gym_id: gymId,
          gym_plan_id: selectedPlanId,
        },
      });

      showToast({message: 'Plan purchased successfully', type: 'success'});
      navigation.navigate('Invoice Detail');
    } catch (error) {
      console.error(error);
      // showToast({message: 'Failed to purchase plan', type: 'error'});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {gymName ? `${gymName} - Select Your Plan` : 'Select Your Plan'}
      </Text>

      {plans.length === 0 ? (
        <Text style={styles.noPlans}>No plans available for this gym.</Text>
      ) : (
        plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planContainer,
              selectedPlanId === plan.id && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlanId(plan.id)}>
            <View style={styles.planContent}>
              <View>
                <Text style={styles.price}>${plan.price}</Text>
                <Text style={styles.description}>
                  {plan.name} ({plan.duration}{' '}
                  {Number(plan.duration) === 1 ? 'day' : 'days'})
                </Text>
              </View>
              {selectedPlanId === plan.id ? <SVG.Select /> : <SVG.Unselect />}
            </View>
          </TouchableOpacity>
        ))
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleBuyPlan}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  noPlans: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
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
    marginTop: 10,
    marginBottom: 50,
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
