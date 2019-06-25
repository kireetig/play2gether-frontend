import {apiEndPoint} from "../constants";

export const getProfileUtil = async (token) => {
    return await fetch(`${apiEndPoint}/user/getProfile?token=${token}`).then(res => res.json());
};