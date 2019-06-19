import React from 'react';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LoginScreen} from "./components/Login";
import {HomeScreen} from "./components/Home";
import {SignupScreen} from "./components/Signup";
import {EditProfileScreen} from "./components/EditProfile";


const BottonNavigator = createBottomTabNavigator({
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
}, {
    defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, horizontal, tintColor}) => {
            const {routeName} = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === 'Home') {
                iconName = `ios-home`;
                console.log(iconName, focused);
            } else if (routeName === 'EditProfile') {
                iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            }
            return <IconComponent name={iconName} size={25} color={tintColor}/>;
        },
    }),
    tabBarOptions: {
        activeTintColor: '#42f44b',
        inactiveTintColor: 'gray',
        style: {
            backgroundColor: '#D3D3D3',
        },
    }
});

const AppNavigator = createStackNavigator({
    Login: LoginScreen,
    Signup: SignupScreen,
    Home: BottonNavigator
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
});

export default createAppContainer(AppNavigator);