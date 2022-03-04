import React, { Component } from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CustomHeader } from "./CustomHeader";
import { Loader } from "./Loader";
export default class TermsAndConditions extends Component {
    constructor() {
        super();
        this.state = { Loader: true }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ Loader: false })
        }, 1000);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Loader
                    Loading={this.state.Loader ? true : false}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    <CustomHeader
                        isHome={false}
                        navigation={this.props.navigation}
                    />
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Terms and conditions</Text>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}