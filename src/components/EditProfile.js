import * as React from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {apiEndPoint} from "../config";
import {Button} from "react-native-elements";
import * as _ from 'lodash';
import SectionedMultiSelect from "react-native-sectioned-multi-select";

export const EditProfileScreen = () => {
    const {navigate} = useNavigation();
    const [user, setUser] = React.useState({});
    const [sports, setSports] = React.useState([]);
    const [selectedSports, setSelectedSports] = React.useState([]);
    const [favSports, setFavSports] = React.useState([]);
    const [rated, setRated] = React.useState(0);
    const [ptoken, setToken] = React.useState(null);
    const [msg, setMsg] = React.useState({message: '', color: 'red'});

    const getProfile = () => {
        const response = AsyncStorage.getItem('playToken');
        response.then(token => {
            setToken(token);
            fetch(`${apiEndPoint}/user/getProfile?token=${token}`).then(res => res.json()).then(res => {
                if (res.status === 403) {
                    AsyncStorage.removeItem('playToken');
                    navigate('Login');
                } else {
                    setUser(res.data);
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
            }).catch(err => console.log(err));
        })
    };

    const getSports = () => {
        fetch(`${apiEndPoint}/sports/get`).then(res => res.json()).then(res => {
            setSports(res.data);
        })
    };

    const onSelectedItemsChange = selectedItems => {
        setSelectedSports(selectedItems);
        const myFav = [];
        selectedItems.forEach(item => {
            const index = _.findIndex(sports, {_id: item});
            myFav.push(sports[index]);
        });
        if (myFav.length < rated) {
            setRated(rate => rate - 1);
        }
        setFavSports(myFav);
    };

    const handleNext = () => {
        fetch(`${apiEndPoint}/user/editProfile?token=${ptoken}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...user,
                favSports: favSports,
                isProfileComplete: true
            }),
        }).then(res => res.json()).then(res => {
            console.log(JSON.stringify(res),res);
            if (res.status === 200) {
                setMsg({message: 'Successfully Updated', color: 'green'});
            } else {
                setMsg({message: res.error, color: 'red'});
            }
        }).catch(err => console.error(err));
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

    React.useEffect(() => {
        getProfile();
        getSports();
        console.log(sports);
    }, []);

    return (<ScrollView style={styles.containerStyle}>
        <Text style={styles.heading}>My Profile</Text>
        <Text style={styles.label}>Name : {user ? user.name : null}</Text>
        <Text style={styles.label}>Email : {user ? user.email : null}</Text>
        <Text style={styles.subHeading}>Favorite Sports</Text>
        {sports.length > 0 ? <SectionedMultiSelect
            items={sports}
            uniqueKey='_id'
            selectText='Select Sports'
            showDropDowns={false}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedSports}
            confirmText={'Select'}
            styles={{selectedItem: {color: 'blue'}}}
            colors={{chipColor: '#0000ff'}}
        /> : null}

        <Text style={styles.subHeading}>Rate yourself</Text>
        <Text> Rate how proficient are you in your favorite sports</Text>
        {favSports.map((sport, index) => {
            return (<View key={sport._id} style={{marginTop: 10}}>
                <Text style={styles.label}> {sport.name} </Text>
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
        <Text style={{color: msg.color, textAlign: 'center', fontSize: 15, marginBottom: 10}}>{msg.message}</Text>
        <Button
            raised
            large
            title={'Update'}
            color={'blue'}
            onPress={handleNext}
            style={styles.button}
            disabled={favSports.length > rated || favSports.length < 1}
            disabledStyle={{backgroundColor: '#ccc'}}
        />
    </ScrollView>)
};

const styles = StyleSheet.create({
    containerStyle: {
        padding: 10,
        paddingBottom: 30,
        marginBottom: 30
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5
    },
    button: {
        marginTop: 20,
        marginBottom: 80
    }
});