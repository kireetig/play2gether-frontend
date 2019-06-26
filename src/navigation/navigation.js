import React from 'react';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from "../pages/Home/Home";
import {SignupScreen} from "../pages/Signup/Signup";
import {EditProfileScreen} from "../pages/EditProfile/EditProfile";
import {HostGameScreen} from "../pages/HostGame/HostGame";
import {EDITPROFILE, HOME, HOSTGAME} from "./navigationConstants";
import {LoginScreen} from "../pages/Login/Login";
import {Text} from "react-native-elements";


const BottonNavigator = createBottomTabNavigator({
    Home: HomeScreen,
    EditProfile: EditProfileScreen,
    HostGame: HostGameScreen
}, {
    defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, horizontal, tintColor}) => {
            const {routeName} = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === HOME) {
                iconName = `ios-home`;
            } else if (routeName === EDITPROFILE) {
                iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            } else if (routeName === HOSTGAME){
                iconName = 'ios-football';
            }
            return <IconComponent name={iconName} size={25} color={tintColor}/>;
        },
        tabBarLabel: ({focused}) => {
            const {routeName} = navigation.state;
            let name;
            if(routeName === HOME){
                name = 'Upcoming';
            }else {
                name = routeName;
            }
            return <Text style={{textAlign: 'center', color: focused?'#0dc67c': 'black'}}>{name}</Text>
        }
    }),
    tabBarOptions: {
        activeTintColor: '#0dc67c',
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