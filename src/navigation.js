import { createStackNavigator, createAppContainer } from "react-navigation";
import {LoginScreen} from "./components/Login";
import {HomeScreen} from "./components/Home";
import {SignupScreen} from "./components/Signup";
import {EditProfileScreen} from "./components/EditProfile";

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
    EditProfile: EditProfileScreen
},{
    initialRouteName: 'Login'
});

export default createAppContainer(AppNavigator);