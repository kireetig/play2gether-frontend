import * as React from 'react';
import {Text, View, Button, ScrollView} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {homeStyles} from "./homeCss";
import {LOGIN} from "../../navigation/navigationConstants";
import {apiEndPoint, tokenName} from "../../constants";
import {Card} from "react-native-elements";
import moment from "moment";
import {commonStyles} from "../../commonStyles";
import * as _ from 'lodash';

export const HomeScreen = () => {
    const {navigate} = useNavigation();
    const [games, setGames] = React.useState([]);

    const logout = () => {
        AsyncStorage.removeItem('playToken');
        navigate(LOGIN);
    };

    const getGames = () => {
        AsyncStorage.getItem(tokenName).then(token => {
            fetch(`${apiEndPoint}/game/get?token=${token}&currentDate=${moment()}`).then(res => res.json()).then(res => {
                setGames(_.groupBy(res.data, 'sportName'));
            })
        })
    };

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    React.useEffect(() => {
        getGames();
    }, []);

    return (<ScrollView>
        {Object.keys(games).map((key) => {
            const game = games[key];
            return (<View key={key}>
                <Text style={[commonStyles.heading]}>{Capitalize(key)}</Text>
                {game.map(item => {
                    return (<Card key={item._id}>
                        <Text style={commonStyles.fwbold}>Date: {moment(item.gameDate).format('LL HH:mm')}</Text>
                        <Text>Venue: {item.venue}</Text>
                        <Text>Hosted by: {item.hostName}</Text>
                    </Card>)
                })}
            </View>)
        })}

        <Button title={'Logout'} color={'red'}
                onPress={logout}
        />
    </ScrollView>)
};