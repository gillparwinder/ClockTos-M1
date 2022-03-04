import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';

export class CustomTabs extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      onPress,
      title,
      textSize,
      color,
      width,
      tab1,
      tab2,
      tab3,
      tab4,
      tab5,
      tab6,
      tab7,
      tab8,
      tab9,
      tab10,
      tab11,
      tab12,
      tab1Width,
      tab2Width,
      tab3Width,
      tab4Width,
      tab5Width,
      tab6Width,
      tab7Width,
      tab8Width,
      tab9Width,
      tab10Width,
      tab11Width,
      tab12Width,
      ActiveTab,
      backgroundColor,
      borderRadius,
      height,
      textColor,
      borderBottomColor,
      scroll,
    } = this.props;
    //console.log(ActiveTab);

    const renderChild = () => {
      return (
        <View
          style={{
            width: width,
            height: height,
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            borderRadius: borderRadius,
            padding: this.props.type == 'button' ? 0 : 5,
            backgroundColor:
              this.props.type == 'button' ? '#EAE8F8' : 'transparent',
            marginVertical: 5,
          }}>
          {tab1 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 0, animated: true});
                onPress(tab1);
              }}
              style={{
                //flex: 1,
                width: tab1Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab1 ? 3 : 0,
                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab1
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab1 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab1 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab1}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab2 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 60, animated: true});
                onPress(tab2);
              }}
              style={{
                width: tab2Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab2 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab2
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab2 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab2 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab2}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab3 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 110, animated: true});
                onPress(tab3);
              }}
              style={{
                width: tab3Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab3 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab3
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab3 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab3 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab3}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab4 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 160, animated: true});
                onPress(tab4);
              }}
              style={{
                width: tab4Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab4 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab4
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab4 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab4 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab4}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab5 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 210, animated: true});
                onPress(tab5);
              }}
              style={{
                width: tab5Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab5 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab5
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab5 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab5 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab5}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab6 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 270, animated: true});
                onPress(tab6);
              }}
              style={{
                width: tab6Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab6 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab6
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab6 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab6 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab6}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab7 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 310, animated: true});
                onPress(tab7);
              }}
              style={{
                width: tab7Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab7 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab7
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab7 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab7 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab7}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab8 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 350, animated: true});
                onPress(tab8);
              }}
              style={{
                width: tab8Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab8 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab8
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab8 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab8 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab8}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab9 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 400, animated: true});
                onPress(tab9);
              }}
              style={{
                width: tab9Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab9 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab9
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab9 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab9 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab9}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab10 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 450, animated: true});
                onPress(tab10);
              }}
              style={{
                width: tab10Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab10 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab10
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab10 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab10 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab10}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab11 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollTo({x: 500, animated: true});
                onPress(tab11);
              }}
              style={{
                width: tab11Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab11 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab11
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab11 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab11 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab11}
              </Text>
            </TouchableOpacity>
          ) : null}
          {tab12 ? (
            <TouchableOpacity
              onPress={() => {
                //this.scrollView.scrollToEnd();
                onPress(tab12);
              }}
              style={{
                width: tab12Width,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: borderRadius,
                borderBottomWidth:
                  this.props.type == 'bottom' && ActiveTab == tab12 ? 3 : 0,

                backgroundColor:
                  this.props.type == 'button' && ActiveTab != tab12
                    ? 'transparent'
                    : backgroundColor,
                borderBottomColor: borderBottomColor,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: textSize,
                    color:
                      ActiveTab == tab12 && this.props.type == 'bottom'
                        ? color
                        : ActiveTab == tab12 && this.props.type == 'button'
                        ? textColor
                        : 'black',
                  },
                ]}>
                {tab12}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    };

    if (scroll) {
      return (
        <ScrollView
          //onScroll={(event) => {
          //  console.log(event.nativeEvent.contentOffset.x);
          //}}
          ref={(scrollView) => (this.scrollView = scrollView)}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {renderChild()}
        </ScrollView>
      );
    }
    return renderChild();
  }
}
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
    paddingHorizontal: 5,
  },
});
