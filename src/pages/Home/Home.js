import * as React from 'react';
import {Text, View, Button, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {Card} from "react-native-elements";
import moment from "moment";
import * as _ from 'lodash';
import {homeStyles} from "./homeCss";
import {GAMEDETAILS, LOGIN} from "../../navigation/navigationConstants";
import {commonStyles} from "../../commonStyles";
import {useGlobalState} from '../../../App';
import {getProfileUtil} from "../../utils/getProfile";
import {getGamesUtil} from "../../utils/getGames";
import {tokenName} from "../../constants";

export const HomeScreen = () => {
    const {navigate} = useNavigation();
    const [games, setGames] = useGlobalState('games');
    const [token] = useGlobalState('token');
    const [, setGameDetails] = useGlobalState('gameDetails');
    const [, setProfile] = useGlobalState('profile');

    const logout = () => {
        AsyncStorage.removeItem('playToken');
        navigate(LOGIN);
    };

    const gotoDetails = item => {
        setGameDetails(item);
        navigate(GAMEDETAILS)
    };

    const getProfile = () => {
        getProfileUtil(token).then(res => {
            if (res.status === 200) {
                setProfile(res.data);
            } else if (res.status === 403) {
                AsyncStorage.removeItem(tokenName);
                navigate(LOGIN);
            }
        });
    };

    const getGames = () => {
        getGamesUtil(token).then(res => {
            if (res.status === 200) {
                const games = _.groupBy(res.data, 'sportName');
                setGames(games);
            } else if (res.status === 403) {
                AsyncStorage.removeItem(tokenName);
                navigate(LOGIN);
            }
        });
    };

    React.useEffect(() => {
        getProfile();
        getGames();
    }, []);

    return (<ScrollView>
        {Object.keys(games).map((key) => {
            const game = games[key];
            return (<View key={key}>
                <Text style={[commonStyles.heading]}>{key}</Text>
                {game.map(item => {
                    return (
                        <TouchableOpacity key={item._id} onPress={() => gotoDetails(item)}>
                            <Card>
                                <Text
                                    style={commonStyles.fwbold}>Date: {moment(item.gameDate).format('LL HH:mm')}</Text>
                                <Text>Venue: {item.venue}</Text>
                                <Text>Hosted by: {item.hostName}</Text>
                            </Card>
                        </TouchableOpacity>)
                })}
            </View>)
        })}

        <Button title={'Logout'} color={'red'}
                onPress={logout}
        />
    </ScrollView>)
};