import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../auth/Login';
import SignUp from '../../auth/SignUp';
import SetMpin from '../../auth/SetMpin';
import GetProfile from '../../auth/GetProfile';
import Otp from '../../auth/Otp';
const StackHome = createStackNavigator();
const navOptionHandler = () => ({
  headerShown: false,
});
export default class AuthStack extends React.Component {
  render() {
    return (
      <StackHome.Navigator initialRouteName="Login">
        <StackHome.Screen
          name="Login"
          component={Login}
          options={navOptionHandler}
        />
        <StackHome.Screen
          name="Otp"
          component={Otp}
          options={navOptionHandler}
        />
        <StackHome.Screen
          name="SignUp"
          component={SignUp}
          options={navOptionHandler}
        />
        <StackHome.Screen
          name="SetMpin"
          component={SetMpin}
          options={navOptionHandler}
        />
        <StackHome.Screen
          name="GetProfile"
          component={GetProfile}
          options={navOptionHandler}
        />
      </StackHome.Navigator>
    );
  }
}
