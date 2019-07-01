import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput, Button} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {useNavigation} from "react-navigation-hooks";
import moment from "moment";
import * as _ from 'lodash';
import {HOME} from "../../navigation/navigationConstants";
import {commonStyles} from "../../commonStyles";
import {detailStyles} from "./gameDetailsCss";
import {useGlobalState} from "../../../App";
import {hostGameStyles} from "../HostGame/hostGameCss";
import {apiEndPoint, ratings} from "../../constants";

export const GameDetailsScreen = () => {
    const {navigate} = useNavigation();
    const [details, setDetails] = useGlobalState('gameDetails');
    const [profile] = useGlobalState('profile');
    const [token] = useGlobalState('token');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [showRequests, setShowRequest] = React.useState(false);
    const [, updateState] = React.useState();

    const toggleModal = () => {
        setModalVisible(modal => !modal);
    };

    const toggleRequests = () => {
        setShowRequest(request => !request);
    };

    const sendRequest = (isRequest) => {
        const i = _.findIndex(profile.favSports, {_id: details.sportId});
        const body = {
            _id: profile._id,
            name: profile.name,
            selfRatingScore: i !== -1 ? profile.favSports[i].selfRatingScore : null,
            userRatingScore: i !== -1 ? profile.favSports[i].userRatingScore : null,
            message: message
        };
        const url = isRequest ? 'request' : 'unrequest';
        fetch(`${apiEndPoint}/game/${url}?token=${token}&gameId=${details._id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => {
            if (res.status === 200) {
                if (isRequest) {
                    toggleModal();
                    details.requests.push(body);
                }else{
                    const reqI = _.findIndex(details.requests, {_id: body._id});
                    details.requests.splice(reqI, 1);
                }
                setDetails(details);
                getButtons();
                updateState({});
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

    const getButtons = () => {
        let buttons = [];
        if (profile._id !== details.hostId) {
            const requestIndex = _.findIndex(details.requests, {_id: profile._id});
            if (requestIndex === -1) {
                buttons = [{
                    name: 'Request to Join',
                    handler: () => toggleModal(),
                    color: ''
                }];
            } else {
                if (details.requests[requestIndex].isAccepted) {
                    buttons = [{
                        name: 'Leave',
                        color: 'red',
                        handler: () => sendRequest(false)
                    }, {
                        name: 'Message',
                        color: 'green',
                        handler: () => console.log('Message')
                    }]
                } else {
                    buttons = [{
                        name: 'Retract Request',
                        handler: () => sendRequest(false)
                    }];
                }
            }
        } else {
            buttons = [
                {
                    name: 'Edit',
                    handler: () => console.log('edit'),
                    color: 'orange'
                }, {
                    name: 'Requests',
                    handler: () => toggleRequests(),
                    color: 'blue'
                }, {
                    name: 'Message',
                    handler: () => console.log('Message'),
                    color: 'green'
                }, {
                    name: 'Delete',
                    handler: () => console.log('Delete'),
                    color: 'red'
                }];
        }
        return <View style={detailStyles.container}>
            {buttons.map(button => <View style={detailStyles.buttonContainer} key={button.name}>
                <Button title={button.name} onPress={button.handler} color={button.color}/>
            </View>)}
        </View>;
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
                {getButtons()}
            </View>
            {showRequests ? <View style={commonStyles.m10}>
                {details.requests.length === 0 ? <Text>No Requests yet</Text> :
                    details.requests.map(person => {
                        return <View key={person._id}>
                            <Text style={commonStyles.fwbold}>Name: {person.name}</Text>
                            <Text>User Rating: {ratings[person.userRatingScore]}</Text>
                            <Text>Self Rating: {ratings[person.selfRatingScore]}</Text>
                            <Text>Message: {person.message}</Text>
                            {person.isAccepted ? <Button title={'Remove'}/> : <Button title={'Accept'}/>}
                        </View>
                    })}

            </View> : null}
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
                    <Text style={commonStyles.fwbold}>Message to host (optional)</Text>
                    <TextInput
                        style={hostGameStyles.description}
                        multiline={false}
                        onChangeText={input => setMessage(input)}
                    />
                    <Button title={'Send Request'} onPress={() => sendRequest(true)}/>
                </View>
            </Overlay>
        </ScrollView>
    )
};