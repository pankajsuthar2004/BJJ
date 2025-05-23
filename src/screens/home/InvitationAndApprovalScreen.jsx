import React, {useState} from 'react';
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

  const invitations = [
    {email: 'paulmason@gmail.com', status: 'Approved', color: Colors.green},
    {email: 'walkermint@gmail.com', status: 'Expired', color: Colors.red},
    {email: 'paulmason@gmail.com', status: 'Invited', color: Colors.white},
    {email: 'joshjanes@gmail.com', status: 'Sent', color: Colors.yellow},
  ];

  const approvalWorkflow = [{name: 'Messy Petch'}, {name: 'Flex Fen'}];

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
      // Make the request without manually adding the Authorization header
      await makeRequest({
        endPoint: EndPoints.GymInvitation,
        method: 'POST',
        body: {email},
      });

      showToast({message: 'Invitation sent successfully!'});
      setEmail('');
    } catch (error) {
      // Error is already handled by makeRequest
      showToast({message: error?.message || 'An error occurred'});
    }
  };

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
      <Text style={styles.nameText}>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.declineButton]}>
          <Text style={styles.actionText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
          <Text style={styles.actionText}>Approve</Text>
        </TouchableOpacity>
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
          data={approvalWorkflow}
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
