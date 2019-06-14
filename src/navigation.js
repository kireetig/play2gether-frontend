import { createStackNavigator, createAppContainer } from "react-navigation";
import {LoginScreen} from "./components/Login";
import {HomeScreen} from "./components/Home";
import {SignupScreen} from "./components/Signup";

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen
},{
    initialRouteName: 'Login'
});

export default createAppContainer(AppNavigator);