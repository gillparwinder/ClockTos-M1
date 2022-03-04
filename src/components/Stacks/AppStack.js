import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Loader} from '../Loader';
import BottomTab from '../BottomTab';
import TermsAndConditions from '../TermsAndConditions';
import Privacy from '../Privacy';
import Support from '../Support';
import SubjectList from '../SubjectList';
import DetailScreenMenu from '../DetailScreenMenu';
import TimeTable from '../TimeTable';
import Attendance from '../Attendance';
import AttendanceSemWise from '../AttendanceSemWise';
import Result from '../Result';
import ResultCam from '../ResultCam';
import Library from '../Library';
import {CustomButton} from '../common/Button';
import {CustomImage} from '../common/customImage';
import DrawerScreen from '../Drawer';
import StaffSideAttendance from '../StaffSideAttendance';
import StaffSideAttendanceDetail from '../StaffSideAttendanceDetail';
import PhotoAttendance from '../PhotoAttendance';
import Circular from '../../Circular/Circular';
import CircularList from '../../Circular/CircularList';
import CircularStep2 from '../../Circular/CircularStep2';
import CircularStep3 from '../../Circular/CircularStep3';
import Nodata from '../../Circular/NoData';
import Notifications from '../Notifications';
import OnlineClasses from '../OnlineClasses';
import NotificationDetails from '../NotificationDetails';
import {NotificationAlert} from '../NotificatonAlert';
import {CustomImageSubjects} from '../common/CustomImageSubject';
import StaffInternalMark from '../StaffInternalMark';
import StaffInternalMarkDetail from '../StaffInternalMarkDetail';
import Youtube from '../YouTubePlayer/Youtube';
import StudentFace from '../../face/StudentFace/StudentFace';
import StudentDetailScreen from '../../face/StudentDetailScreen';
import CapturePhotos from '../../face/CapturePhotos';
import FeedbackDetail from '../FeedbackDetail';
import PayOnline from '../PayOnline/PayOnline';
import Payment from '../PayOnline/Payment';
import MyPerformance from '../My Performance/MyPerformance';
import CommonFlatlist from '../common/CommonFlatList';
import TimeTableToday from '../TimeTableToday';
import TimeTableWeekly from '../TimeTableWeekly';
import TimeTableCam from '../TimeTableCam';
import TimeTableUniversity from '../TimeTableUniversity';
import SubjectsDetails from '../SubjectDetails';
import Profile from '../Profile';
import BottomTabHomeScreen from '../BottomTabHomeScreen';
import HomeScreen from '../HomeScreen';
import Feedback from '../Feedback';
import ResultDetails from '../ResultDetails';
import Performance from '../My Performance/Performance';
import Test from '../Test';
import StaffSubjectList from '../StaffSubjectList';
import StaffSubjectsDetail from '../StaffSubjectsDetail';
import Dashboard from '../Dashboard';
import BlockBoxSelf from '../BlockBox/BlockBoxSelf';
import BlockBoxOther from '../BlockBox/BlockBoxOther';

const navOptionHandler = () => ({
  headerShown: false,
});
const StudentStack = createStackNavigator();

const StudentDetailScreenStack = () => {
  return (
    <StudentStack.Navigator>
      <StudentStack.Screen
        name="FaceRegister"
        component={StudentDetailScreen}
        options={navOptionHandler}
      />
      <StudentStack.Screen
        name="CapturePhoto"
        component={CapturePhotos}
        options={navOptionHandler}
      />
    </StudentStack.Navigator>
  );
};
const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      statusBarAnimation="slide"
      //initialRouteName="Dashboard"
      drawerContent={(props) => <DrawerScreen {...props} />}
      //  drawerContent={() => <CustomDrawerContent/>}
    >
      <Drawer.Screen
        name="BottomTabHomeScreen"
        component={BottomTabHomeScreen}
        options={navOptionHandler}
      />

      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={navOptionHandler}
      />
    </Drawer.Navigator>
  );
}
const StackPayOnline = createStackNavigator();
function PayOnlineStack() {
  return (
    <StackPayOnline.Navigator mode="modal" initialRouteName="PayOnline">
      <StackPayOnline.Screen
        name="PayOnline"
        component={PayOnline}
        options={navOptionHandler}
      />
      <StackPayOnline.Screen
        name="Payment"
        component={Payment}
        options={navOptionHandler}
      />
    </StackPayOnline.Navigator>
  );
}
const StackPerformance = createStackNavigator();
function PerformanceStack() {
  return (
    <StackPerformance.Navigator mode="modal" initialRouteName="MyPerformance">
      <StackPerformance.Screen
        name="MyPerformance"
        component={MyPerformance}
        options={navOptionHandler}
      />
      <StackPerformance.Screen
        name="Performance"
        component={Performance}
        options={navOptionHandler}
      />
    </StackPerformance.Navigator>
  );
}
const StackHome2 = createStackNavigator();
export default function AppStack() {
  return (
    <StackHome2.Navigator initialRouteName="Drawer">
      <StackHome2.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Loader"
        component={Loader}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="BottomTab"
        component={BottomTab}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Privacy"
        component={Privacy}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Support"
        component={Support}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="SubjectList"
        component={SubjectList}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="DetailScreenMenu"
        component={DetailScreenMenu}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TimeTable"
        component={TimeTable}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Attendance"
        component={Attendance}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="AttendanceSemWise"
        component={AttendanceSemWise}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Result"
        component={Result}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="ResultCam"
        component={ResultCam}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Library"
        component={Library}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CustomButton"
        component={CustomButton}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CustomImage"
        component={CustomImage}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="DrawerScreen"
        component={DrawerScreen}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffSideAttendance"
        component={StaffSideAttendance}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffSideAttendanceDetail"
        component={StaffSideAttendanceDetail}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="PhotoAttendance"
        component={PhotoAttendance}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Circular"
        component={Circular}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CircularList"
        component={CircularList}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CircularStep2"
        component={CircularStep2}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CircularStep3"
        component={CircularStep3}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Nodata"
        component={Nodata}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Notifications"
        component={Notifications}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="OnlineClasses"
        component={OnlineClasses}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="NotificationDetails"
        component={NotificationDetails}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="NotificationAlert"
        component={NotificationAlert}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CustomImageSubjects"
        component={CustomImageSubjects}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffInternalMark"
        component={StaffInternalMark}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffInternalMarkDetail"
        component={StaffInternalMarkDetail}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Youtube"
        component={Youtube}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StudentFace"
        component={StudentFace}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="FaceRegister"
        component={StudentDetailScreen}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CapturePhoto"
        component={CapturePhotos}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Feedback"
        component={Feedback}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="FeedbackDetail"
        component={FeedbackDetail}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="PayOnlineStack"
        component={PayOnlineStack}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="PerformanceStack"
        component={PerformanceStack}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="CommonFlatlist"
        component={CommonFlatlist}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TimeTableToday"
        component={TimeTableToday}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TimeTableWeekly"
        component={TimeTableWeekly}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TimeTableCam"
        component={TimeTableCam}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="TimeTableUniversity"
        component={TimeTableUniversity}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="SubjectsDetails"
        component={SubjectsDetails}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Profile"
        component={Profile}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="ResultDetails"
        component={ResultDetails}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffSubjectList"
        component={StaffSubjectList}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="StaffSubjectsDetail"
        component={StaffSubjectsDetail}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="BlockBoxSelf"
        component={BlockBoxSelf}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="BlockBoxOther"
        component={BlockBoxOther}
        options={navOptionHandler}
      />
      <StackHome2.Screen
        name="Dashboard"
        component={Dashboard}
        options={navOptionHandler}
      />
    </StackHome2.Navigator>
  );
}
