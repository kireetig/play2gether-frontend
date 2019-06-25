import * as React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from "react-native-elements";
import * as _ from 'lodash';
import PhoneInput from 'react-native-phone-input'
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {editStyles} from './editProfileCss';
import {commonStyles} from "../../commonStyles";
import {apiEndPoint, tokenName} from "../../constants";
import {LOGIN} from "../../navigation/navigationConstants";
import {Sports} from "../../components/Sports";
import CountryPicker from "react-native-country-picker-modal";
import {getProfileUtil} from "../../utils/getProfile";

export const EditProfileScreen = () => {
    const {navigate} = useNavigation();
    let phone = React.useRef(null);
    let countryPicker = React.useRef(null);
    const [user, setUser] = React.useState({});
    const [selectedSports, setSelectedSports] = React.useState([]);
    const [favSports, setFavSports] = React.useState([]);
    const [rated, setRated] = React.useState(0);
    const [ptoken, setToken] = React.useState(null);
    const [cca2, setCca2] = React.useState('IN');
    const [msg, setMsg] = React.useState({message: '', color: 'red'});
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const getProfile = () => {
        const response = AsyncStorage.getItem(tokenName);
        response.then(token => {
            setToken(token);
            getProfileUtil(token).then(res => {
                if (res.status === 403) {
                    AsyncStorage.removeItem(tokenName);
                    navigate(LOGIN);
                } else {
                    setUser(res.data);
                    setCca2(res.data.country);
                    setPhoneNumber(res.data.phoneNumber);
                    if (res.data.favSports.length) {
                        setFavSports(res.data.favSports);
                        const ids = [];
                        res.data.favSports.forEach(sport => {
                            ids.push(sport._id);
                            setRated(rate => rate + 1);
                        });
                        setSelectedSports(ids);
                    }
                }
            }).catch(err => console.error(err));
        })
    };

    const onSelectedItemsChange = selectedItems => {
        setSelectedSports(selectedItems);
        const myFav = [];
        selectedItems.forEach(item => {
            const index = _.findIndex(favSports, {_id: item});
            if (favSports[index]) {
                myFav.push(favSports[index]);
            } else {
                const i = _.findIndex(sports, {_id: item});
                myFav.push(sports[i]);
            }
        });
        if (myFav.length < rated) {
            setRated(rate => rate - 1);
        }
        setFavSports(myFav);
    };

    const handleNext = () => {
        setMsg({message: '', color: 'red'});
        if (phone.isValidNumber()) {
            fetch(`${apiEndPoint}/user/editProfile?token=${ptoken}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...user,
                    favSports: favSports,
                    isProfileComplete: true,
                    phoneNumber: phone.getValue(),
                    country: cca2
                }),
            }).then(res => res.json()).then(res => {
                if (res.status === 200) {
                    setMsg({message: 'Successfully Updated', color: 'green'});
                    setTimeout(() => {
                        setMsg({message: '', color: 'green'});
                    }, 4000);
                } else {
                    setMsg({message: res.error, color: 'red'});
                }
            }).catch(err => console.error(err));
        } else {
            setMsg({message: 'Please enter valid number', color: 'red'})
        }
    };

    const onRatingChange = (selectedItem, i) => {
        const fav = Object.assign([], favSports);
        fav[i].selfRatingScore = selectedItem[0];
        fav[i].selfRating = ratings[selectedItem[0] - 1].name;
        setFavSports(fav);
        setRated(rate => rate + 1);
    };

    const ratings = [
        {
            name: 'beginner',
            score: 1,
        }, {
            name: 'amateur',
            score: 2,
        }, {
            name: 'intermediate',
            score: 3
        }, {
            name: 'advanced',
            score: 4
        }, {
            name: 'professional',
            score: 5
        }
    ];

    function onPressFlag() {
        countryPicker.openModal()
    }

    const selectCountry = (country) => {
        phone.selectCountry(country.cca2.toLowerCase());
        setCca2(country.cca2);
    };

    React.useEffect(() => {
        getProfile();
    }, []);

    return (
        <View style={editStyles.containerStyle}>
            <ScrollView style={commonStyles.pb20}>
                <Text style={commonStyles.heading}>My Profile</Text>
                <Text style={editStyles.label}>Name : {user ? user.name : null}</Text>
                <Text style={editStyles.label}>Email : {user ? user.email : null}</Text>
                <PhoneInput
                    ref={(ref) => {
                        phone = ref;
                    }}
                    onPressFlag={onPressFlag}
                    initialCountry={cca2.toLowerCase()}
                    value={phoneNumber}
                    style={commonStyles.mt10}
                />
                <CountryPicker
                    ref={(ref) => {
                        countryPicker = ref;
                    }}
                    onChange={(value) => selectCountry(value)}
                    translation='eng'
                    cca2={cca2}
                >
                    <View/>
                </CountryPicker>
                <Text style={editStyles.subHeading}>Favorite Sports</Text>

                <Sports isSingle={false} onChange={onSelectedItemsChange} selectedSports={selectedSports}/>

                <Text style={editStyles.subHeading}>Rate yourself</Text>
                <Text> Rate how proficient are you in your favorite sports</Text>
                {favSports.map((sport, index) => {
                    return (<View key={sport._id} style={commonStyles.mt10}>
                        <Text style={editStyles.label}> {sport.name} </Text>
                        <SectionedMultiSelect
                            items={ratings}
                            uniqueKey='score'
                            single={true}
                            selectText='Select rating'
                            showDropDowns={false}
                            onSelectedItemsChange={(e) => onRatingChange(e, index)}
                            selectedItems={[sport.selfRatingScore]}
                            confirmText={'Select'}
                            styles={{selectedItem: {color: 'blue'}}}
                            colors={{chipColor: '#0000ff'}}
                        />
                    </View>)
                })}
                <Text
                    style={{color: msg.color, textAlign: 'center', fontSize: 15, marginBottom: 10}}>{msg.message}</Text>
                <Button
                    raised
                    large
                    title={'Update'}
                    color={'blue'}
                    onPress={handleNext}
                    style={editStyles.button}
                    disabled={favSports.length > rated || favSports.length < 1}
                    disabledStyle={commonStyles.disabledBgColor}
                />
            </ScrollView>
        </View>)
};