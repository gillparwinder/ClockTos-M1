import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Platform,
  Text,
} from 'react-native';
import ResponsiveSize from '../../config/ResponsiveSize';
import * as Animatable from 'react-native-animatable';
import config from '../../config/config';
class CommonFlatlist extends Component {
  render() {
    return (
      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        scrollEnabled={this.props.scrollEnabled == false ? false : true}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={this.props.refreshing}
            onRefresh={this.props._onRefresh}
          />
        }
        ItemSeparatorComponent={
          Platform.OS !== 'android' &&
          (({highlighted}) => (
            <View
              style={[
                highlighted && {
                  marginLeft: 0,
                },
              ]}
            />
          ))
        }
        bounces={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        style={{
          width: '100%',
        }}
        renderItem={this.props.renderItem}
        data={this.props.data}
        extraData={this.props}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => {
          return (
            !this.props.Loader &&
            !this.props.refreshing && (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[
                  styles.headerNew,
                  {
                    width: '95%',
                    height: 100,
                    //backgroundColor: 'red',
                    alignSelf: 'center',
                  },
                ]}
                transition="backgroundColor">
                <Text
                  style={[
                    styles.headerTextNew,
                    {
                      textTransform: 'none',
                      color: 'black',
                    },
                  ]}>
                  {this.props.message || 'No data available'}
                </Text>
              </Animatable.View>
            )
          );
        }}
      />
    );
  }
}
export default CommonFlatlist;
const styles = StyleSheet.create({
  headerNew: {
    //padding: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  headerTextNew: {
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '400',
    //lineHeight: 24,
    padding: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
});
