import React from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {hostGameStyles} from "./hostGameCss";
import {commonStyles} from "../../commonStyles";
import {Sports} from "../../components/Sports";
import {AutoComplete} from "../../components/AutoComplete";
import AsyncStorage from '@react-native-community/async-storage';
import {apiEndPoint, tokenName} from "../../constants";
import {getProfileUtil} from "../../utils/getProfile";
import {EDITPROFILE, HOME, LOGIN} from "../../navigation/navigationConstants";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import * as _ from 'lodash';
import {useGlobalState} from '../../../App';

export const HostGameScreen = () => {
    const {navigate} = useNavigation();
    const [selectedSport, setSelectedSport] = React.useState([]);
    const [token, setToken] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const [datePickerVisibility, setDatePickerVisibility] = React.useState(false);
    const [date, setDate] = React.useState(null);
    const [place, setPlace] = React.useState(null);
    const [errMsg, setErrMsg] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [value, update] = useGlobalState('sports');

    const sportChange = selectedItem => {
        setSelectedSport(selectedItem)
    };

    const getPlace = place => {
        setPlace(place);
    };

    const toggleDatePicker = () => {
        setDatePickerVisibility(date => !date);
    };

    const handleDatePicked = date => {
        setDate(date);
    };

    const hostGame = async () => {
        if (selectedSport.length === 0) {
            setErrMsg('Please select a sport');
        } else if (place === null) {
            setErrMsg('Select a Venue');
        } else if (!moment(date).isAfter(moment())) {
            setErrMsg('Select proper game date and time');
        } else if (description.length < 5) {
            setErrMsg('Enter description, like number of players you will accept to join')
        } else {
            const sport = _.find(value, {_id: selectedSport[0]});
            const body = {
                sportName: sport.name,
                sportId: sport._id,
                venue: place.name,
                venueAddress: place.address,
                gameDate: date,
                description: description,
                hostId: profile._id,
                hostName: profile.name,
            };
            await fetch(`${apiEndPoint}/game/host?token=${token}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then(res => res.json()).then(async (res) => {
                if (res.status === 200) {
                    navigate(HOME);
                } else {
                    setErrMsg(res.message);
                }
            }).catch(res => console.error(res));
        }
    };

    React.useEffect(() => {
        AsyncStorage.getItem(tokenName).then(token => {
            getProfileUtil(token).then(res => {
                if (res.status === 200) {
                    setProfile(res.data);
                } else if (res.status === 403) {
                    AsyncStorage.removeItem(tokenName);
                    navigate(LOGIN);
                }
            });
            setToken(token);
        });
    }, []);


    return (<View style={commonStyles.m10}>
        <Text style={commonStyles.heading}>Host A Game</Text>
        <Sports className={hostGameStyles.label} isSingle={true} text={'Select a Sport :'}
                selectedSports={selectedSport}
                onChange={sportChange}/>
        <Text style={hostGameStyles.label}>Venue:</Text>
        <AutoComplete country={profile ? profile.country : ''} setPlace={getPlace}/>
        <Text style={hostGameStyles.label}>Date:</Text>
        {date ? <Text>{moment(date).format('LL HH:mm')}</Text> : null}
        <Button title={'Select Date'} onPress={toggleDatePicker}/>
        <DateTimePicker
            isVisible={datePickerVisibility}
            onConfirm={handleDatePicked}
            onCancel={toggleDatePicker}
            mode={"datetime"}
        />
        <Text style={hostGameStyles.label}>Description: </Text>
        <TextInput
            style={hostGameStyles.description}
            multiline={true}
            numberOfLines={4}
            onChangeText={input => setDescription(input)}
        />
        <Text>Hint: Write how many players you want to join you and cost division if any.</Text>
        <Text style={[commonStyles.errorColor, commonStyles.textCenter, commonStyles.mb10]}>{errMsg}</Text>
        <Button title={'Submit'} color={'#0dc67c'} style={commonStyles.mt10} onPress={hostGame}/>
    </View>)
};