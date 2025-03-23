import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';

const GymNotificationScreen = () => {
  const [notifications, setNotifications] = useState({
    allowAll: true,
    gymMembership: true,
    paymentNotifications: false,
    message: false,
    emailNotifications: true,
    updatesAndVersions: true,
  });

  const toggleSwitch = key => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Push notifications</Text>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.BasilNotification />
          <View>
            <Text style={styles.title}>Allow All Notifications</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={notifications.allowAll ? Colors.white : Colors.gray}
          onValueChange={() => toggleSwitch('allowAll')}
          value={notifications.allowAll}
        />
      </View>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.GymIcon />
          <View>
            <Text style={styles.title}>Gym Subscription</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={notifications.gymMembership ? Colors.white : Colors.gray}
          onValueChange={() => toggleSwitch('gymMembership')}
          value={notifications.gymMembership}
        />
      </View>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.Payment />
          <View>
            <Text style={styles.title}>Payment notifications</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={
            notifications.paymentNotifications ? Colors.white : Colors.gray
          }
          onValueChange={() => toggleSwitch('paymentNotifications')}
          value={notifications.paymentNotifications}
        />
      </View>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.Messages />
          <View>
            <Text style={styles.title}>Message</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={notifications.message ? Colors.white : Colors.gray}
          onValueChange={() => toggleSwitch('message')}
          value={notifications.message}
        />
      </View>
      <Text style={styles.heading}>Push notifications</Text>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.OuiEmail />
          <View>
            <Text style={styles.title}>Email notifications</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={
            notifications.emailNotifications ? Colors.white : Colors.gray
          }
          onValueChange={() => toggleSwitch('emailNotifications')}
          value={notifications.emailNotifications}
        />
      </View>
      <View style={styles.notificationItem}>
        <TouchableOpacity style={styles.iconTextContainer}>
          <SVG.Update />
          <View>
            <Text style={styles.title}>Updates and versions</Text>
          </View>
        </TouchableOpacity>
        <Switch
          trackColor={{false: Colors.white, true: Colors.red}}
          thumbColor={
            notifications.updatesAndVersions ? Colors.white : Colors.gray
          }
          onValueChange={() => toggleSwitch('updatesAndVersions')}
          value={notifications.updatesAndVersions}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  heading: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 10,
    fontFamily: Fonts.normal,
  },
  notificationItem: {
    backgroundColor: Colors.darkGray,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontFamily: Fonts.normal,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: Fonts.normal,
  },
});

export default GymNotificationScreen;
