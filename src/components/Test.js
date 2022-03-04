import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {CustomHeader} from './CustomHeader';
import SubjectList from './SubjectList';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <CustomHeader
          isHome={false}
          navigation={this.props.navigation}
          title="Test"
        />
        <SubjectList {...this.props} isReuse={true}></SubjectList>
      </View>
    );
  }
}
