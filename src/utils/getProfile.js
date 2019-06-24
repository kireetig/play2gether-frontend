import {apiEndPoint} from "../constants";

let data = null;

export const getProfileUtil = async (token) => {
    if (data) {
        return data;
    } else {
        data = await fetch(`${apiEndPoint}/user/getProfile?token=${token}`).then(res => res.json());
        return data;
    }
};