import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showGymList, setShowGymList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGymPending, setIsGymPending] = useState(true);
  const [selectedGym, setSelectedGym] = useState('Gym with Josh');

  const menuItems = [
    {
      title: 'Notifications',
      icon: SVG.Notification,
      action: () => navigation.navigate('Notifications'),
    },
    {
      title: selectedGym,
      icon: SVG.GymIcon,
      action: () => setShowGymList(prev => !prev),
      isPending: isGymPending,
    },
    {
      title: 'Join New Gym & History',
      icon: SVG.GymIcon,
      action: () => navigation.navigate('Gym History'),
    },
    {
      title: 'Support',
      icon: SVG.Support,
      action: () => navigation.navigate('Support & Help'),
    },
    {
      title: 'Privacy',
      icon: SVG.Privacy,
      action: () => navigation.navigate('Privacy Policy'),
    },
    {
      title: 'Settings',
      icon: SVG.SettingIcon,
      action: () => navigation.navigate('Settings'),
    },
  ];

  const gymDataList = [
    {id: '2', title: 'Gym with Mintoo'},
    {id: '3', title: 'Fitness Fighter'},
    {id: '4', title: 'Body Builder'},
    {id: '5', title: 'Gym with Johny'},
  ];

  useEffect(() => {
    fetchActiveGym();
    fetchGymList();
  }, []);

  const fetchActiveGym = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.ActiveGym,
        method: 'GET',
      });
      if (response?.gymName) {
        setSelectedGym(response.gymName);
        setIsGymPending(response.isPending);
      }
    } catch (error) {
      showToast({message: error.message, type: 'error'});
    }
  };

  const fetchGymList = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GetGym,
        method: 'GET',
      });
      setGymData(response?.gyms || []);
    } catch (error) {
      showToast({message: error.message, type: 'error'});
    }
  };

  const handleSelectGym = gym => {
    setSelectedGym(gym);
    setShowGymList(false);
  };

  const filterData = gymDataList.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const goToEditProfile = () => {
    navigation.navigate('Edit Profile');
  };

  const handleLogOut = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthStack', params: {screen: 'LoginScreen'}}],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileContainer}>
          <View>
            <Image source={IMAGES.BigProfile} />
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.profileName}>Josh Jones</Text>
            <Text style={styles.profileEmail}>joshjones@gmail.com</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={goToEditProfile}>
              <Text style={styles.editProfileText}>edit profile</Text>
              <SVG.IconEdit />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.menuItem} onPress={item.action}>
              <View style={styles.menuIconText}>
                <item.icon />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.title !== selectedGym && (
                    <Text style={styles.menuSubtitle}>
                      Lorem Ipsum, giving information on its
                    </Text>
                  )}
                </View>
                {item.isPending && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                )}
                <SVG.WhiteRight />
              </View>
            </TouchableOpacity>

            {item.title === selectedGym && showGymList && (
              <View style={{marginBottom: 6}}>
                {filterData.map(item => (
                  <TouchableOpacity
                    style={styles.listItem}
                    key={item.id}
                    onPress={() => handleSelectGym(item.title)}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}>
                        <SVG.GymIcon />
                        <Text style={styles.listItemText}>{item.title}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <SVG.LogOutIcon />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  profileHeader: {
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 10,
  },
  editProfileButton: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: Colors.red,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editProfileText: {
    color: Colors.white,
    fontSize: 16,
    marginRight: 5,
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
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
  menuSubtitle: {
    fontSize: 12,
    color: Colors.gray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: 16,
    borderRadius: 8,
    margin: 15,
    gap: 10,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  listItem: {
    backgroundColor: Colors.mediumGray,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
    gap: 5,

    padding: 15,
  },
  listItemText: {
    color: Colors.white,
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: Colors.green,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: Colors.green,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
    color: Colors.white,
    fontSize: 12,
  },
  statusText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default ProfileScreen;
