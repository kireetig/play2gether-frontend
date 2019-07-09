import * as React from 'react';
import {Text, View, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {Card} from "react-native-elements";
import moment from "moment";
import io from 'socket.io-client';
import {commonStyles} from "../../commonStyles";
import {useGlobalState} from '../../../App';
import {apiEndPoint} from "../../constants";
import {TextInput} from "react-native-paper";
import {chatCss} from "./chatCss";
import Icon from 'react-native-vector-icons/FontAwesome';
import {GAMEDETAILS} from "../../navigation/navigationConstants";

let socket;

export const ChatScreen = () => {
    const {navigate} = useNavigation();
    const [token] = useGlobalState('token');
    const [profile] = useGlobalState('profile');
    const [gameDetails] = useGlobalState('gameDetails');
    const [messages, setMessages] = React.useState([]);
    const [typeMessage, setTypeMessage] = React.useState('');
    const [refreshing, setRefresh] = React.useState(false);
    let inputRef = React.useRef('');
    let scrollView = React.useRef('');

    const sendMessage = () => {
        if (typeMessage.length > 0) {
            const msg = JSON.stringify({
                message: typeMessage,
                senderName: profile.name,
                senderId: profile._id,
                timestamp: moment()
            });
            inputRef.clear();
            socket.emit("new message", msg);
        }
    };

    const getMessages = () => {
        setRefresh(true);
        fetch(`${apiEndPoint}/game/message?token=${token}&gameId=${gameDetails._id}&userId=${profile._id}`)
            .then(res => res.json()).then(res => {
                setRefresh(false);
            if (res.status === 200) {
                setMessages(res.result);
            } else {
                navigate('Login');
            }
        });
    };


    React.useEffect(() => {
        socket = io(`${apiEndPoint}?gameId=${gameDetails._id}`);
        getMessages();
        socket.on("game news", (data) => {
            if (data.status === 200) {
                getMessages();
            }
        })
    }, []);

    return (<View style={{flex: 1}}>
        <View style={[chatCss.top]}>
            <TouchableOpacity onPress={() => navigate(GAMEDETAILS)}>
                <Icon style={chatCss.backArrow} name="arrow-left" size={24}/>
            </TouchableOpacity>
            <Text style={[commonStyles.heading, chatCss.w80]}>Game Messages</Text>
        </View>
        <ScrollView
            style={{marginBottom: 100, zIndex: 1, marginTop: 70}}
            ref={ref => scrollView = ref}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getMessages}
                />
            }
            onContentSizeChange={() => {
                scrollView.scrollToEnd({animated: true});
            }}
        >
            {messages.map(message => {
                return (<View key={message._id}>
                    <Card containerStyle={message.senderId === profile._id ? chatCss.userBox : chatCss.normalBox}>
                        <Text style={chatCss.label}>{message.senderName}</Text>
                        <Text>{message.message}</Text>
                    </Card>
                    <Text style={[chatCss.time, message.senderId === profile._id ? chatCss.end : '']}>{
                        moment(message.timestamp).format('LL HH:mm:ss')}
                    </Text>
                </View>)
            })}
        </ScrollView>
        <View style={chatCss.searchSection}>
            <TextInput
                style={chatCss.input}
                placeholder="Message"
                ref={(input) => inputRef = input}
                onSubmitEditing={sendMessage}
                onChangeText={(searchString) => {
                    setTypeMessage(searchString)
                }}
                underlineColorAndroid="grey"
            />
            <TouchableOpacity onPress={sendMessage}>
                <Icon style={chatCss.searchIcon} name="paper-plane" size={24}/>
            </TouchableOpacity>
        </View>
    </View>)
};