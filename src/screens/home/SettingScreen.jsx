import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import {useAppDispatch} from '../../store/Hooks';
import {clearUser} from '../../Slices/UserSlice';

const SettingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      title: 'Security',
      icon: SVG.Security,
      action: () => navigation.navigate('Security'),
    },
    {
      title: 'Community',
      icon: SVG.Community,
    },
    {
      title: 'Send Your Suggestions',
      icon: SVG.FeedBack,
    },
    {
      title: 'Report Problem',
      icon: SVG.Problem,
    },
    {
      title: 'Rate the App',
      icon: SVG.WhiteStar,
    },
    {
      title: 'Terms & Conditions',
      icon: SVG.Page,
    },
    {
      title: 'Privacy Policy',
      icon: SVG.PrivacyPolicy,
      action: () => navigation.navigate('Privacy Policy'),
    },
  ];

  const handleDelete = () => {
    dispatch(clearUser());
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthStack', params: {screen: 'SignupScreen'}}],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pragraph}>
        The support allows users to seek help, report issues, or provide
        feedback.
      </Text>
      <Text style={styles.label}>find support below</Text>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.menuItem} onPress={item.action}>
              <View style={styles.menuIconText}>
                <item.icon />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <SVG.WhiteRight />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleDelete}>
        <Text style={styles.logoutText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
  },
  pragraph: {
    fontSize: 16,
    color: Colors.litegray,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    color: Colors.litegray,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  menuContainer: {},
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  menuTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 10,
    gap: 10,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  searchInput: {
    color: Colors.gray,
    borderRadius: 8,
    marginHorizontal: 8,
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  listItemText: {
    color: Colors.gray,
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: Colors.yellow,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  pendingText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default SettingScreen;
