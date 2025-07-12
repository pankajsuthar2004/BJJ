import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import Video from 'react-native-video';
import Colors from '../../theme/color';
import {hp, wp} from '../../utility/ResponseUI';
import SVG from '../../assets/svg';
import {useNavigation} from '@react-navigation/native';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';

const FeedScreen = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [search, setSearch] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const navigation = useNavigation();

  const fetchPosts = async () => {
    try {
      const response = await makeRequest({
        endPoint: EndPoints.GetPosts,
        method: 'GET',
      });
      if (response) {
        setPosts(response);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };
  const handleLike = async postId => {
    try {
      const res = await makeRequest({
        endPoint: EndPoints.Like,
        method: 'POST',
        body: {post_id: postId},
      });
      showToast({message: 'Post liked', type: 'success'});
    } catch (error) {
      console.log('Like error:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      await makeRequest({
        endPoint: EndPoints.Comment,
        method: 'POST',
        body: {
          post_id: selectedPostId,
          comment: newComment,
        },
      });
      showToast({message: 'Comment added', type: 'success'});
      setNewComment('');
      setCommentModalVisible(false);
    } catch (error) {
      console.log('Comment error:', error);
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      await makeRequest({
        endPoint: `${EndPoints.DeleteComment}/${commentId}`,
        method: 'DELETE',
      });
      showToast({message: 'Comment deleted'});
    } catch (error) {
      console.log('Delete comment error:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 8,
          paddingHorizontal: 10,
          height: 40,
          gap: 16,
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <TextInput
            value={search}
            placeholder="search"
            onChangeText={setSearch}
            style={styles.search1}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 35,
              // top: 20,
            }}>
            <SVG.Voice />
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'absolute', right: 10}}>
            <SVG.Search />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <SVG.VectorLine />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.user?.avatar}}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{item.user?.name}</Text>
                  <Text style={styles.userLocation}>{item.user?.location}</Text>
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
                  <TouchableOpacity onPress={handleLike.bind(null, item.id)}>
                    <SVG.Like />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPostId(item.id);
                      setCommentModalVisible(true);
                    }}>
                    <SVG.Comment />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SVG.Share />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <SVG.Download />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>

            <View style={styles.tagsContainer}>
              {item.tags?.map((tag, index) => (
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

        <Modal
          visible={commentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCommentModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Comment</Text>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                style={styles.commentInput}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddComment}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={styles.cancelButton}>
                <Text style={{color: Colors.red}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingRight: 45,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.black,
  },
  commentInput: {
    height: 80,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  sendButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default FeedScreen;
