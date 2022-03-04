import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from '../Loader';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
export default class MainNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      Loader: true,
    };
  }
  async componentDidMount() {
    //alert('hit');
    let token = await AsyncStorage.getItem('token');
    //console.log(token);
    this.setState({
      token,
      Loader: false,
    });
  }

  render() {
    if (this.state.Loader) {
      return (
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
      );
    } else {
      if (this.state.token != null) {
        //console.log('appHit');
        return <AppStack />;
      } else {
        //console.log('authHit');
        return <AuthStack />;
      }
    }
  }
}
