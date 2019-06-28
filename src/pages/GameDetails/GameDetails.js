import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput} from 'react-native';
import {Button, Icon, Overlay} from 'react-native-elements'
import {HOME} from "../../navigation/navigationConstants";
import {useNavigation} from "react-navigation-hooks";
import {commonStyles} from "../../commonStyles";
import {detailStyles} from "./gameDetailsCss";
import {useGlobalState} from "../../../App";
import moment from "moment";
import {hostGameStyles} from "../HostGame/hostGameCss";
import {apiEndPoint} from "../../constants";

export const GameDetailsScreen = () => {
    const {navigate} = useNavigation();
    const [details] = useGlobalState('gameDetails');
    const [profile] = useGlobalState('profile');
    const [token] = useGlobalState('token');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const toggleModal = () => {
        setModalVisible(modal => !modal);
    };

    const sendRequest = () => {
        const body = {
            _id: profile._id,
            name: profile.name,
            selfRatingScore: profile.selfRatingScore,
            userRatingScore: profile.userRatingScore,
            message: message
        };
        console.log(body, details._id);
        fetch(`${apiEndPoint}/game/request?token=${token}&gameId=${details._id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => {
            console.log(res);
            if (res.status === 200) {
                toggleModal();
            }
        })
    };

    const openExternalApp = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    'ERROR',
                    'Unable to open: ' + url,
                    [
                        {text: 'OK'},
                    ]
                );
            }
        });
    };

    const openGps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${details.venue}&query_place_id=${details.placeId}`;
        openExternalApp(url);
    };

    return (
        <ScrollView>
            <View style={commonStyles.dFlex}>
                <View style={detailStyles.backArrow}>
                    <Icon
                        name='arrow-left'
                        type='font-awesome'
                        color='#2c2e30'
                        onPress={() => navigate(HOME)}
                    />
                </View>
                <View style={detailStyles.pageHeadingContainer}>
                    <Text style={[commonStyles.heading]}>Game Details</Text>
                </View>
            </View>
            <View style={[commonStyles.m10]}>
                <Text style={[commonStyles.mt10]}>Sport:</Text>
                <Text style={detailStyles.label}>{details.sportName}</Text>
                <Text style={commonStyles.mt10}>Date: </Text>
                <Text style={detailStyles.label}>{moment(details.gameDate).format('LL HH:mm')}</Text>
                <Text style={commonStyles.mt10}>Venue:</Text>
                <Text style={detailStyles.label}>{details.venue}</Text>
                <Text style={commonStyles.mt10}>Address:</Text>
                <TouchableOpacity onPress={openGps}>
                    <Text style={{color: '#0000EE'}}>{details.venueAddress}</Text>
                </TouchableOpacity>
                <Text style={commonStyles.mt10}>Description:</Text>
                <Text style={detailStyles.label}>{details.description}</Text>
                <Text style={commonStyles.mt10}>Hosted by:</Text>
                <Text style={detailStyles.label}>{details.hostName}</Text>
            </View>

            <View style={detailStyles.requestContainer}>
                <Text style={[commonStyles.fwbold]}>Players joining the game</Text>
                {details.requests.map(person => {
                    if (person.isAccepted) {
                        return <Text>{person.name}</Text>
                    }
                })}
            </View>
            <View style={[detailStyles.mt30]}>
                <Button title={'Request to Join'} onPress={toggleModal}/>
            </View>
            <Overlay
                isVisible={modalVisible}
                height={200}
                onRequestClose={() => {
                    toggleModal();
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <Text style={commonStyles.fwbold}>Message to host</Text>
                    <TextInput
                        style={hostGameStyles.description}
                        multiline={false}
                        onChangeText={input => setMessage(input)}
                    />
                    <Button title={'Send Request'} onPress={sendRequest}/>
                </View>
            </Overlay>
        </ScrollView>
    )
};