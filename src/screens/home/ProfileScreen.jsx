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
import IMAGES from '../../assets/images';
import Colors from '../../theme/color';
import {useNavigation} from '@react-navigation/native';
import SVG from '../../assets/svg';
import {Fonts} from '../../assets/fonts';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showGymList, setShowGymList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGymPending, setIsGymPending] = useState(true);

  const menuItems = [
    {
      title: 'Notifications',
      icon: SVG.Notification,
      action: () => navigation.navigate('Notifications'),
    },
    {
      title: 'Gym',
      icon: SVG.GymIcon,
      action: () => setShowGymList(!showGymList),
      isPending: isGymPending,
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

  const gymData = [
    {id: '1', title: 'Gym Jumper'},
    {id: '2', title: 'Gym for Fitness'},
    {id: '3', title: 'Gym Wellness'},
    {id: '4', title: 'Gym Jackpot'},
    {id: '5', title: 'Gym with Josh'},
  ];

  const filterData = gymData.filter(item =>
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
                  <Text style={styles.menuSubtitle}>
                    Lorem Ipsum, giving information on its
                  </Text>
                </View>
                {item.isPending && (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                )}
                <SVG.WhiteRight />
              </View>
            </TouchableOpacity>

            {item.title === 'Gym' && showGymList && (
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 8,
                  marginBottom: 8,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={[styles.searchInput, {flex: 1}]}
                    placeholder="gym"
                    placeholderTextColor={Colors.gray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity>
                    <SVG.Voice />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SVG.Search style={{marginHorizontal: 10}} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: Colors.litegray,
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}>
                  {filterData.map(item => (
                    <TouchableOpacity style={styles.listItem} key={item.id}>
                      <Text style={styles.listItemText}>{item.title}</Text>
                      <SVG.SearchIcon />
                    </TouchableOpacity>
                  ))}
                </View>
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
export default ProfileScreen;
