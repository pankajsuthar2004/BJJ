import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Colors from '../../theme/color';
import {Fonts} from '../../assets/fonts';
import makeRequest from '../../api/http';
import {EndPoints} from '../../api/config';
import {showToast} from '../../utility/Toast';
import {store} from '../../store/Store';

const InvitationAndApprovalScreen = () => {
  const [email, setEmail] = useState('');
  const [appliedTrainings, setAppliedTrainings] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      showToast({message: 'Please enter an email address.'});
      return;
    }

    const user = store.getState().user?.user;
    if (!user || !user.token) {
      showToast({message: 'You are not logged in. Please login first.'});
      return;
    }

    try {
      await makeRequest({
        endPoint: EndPoints.GymInvitation,
        method: 'POST',
        body: {email: email},
      });

      setEmail('');
      showToast({message: 'Invitation sent successfully!'});
      await fetchInvitations(); // Re-fetch latest invitations
    } catch (error) {
      showToast({message: error?.message || 'An error occurred'});
    }
  };

  const fetchAppliedTraining = async () => {
    const user = store.getState().user?.user;
    if (!user || !user.token) {
      showToast({message: 'You are not logged in. Please login first.'});
      return;
    }

    try {
      const response = await makeRequest({
        endPoint: EndPoints.AppliedTraining,
        method: 'GET',
      });

      const updated = (response || []).map(item => ({
        ...item,
        localStatus: null,
      }));

      setAppliedTrainings(updated);
    } catch (error) {
      showToast({
        message: error?.message || 'Failed to load applied trainings',
      });
    }
  };

  const fetchInvitations = async () => {
    const user = store.getState().user?.user;
    if (!user || !user.token) {
      showToast({message: 'You are not logged in. Please login first.'});
      return;
    }

    try {
      const response = await makeRequest({
        endPoint: EndPoints.Invitations,
        method: 'GET',
      });

      const formatted = (response || []).map(item => ({
        email: item.email,
        status: item.status || 'Invited',
        color: Colors.white,
      }));

      setInvitations(formatted);
    } catch (error) {
      showToast({
        message: error?.message || 'Failed to load invitations',
      });
    }
  };

  const handleTrainingRequest = async (requestId, status) => {
    const user = store.getState().user?.user;
    if (!user || !user.token) {
      showToast({message: 'You are not logged in. Please login first.'});
      return;
    }

    try {
      await makeRequest({
        endPoint: EndPoints.HandleTrainingRequest,
        method: 'POST',
        body: {
          request_id: requestId,
          status: status, // 1 = approved, 2 = declined
        },
      });

      const updatedTrainings = appliedTrainings.map(item =>
        item.id === requestId ? {...item, localStatus: status} : item,
      );

      setAppliedTrainings(updatedTrainings);
      showToast({
        message: `Request ${
          status === 1 ? 'approved' : 'declined'
        } successfully!`,
        type: 'success',
      });
    } catch (error) {
      showToast({message: error?.message || 'Something went wrong'});
    }
  };

  useEffect(() => {
    fetchAppliedTraining();
    fetchInvitations();
  }, []);

  const renderInvitationItem = ({item}) => (
    <View style={styles.invitationItem}>
      <Text style={styles.emailText}>{item.email}</Text>
      <TouchableOpacity
        style={[styles.statusBadge, {backgroundColor: item.color}]}>
        <Text
          style={[
            styles.statusText,
            item.status === 'Invited'
              ? {color: Colors.black}
              : {color: Colors.white},
          ]}>
          {item.status}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderApprovalItem = ({item}) => (
    <View style={styles.approvalItem}>
      <Text style={styles.nameText}>
        {item?.user?.name || item?.user?.email}
      </Text>
      <View style={styles.buttonContainer}>
        {item.localStatus !== 2 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleTrainingRequest(item.id, 2)}>
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>
        )}
        {item.localStatus !== 1 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleTrainingRequest(item.id, 1)}>
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Invitation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor={Colors.white}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendInvitation}>
        <Text style={styles.sendButtonText}>Send Invitation</Text>
      </TouchableOpacity>

      <View style={{gap: 10}}>
        <Text style={styles.label}>Invitation status</Text>
        <FlatList
          data={invitations}
          renderItem={renderInvitationItem}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.label}>Approval Workflow:</Text>
        <FlatList
          data={appliedTrainings}
          renderItem={renderApprovalItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.black,
  },
  label: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.normal,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: Colors.white,
  },
  sendButton: {
    backgroundColor: Colors.red,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  sendButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  invitationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.darkGray,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: Colors.white,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.normal,
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.darkGray,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 16,
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: Colors.green,
  },
  declineButton: {
    backgroundColor: Colors.red,
  },
  actionText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.normal,
  },
});

export default InvitationAndApprovalScreen;
