import * as React from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {Card} from "react-native-elements";
import moment from "moment";
import {commonStyles} from "../../commonStyles";
import {useGlobalState} from '../../../App';
import {apiEndPoint} from "../../constants";
import {TextInput} from "react-native-paper";
import {chatCss} from "./chatCss";
import Icon from 'react-native-vector-icons/FontAwesome';

export const ChatScreen = () => {
    const {navigate} = useNavigation();
    const [token] = useGlobalState('token');
    const [profile] = useGlobalState('profile');
    const [gameDetails] = useGlobalState('gameDetails');
    const [messages, setMessages] = React.useState([]);
    const [typeMessage, setTypeMessage] = React.useState('');
    let inputRef = React.useRef('');
    let scrollView = React.useRef('');

    const sendMessage = () => {
        fetch(`${apiEndPoint}/game/message?token=${token}&gameId=${gameDetails._id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: typeMessage,
                senderName: profile.name,
                timestamp: moment()
            }),
        }).then(res => res.json()).then(res => {
            console.log(res);
            if(res.status === 200){
                inputRef.clear();
                inputRef.blur();
            }

        });

    };

    React.useEffect(() => {
        fetch(`${apiEndPoint}/game/message?token=${token}&gameId=${gameDetails._id}`)
            .then(res => res.json()).then(res => {
            if (res.status === 200) {
                console.log(res);
                setMessages(res.result);
            } else {
                navigate('Login');
            }
        });
    }, []);

    return (<View style={{flex: 1}}>
        <Text style={commonStyles.heading}>Game Messages</Text>
        <ScrollView style={{marginBottom: 100}}
                    ref={ref => scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
            scrollView.scrollToEnd({animated: true});
        }}>
            {messages.map(message => {
                return <Card key={message._id}>
                    <Text>{message.senderName}</Text>
                    <Text>{message.message}</Text>
                    <Text>{moment(message.timestamp).format('LL HH:mm:ss')}</Text>
                </Card>
            })}
        </ScrollView>
        <View style={chatCss.searchSection}>
            <TextInput
                style={chatCss.input}
                placeholder="Message"
                ref={(input)=> inputRef=input}
                onChangeText={(searchString) => {setTypeMessage(searchString)}}
                underlineColorAndroid="grey"
            />
            <TouchableOpacity onPress={sendMessage}>
            <Icon style={chatCss.searchIcon} name="paper-plane" size={24}/>
            </TouchableOpacity>
        </View>
    </View>)
};