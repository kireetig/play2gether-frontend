import * as React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {Button} from "react-native-elements";
import * as _ from 'lodash';
import PhoneInput from 'react-native-phone-input'
import MultiSelect from 'react-native-multiple-select';
import {editStyles} from './editProfileCss';
import {commonStyles} from "../../commonStyles";
import {apiEndPoint, ratings} from "../../constants";
import {Sports} from "../../components/Sports";
import CountryPicker from "react-native-country-picker-modal";
import {useGlobalState} from "../../../App";

export const EditProfileScreen = () => {
    let phone = React.useRef(null);
    let countryPicker = React.useRef(null);
    const [selectedSports, setSelectedSports] = React.useState([]);
    const [favSports, setFavSports] = React.useState([]);
    const [rated, setRated] = React.useState(0);
    const [ptoken] = useGlobalState('token');
    const [cca2, setCca2] = React.useState('in');
    const [msg, setMsg] = React.useState({message: '', color: 'red'});
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [sports] = useGlobalState('sports');
    const [profile, setProfile] = useGlobalState('profile');

    const getProfile = () => {
        if (profile.country) {
            setCca2(profile.country.toLowerCase());
            setPhoneNumber(profile.phoneNumber);
        }
        if (profile.favSports.length) {
            setFavSports(profile.favSports);
            const ids = [];
            profile.favSports.forEach(sport => {
                ids.push(sport._id);
                setRated(rate => rate + 1);
            });
            setSelectedSports(ids);
        }
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
            const newProfile = {
                ...profile,
                favSports: favSports,
                isProfileComplete: true,
                phoneNumber: phone.getValue(),
                country: cca2
            };
            fetch(`${apiEndPoint}/user/editProfile?token=${ptoken}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            }).then(res => res.json()).then(res => {
                if (res.status === 200) {
                    setProfile(newProfile);
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
                <Text style={editStyles.label}>Name : {profile ? profile.name : null}</Text>
                <Text style={editStyles.label}>Email : {profile ? profile.email : null}</Text>
                <PhoneInput
                    ref={(ref) => {
                        phone = ref;
                    }}
                    onPressFlag={onPressFlag}
                    initialCountry={cca2}
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
                        <Text style={[editStyles.label]}> {sport.name} </Text>
                        <MultiSelect
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