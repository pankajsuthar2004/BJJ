import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import IMAGES from '../../assets/images';
import SVG from '../../assets/svg';
import Colors from '../../theme/color';
import {hp, wp} from '../../utility/ResponseUI';
import {Fonts} from '../../assets/fonts';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';

const locations = [
  {name: 'Jiu Jitsu Gym', distance: '31 km away'},
  {name: 'Southall, London', distance: '5 km away'},
  {name: 'Newcastle, United Kingdom', distance: '500m away'},
  {name: 'Savoy Hotel London, United Kingdom', distance: '0 km away'},
  {name: 'Madhu’s Restaurant', distance: '8 km away'},
  {name: 'Royal Ascot, London', distance: '12 km away'},
  {name: 'Royal Bakhtar, Harrow', distance: '21 km away'},
  {name: 'Harrow Arts, Sports Valley', distance: '18 km away'},
  {name: 'Cinpex Cinema, United Kingdom', distance: '14 km away'},
  {name: 'Cinpex Cinema, UK', distance: '9 km away'},
];
const users = [
  {name: 'Josh Jones', username: '@joshjones', photos: IMAGES.Photo},
  {name: 'Paul Walker', username: '@paul.walker', photos: IMAGES.Photo1},
  {name: 'Keir Starmer', username: '@keir_Starmer', photos: IMAGES.Photo2},
  {name: 'Joshy Watson', username: '@joshy', photos: IMAGES.Photo3},
  {name: 'William', username: '@willium', photos: IMAGES.Photo4},
  {name: 'Richard Johnson', username: '@rich.johnson', photos: IMAGES.Photo5},
  {name: 'Neeraj Arora', username: '@neeraj', photos: IMAGES.Photo6},
  {name: 'Johny Dep', username: '@johnydep23', photos: IMAGES.Photo7},
  {name: 'Boys Are Back', username: '@boysareback', photos: IMAGES.Photo8},
  {name: 'Manshu', username: '@manshuram', photos: IMAGES.Photo9},
  {name: 'Billion Messy', username: '@billion', photos: IMAGES.Photo10},
  {name: 'Wiliam Paul', username: '@wiliumpaul', photos: IMAGES.Photo11},
];
const friendsList = [
  {id: 1, name: 'Josh Jones', username: '@joshjones', photos: IMAGES.Photo},
  {id: 2, name: 'Paul Walker', username: '@paul.walker', photos: IMAGES.Photo1},
  {
    id: 3,
    name: 'Keir Starmer',
    username: '@keir_Starmer',
    photos: IMAGES.Photo2,
  },
  {id: 4, name: 'Joshy Watson', username: '@joshy', photos: IMAGES.Photo3},
  {id: 5, name: 'William', username: '@willium', photos: IMAGES.Photo4},
  {
    id: 6,
    name: 'Richard Johnson',
    username: '@rich.johnson',
    photos: IMAGES.Photo5,
  },
  {id: 7, name: 'Neeraj Arora', username: '@neeraj', photos: IMAGES.Photo6},
  {id: 8, name: 'Johny Dep', username: '@johnydep23', photos: IMAGES.Photo7},
  {
    id: 9,
    name: 'Boys Are Back',
    username: '@boysareback',
    photos: IMAGES.Photo8,
  },
  {id: 10, name: 'Manshu', username: '@manshuram', photos: IMAGES.Photo9},
  {id: 11, name: 'Billion Messy', username: '@billion', photos: IMAGES.Photo10},
  {
    id: 12,
    name: 'Wiliam Paul',
    username: '@wiliumpaul',
    photos: IMAGES.Photo11,
  },
];

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['Session', 'Jiu Jitsu', 'Training']);
  const [selectedTags, setSelectedTags] = useState([tags[0]]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [peopleModalVisible, setPeopleModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState('Everyone');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleTagPress = tag => {
    if (selectedTags.includes(tag)) {
      // Prevent unselecting if it's the only selected tag
      if (selectedTags.length === 1) return;
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      // Select multiple tags
      setSelectedTags(prev => [...prev, tag]);
    }
  };
  const handleSelectLocation = location => {
    setSelectedLocation(location);
    setLocationModalVisible(false);
  };

  const handleSelectUser = user => {
    console.log(user);
  };

  const handleUpdate = () => {
    navigation.goBack();
  };
  const toggleFriendSelection = id => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(friend => friend !== id) : [...prev, id],
    );
  };

  const filteredFriends = friendsList.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase()),
  );
  const handleSelectAudience = audience => {
    if (audience === 'Close Friends') {
      setAudienceModalVisible(false);
      setModalVisible(true);
    } else {
      setSelectedAudience(audience);
      setAudienceModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity>
          <Image source={IMAGES.PostProfile} />
        </TouchableOpacity>
        <Text style={styles.username}>Norman Hans</Text>
        <SVG.PostLine />
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.textArea, {textAlignVertical: 'top', paddingTop: 15}]}
        placeholder="Description....."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Select Tags</Text>
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              selectedTags.includes(tag) && styles.selectedTag,
            ]}
            onPress={() => handleTagPress(tag)}>
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.selectedTagText,
              ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity>
          <SVG.RedPlus1 />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Select Media</Text>
      <TouchableOpacity style={styles.fileButton}>
        <Text style={styles.fileButtonText}>Choose Files</Text>
        <SVG.Add />
      </TouchableOpacity>

      <View style={styles.border}></View>
      <View style={{gap: 8}}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setLocationModalVisible(true)}>
          <View style={styles.leftContainer}>
            <SVG.IconLocation />
            <Text style={styles.btnText}>
              {selectedLocation ? selectedLocation.name : 'Add Location'}
            </Text>
          </View>
          <SVG.RightGray />
        </TouchableOpacity>

        <Modal
          visible={locationModalVisible}
          animationType="slide"
          transparent={false}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <SVG.Locations />
              <Text style={styles.modalTitle}>Locations</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.searchInput, {height: 40}]}
                placeholder="Search locations"
                value={search}
                onChangeText={setSearch}
              />
              <SVG.LiteSearch style={styles.searchIcon} />
            </View>
            <FlatList
              data={filteredLocations}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(item)}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationDistance}>{item.distance}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => setPeopleModalVisible(true)}>
          <View style={styles.leftContainer}>
            <SVG.Tag />
            <Text style={styles.btnText}>Tag People</Text>
          </View>
          <SVG.RightGray />
        </TouchableOpacity>

        <Modal
          visible={peopleModalVisible}
          animationType="slide"
          transparent={false}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <SVG.Person />
              <Text style={styles.modalTitle}>Tag People</Text>
              <TouchableOpacity onPress={() => setPeopleModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.searchInput, {height: 40}]}
                placeholder="Search person"
                value={search}
                onChangeText={setSearch}
              />
              <SVG.LiteSearch style={styles.searchIcon} />
            </View>
            <FlatList
              data={filteredUsers}
              keyExtractor={item => item.username}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => handleSelectUser(item)}>
                  <View style={styles.listView}>
                    <View style={styles.userItem}>
                      <Image source={item.photos} />
                    </View>
                    <View>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userUsername}>{item.username}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => setAudienceModalVisible(true)}>
          <View style={styles.leftContainer}>
            <SVG.View />
            <Text style={styles.btnText}>Audience</Text>
          </View>
          <SVG.RightGray />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={audienceModalVisible}
          onRequestClose={() => setAudienceModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setAudienceModalVisible(false)}>
            <View style={styles.modalBackdrop}>
              <View style={styles.audienceModalContainer}>
                <View style={styles.modalHandle} />
                <Text style={styles.audienceTitle}>Audience</Text>
                <Text style={styles.audienceSubtitle}>
                  Who would you like to show your post with
                </Text>

                <TouchableOpacity
                  style={[
                    styles.audienceOption,
                    selectedAudience === 'Everyone',
                  ]}
                  onPress={() => handleSelectAudience('Everyone')}>
                  <View style={styles.audienceOptionContent}>
                    <SVG.EveryOne />
                    <Text style={styles.audienceText}>Everyone</Text>
                  </View>
                  {selectedAudience === 'Everyone' ? (
                    <SVG.Select />
                  ) : (
                    <SVG.Unselect />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.audienceOption,
                    selectedAudience === 'Close Friends',
                  ]}
                  onPress={() => handleSelectAudience('Close Friends')}>
                  <View style={styles.audienceOptionContent}>
                    <SVG.CloseFrnd />
                    <Text style={styles.audienceText}>Close Friends</Text>
                  </View>
                  {selectedAudience === 'Close Friends' ? (
                    <SVG.Select />
                  ) : (
                    <SVG.Unselect />
                  )}
                </TouchableOpacity>

                <Text style={styles.privacyDisclaimer}>Privacy Disclaimer</Text>
                <Text style={styles.privacyDisclaimer1}>
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <SVG.Person />
                <Text style={styles.modalTitle}>Close Friends</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.searchInput, {height: 40}]}
                  placeholder="Search person"
                  value={search}
                  onChangeText={setSearch}
                />
                <SVG.LiteSearch style={styles.searchIcon} />
              </View>

              <FlatList
                data={filteredFriends}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => toggleFriendSelection(item.id)}>
                    <View style={styles.listView}>
                      <Image source={item.photos} />
                      <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userUsername}>{item.username}</Text>
                      </View>
                    </View>
                    <Text>
                      {selectedFriends.includes(item.id) ? (
                        <SVG.SelectTick />
                      ) : (
                        <SVG.UnselectTick />
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
      <View style={{marginVertical: 10}}>
        <CustomButton title="Post Now" onPress={handleUpdate} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  username: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    color: Colors.gray,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.normal,
    marginVertical: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: Colors.black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.litegray,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  textArea: {
    borderRadius: 8,
    width: wp(90),
    height: hp(10),
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.litegray,
    fontSize: 12,
  },
  selectedTag: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  selectedTagText: {
    color: Colors.gray,
  },
  tagText: {
    color: Colors.white,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
    color: Colors.gray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingRight: 35,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: Colors.litegray,
    paddingHorizontal: 15,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  locationItem: {
    paddingVertical: 10,
  },
  locationName: {
    fontSize: 16,
  },
  locationDistance: {
    fontSize: 12,
    color: Colors.gray,
  },
  addTag: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 20,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.litegray,
    marginTop: 20,
    marginBottom: 20,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    width: 140,
    gap: 10,
  },
  fileButtonText: {
    color: Colors.white,
    fontSize: 12,
  },
  btn: {
    backgroundColor: Colors.litegray,
    flexDirection: 'row',
    width: wp(90),
    height: hp(7),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  btnText: {
    fontSize: 16,
  },
  postButton: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.normal,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  userName: {
    fontSize: 16,
  },
  userUsername: {
    fontSize: 12,
    color: Colors.gray,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audienceModalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  audienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  audienceSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts.normal,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  audienceText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
  },
  selectView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  selectedText: {
    color: Colors.black,
  },
  privacyDisclaimer: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    marginTop: 10,
  },
  privacyDisclaimer1: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    backgroundColor: Colors.litegray,
    flexDirection: 'row',
    width: wp(90),
    height: hp(7),
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalContent: {
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  btnText: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginBottom: 10,
  },
  audienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  audienceSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts.normal,
  },
  privacyDisclaimer: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    marginTop: 10,
  },
  privacyDisclaimer1: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  audienceOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default CreatePostScreen;
