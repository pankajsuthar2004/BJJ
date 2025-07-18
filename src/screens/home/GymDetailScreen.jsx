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
import {hp} from '../../utility/ResponseUI';
import AppLoader from '../../components/AppLoader';
import {useAppSelector} from '../../store/Hooks';

const GymDetailScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(s => s.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await makeRequest({
          endPoint: EndPoints.GetGym,
          method: 'GET',
        });
        setUserData(response[0]);
      } catch (error) {
        showToast({message: error.message, type: 'error'});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const menuItems = [
    {
      title: 'Notifications',
      icon: SVG.Notification,
      action: () => navigation.navigate('Notification'),
    },
    {
      title: 'Membership Plans',
      icon: SVG.Plan,
      action: () => navigation.navigate('Membership'),
    },
    {
      title: 'Security and Privacy',
      icon: SVG.Privacy,
      action: () => navigation.navigate('Security'),
    },
  ];

  const goToEditProfile = () => {
    navigation.navigate('edit profile');
  };
  console.log(userData);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileContainer}>
          {loading && <AppLoader loading={loading} />}
          <View>
            <Image
              source={
                userData?.image
                  ? {uri: 'https://bjj.beepr.us/' + userData?.image}
                  : IMAGES.BigProfile
              }
              style={{height: hp(14), width: hp(14), borderRadius: hp(20)}}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.profileName}>{user?.user?.gym?.name}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={goToEditProfile}>
              <Text style={styles.editProfileText}>edit profile</Text>
              <SVG.IconEdit style={{marginRight: 10}} />
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
                  <Text style={styles.menuSubtitle}>
                    Lorem Ipsum, giving information on its
                  </Text>
                </View>
                {item.isPending && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                )}
                <SVG.WhiteRight />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
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
    marginHorizontal: 10,
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
export default GymDetailScreen;
