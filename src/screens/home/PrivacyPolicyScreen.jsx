import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import Colors from '../../theme/color';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>
        Thank you for using BJJ. Your privacy is important to us, and we are
        committed to protecting your personal information. This Privacy Policy
        explains how we collect, use, and safeguard your data.
      </Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We collect the following types of information when you use our app:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          ▪ Personal Information: Your name, email, phone, and profile details.
        </Text>
        <Text style={styles.listItem}>
          ▪ Training Data: Session logs, goals, and entries.
        </Text>
        <Text style={styles.listItem}>
          ▪ Location Data: GPS data for finding nearby gyms (with permission).
        </Text>
        <Text style={styles.listItem}>
          ▪ Payment Information: Gym subscriptions and transactions.
        </Text>
        <Text style={styles.listItem}>
          ▪ Device Information: IP address, usage, and OS.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.paragraph}>The data we collect is used to:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>▪ Deliver and improve app features.</Text>
        <Text style={styles.listItem}>▪ Customize your experience.</Text>
        <Text style={styles.listItem}>
          ▪ Manage subscriptions and training logs.
        </Text>
        <Text style={styles.listItem}>
          ▪ Send notifications, reminders, and promotional content (with
          consent).
        </Text>
        <Text style={styles.listItem}>
          ▪ Analyze app usage for improvements.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
      <Text style={styles.paragraph}>
        We do not sell or rent your personal data. However, we may share it in
        these cases:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          ▪ With Service Providers: For payments, hosting, and analytics.
        </Text>
        <Text style={styles.listItem}>
          ▪ With Gyms: When subscribing to gym services through the app.
        </Text>
        <Text style={styles.listItem}>
          ▪ Legal Compliance: To comply with legal obligations.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginVertical: 10,
    paddingTop: 5,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 3,
  },
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 2,
  },
});

export default PrivacyPolicyScreen;
