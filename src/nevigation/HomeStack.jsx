import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import LogScreen from '../screens/home/LogScreen';
import RoundScreen from '../screens/home/RoundScreen';
import DashBoardScreen from '../screens/home/DashBoardScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
import EditProfile from '../screens/home/EditProfile';
import PrivacyPolicyScreen from '../screens/home/PrivacyPolicyScreen';
import NotificationScreen from '../screens/home/NotificationScreen';
import SupportScreen from '../screens/home/SupportScreen';
import SettingScreen from '../screens/home/SettingScreen';
import SecurityScreen from '../screens/home/SecurityScreen';
import ChangePassword from '../screens/home/ChangePassword';
import ChangeEmail from '../screens/home/ChangeEmail';
import ChangeNumber from '../screens/home/ChangeNumber';
import TrainingHistory from '../screens/home/TrainingHistory';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import FeedScreen from '../screens/home/FeedScreen';
import PupilsAttendanceScreen from '../screens/home/PupilsAttendanceScreen';
import AttendanceMarkingScreen from '../screens/home/AttendanceMarkingScreen';
import PricingDashboardScreen from '../screens/home/PricingDashboardScreen';
import PupilScreen from '../screens/home/PupilScreen';
import PupilProfileScreen from '../screens/home/PupilProfileScreen';
import PricingManagementScreen from '../screens/home/PricingManagementScreen';
import SVG from '../assets/svg';
import Colors from '../theme/color';
import TimeTableScreen from '../screens/home/TimeTableScreen';
import InvitationAndApprovalScreen from '../screens/home/InvitationAndApprovalScreen';
import ReportsAndInsightsScreen from '../screens/home/ReportsAndInsightsScreen';
import MessageScreen from '../screens/home/MessageScreen';
import GymHistoryScreen from '../screens/home/GymHistoryScreen';
import SubscriptionPlanScreen from '../screens/home/SubscriptionPlanScreen';
import ReceiptScreen from '../screens/home/ReceiptScreen';
import GymProfileScreen from '../screens/home/GymProfileScreen';
import AttendanceViewScreen from '../screens/home/AttendanceViewScreen';
import GymDetailScreen from '../screens/home/GymDetailScreen';
import GymNotificationScreen from '../screens/home/GymNotificationScreen';
import EditGymProfileScreen from '../screens/home/EditGymProfileScreen';
import BillingScreen from '../screens/home/BillingScreen';
import GymJumperScreen from '../screens/home/GymJumperScreen';
import InvoiceDetailScreen from '../screens/home/InvoiceDetailScreen';
import BillingDetailScreen from '../screens/home/BillingDetailScreen';
import {useAppSelector} from '../store/Hooks';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const a = useAppSelector(b => b.user);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
      initialRouteName={'HomeScreen'}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogScreen"
        component={LogScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RoundScreen"
        component={RoundScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DashBoardScreen"
        component={DashBoardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Support & Help"
        component={SupportScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Change Password"
        component={ChangePassword}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Change Email"
        component={ChangeEmail}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Change Number"
        component={ChangeNumber}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Training History"
        component={TrainingHistory}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Create Post"
        component={CreatePostScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Text style={styles.headerTitle}>Feed</Text>,
          headerRight: () => (
            <TouchableOpacity>
              <SVG.Bell />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Pupils Attendance"
        component={PupilsAttendanceScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Attendance Marking"
        component={AttendanceMarkingScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkGray,
          },
        }}
      />
      <Stack.Screen
        name="PricingDashboardScreen"
        component={PricingDashboardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Pupil"
        component={PupilScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Pupil Profile"
        component={PupilProfileScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Pricing Management"
        component={PricingManagementScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Timetable Management"
        component={TimeTableScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Invitation & Approval"
        component={InvitationAndApprovalScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Reports and Insights"
        component={ReportsAndInsightsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkGray,
          },
        }}
      />
      <Stack.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkGray,
          },
        }}
      />
      <Stack.Screen
        name="Gym History"
        component={GymHistoryScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Membership"
        component={SubscriptionPlanScreen}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{
          // headerLeft: () => false,
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkGray,
          },
        }}
      />
      <Stack.Screen
        name="Gym Profile"
        component={GymProfileScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkBrown,
          },
        }}
      />
      <Stack.Screen
        name="Attendance View"
        component={AttendanceViewScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkGray,
          },
        }}
      />
      <Stack.Screen
        name="gym profile"
        component={GymDetailScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Notification"
        component={GymNotificationScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="edit profile"
        component={EditGymProfileScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="billing"
        component={BillingScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Gym Jumper"
        component={GymJumperScreen}
        options={({route}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkBrown,
          },
          headerTitle: route.params?.gymName || 'Gym Jumper',
        })}
      />
      <Stack.Screen
        name="Invoice Detail"
        component={InvoiceDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkBrown,
          },
        }}
      />
      <Stack.Screen
        name="Billing"
        component={BillingDetailScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.darkBrown,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
