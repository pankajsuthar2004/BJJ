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
import {useAppDispatch} from '../../store/Hooks';
import {clearUser} from '../../Slices/UserSlice';
import AppLoader from '../../components/AppLoader';
import {hp} from '../../utility/ResponseUI';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showGymList, setShowGymList] = useState(false);
  const [isGymPending, setIsGymPending] = useState(true);
  const [selectedGym, setSelectedGym] = useState('');
  const [selectedGymId, setSelectedGymId] = useState(null);
  const [gymData, setGymData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gymDataList, setGymDataList] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useAppDispatch();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GetProfile,
        method: 'GET',
      });
      setUserData(response);
      setSelectedGymId(response?.selected_gym);
    } catch (error) {
      console.log('Fetch Profile Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigation]);

  useEffect(() => {
    fetchActiveGym();
    fetchGymList();
  }, [selectedGymId]);

  const fetchActiveGym = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GymHistory,
        body: {status: 1},
        method: 'POST',
      });
      setGymDataList(response);
      const matchedGym = response.find(gym => gym.gym_id === selectedGymId);
      if (matchedGym) {
        setSelectedGym(matchedGym.gym_name);
      }
    } catch (error) {
      console.log('Gym fetch error', error);
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

  const updateSelectedGym = async gymId => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.UpdateSelectedGym,
        method: 'POST',
        body: {gym_id: gymId?.toString()},
      });
      if (response?.success) {
        showToast({
          message: response?.message || 'Gym updated successfully',
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: error?.message || 'Failed to update gym',
        type: 'error',
      });
    }
  };

  const handleSelectGym = async gym => {
    setSelectedGym(gym?.gym_name);
    setSelectedGymId(gym?.gym_id);
    setShowGymList(false);
    await updateSelectedGym(gym?.gym_id);
    await fetchData();
  };

  const goToEditProfile = () => {
    navigation.navigate('Edit Profile');
  };

  const confirmLogout = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);

  const handleLogOut = async () => {
    setShowLogoutModal(false);
    try {
      setLoading(true);
      await makeRequest({
        endPoint: EndPoints.Logout,
        method: 'POST',
      });
    } catch (error) {
      showToast({message: 'Logout failed', type: 'error'});
    } finally {
      setLoading(false);
      dispatch(clearUser());
      navigation.reset({
        index: 0,
        routes: [{name: 'AuthStack', params: {screen: 'LoginScreen'}}],
      });
    }
  };

  const getFullImageUri = () => {
    if (!userData?.image) return null;
    return userData.image.startsWith('http')
      ? userData.image
      : `https://bjj.beepr.us/${userData.image}`;
  };

  const menuItems = [
    {
      title: 'Notifications',
      icon: SVG.Notification,
      action: () => navigation.navigate('Notifications'),
    },
    ...(gymDataList?.length
      ? [
          {
            title: selectedGym,
            icon: SVG.GymIcon,
            action: () => setShowGymList(prev => !prev),
            isPending: isGymPending,
          },
        ]
      : []),
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileContainer}>
          {loading && <AppLoader loading={loading} />}
          <View>
            <Image
              source={
                getFullImageUri() ? {uri: getFullImageUri()} : IMAGES.BigProfile
              }
              style={{height: hp(14), width: hp(14), borderRadius: hp(20)}}
            />
          </View>
          <TouchableOpacity style={{position: 'absolute', left: 85, top: 95}}>
            <SVG.Camera />
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.profileName}>{userData?.name}</Text>
            <Text style={styles.profileEmail}>{userData?.email}</Text>
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
                {gymDataList.map(item => (
                  <TouchableOpacity
                    style={styles.listItem}
                    key={item?.gym_name}
                    onPress={() => handleSelectGym(item)}>
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
                        <Text style={styles.listItemText}>
                          {item?.gym_name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <SVG.LogOutIcon />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleLogOut}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingHorizontal: 10,
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
  menuSubtitle: {fontSize: 12, color: Colors.gray},
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
  listItemText: {color: Colors.white, fontSize: 12},
  statusBadge: {
    backgroundColor: Colors.green,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: {color: Colors.white, fontSize: 14, fontWeight: 'bold'},
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButtonConfirm: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.gray,
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
  },
});

export default ProfileScreen;
