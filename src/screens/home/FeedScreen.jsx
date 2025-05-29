import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Video from 'react-native-video';
import Colors from '../../theme/color';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import {useNavigation} from '@react-navigation/native';

const posts = [
  {
    id: '1',
    user: {
      name: 'Norman Hans',
      location: 'Southall, United Kingdom',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    video:
      'https://videos.pexels.com/video-files/7988880/7988880-sd_960_506_25fps.mp4',
    title: 'Jiu Jitsu Training Session held at Castle',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since......',
    tags: ['Gi Training', 'Jiu Jitsu', 'Session'],
    image:
      'https://t3.ftcdn.net/jpg/01/27/09/22/360_F_127092211_76cbMikJKTB6Ms2rDjLGgnsLEOvCLhHI.jpg',
  },
  {
    id: '2',
    user: {
      name: 'Paul Ben',
      location: 'London, United Kingdom',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    video:
      'https://videos.pexels.com/video-files/7045336/7045336-sd_640_360_30fps.mp4',
    title: 'Fundamental Steps to follow as Gi',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since......',
    tags: ['Gi Training', 'Jiu Jitsu', 'Session'],
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi2aW5Uiknoa9Q21LKczr4LVHotZkhMz0M1A&s',
  },
  {
    id: '3',
    user: {
      name: 'Nelson Watson',
      location: 'Newyork, America',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    video:
      'https://videos.pexels.com/video-files/7988986/7988986-sd_960_506_25fps.mp4',
    title: 'Coach announces new update',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since......',
    tags: ['Gi Training', 'Jiu Jitsu', 'Session'],
    image:
      'https://cdn.pixabay.com/photo/2020/04/16/16/21/sunset-5051305_640.jpg',
  },
];

const FeedScreen = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [search, setSearch] = useState(null);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 8,
          paddingHorizontal: 20,
          height: 40,
          gap: 16,
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        <View>
          <TextInput
            value={search}
            placeholder="search"
            onChangeText={setSearch}
            style={styles.search1}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 40,
              top: 20,
            }}>
            <SVG.Voice />
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'absolute', right: 15, top: 20}}>
            <SVG.Search />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <SVG.VectorLine />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={{uri: item.user.avatar}} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  <Text style={styles.userLocation}>{item.user.location}</Text>
                </View>
              </View>

              <TouchableOpacity>
                <SVG.Dots />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setPlayingVideo(item.id)}>
              {playingVideo === item.id ? (
                <Video
                  source={{uri: item.video}}
                  style={styles.videoPlayer}
                  controls
                  resizeMode="contain"
                  autoplay
                />
              ) : (
                <View>
                  <Image source={{uri: item.image}} style={styles.postImage} />
                  <View style={styles.playButton}>
                    <SVG.Play />
                  </View>
                </View>
              )}
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <TouchableOpacity>
                    <SVG.Like />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SVG.Comment />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SVG.Share />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity>
                    <SVG.Download />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>

            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 15,
          right: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Create Post')}>
          <SVG.PlusBold />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
  },
  search1: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    width: wp((340 / 430) * 100),
    height: hp((42 / 919) * 100),
    marginVertical: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 65,
    paddingLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.gray,
    fontSize: 16,
  },

  card: {
    backgroundColor: Colors.darkGray,
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userLocation: {
    color: '#999',
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  postDescription: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 5,
  },
  tag: {
    color: Colors.gray,
    paddingHorizontal: 15,
    borderRadius: 50,
    marginRight: 5,
    fontSize: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingVertical: 6,
  },
});

export default FeedScreen;
