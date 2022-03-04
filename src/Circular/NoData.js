import React from 'react';
import {View, Text} from 'react-native';
import {Loader} from '../components/Loader';
export default class Nodata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({Loader: false});
    }, 2800);
  }
  render() {
    if (this.state.Loader) {
      return <Loader loadinf={this.state.Loader ? true : false} />;
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: 'red'}}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
