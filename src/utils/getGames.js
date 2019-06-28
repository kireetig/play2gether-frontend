import {apiEndPoint} from "../constants";
import moment from "moment";

export const getGamesUtil = async (token) => {
    return await fetch(`${apiEndPoint}/game/get?token=${token}&currentDate=${moment()}`).then(res => res.json())
};