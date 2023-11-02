import {EventColor} from "calendar-utils";

export const HOST = 'localhost:9000';
export const BASE_URL = `http://${HOST}`;
export const LOGIN_URL = `${BASE_URL}/auth/token`;
export const REGISTER_URL = `${BASE_URL}/auth/signup`;

export const USER_DATA = `${BASE_URL}/user/me`;

export const APARTMENT_URL = `${BASE_URL}/apt`;
export const APT_CREATE = `${APARTMENT_URL}/create`;
export const APT_JOIN = `${APARTMENT_URL}/join`;
export const USER_SOCKET_URL = `ws://${HOST}/ws/user`;
export const GROUP_SOCKET_URL = `ws://${HOST}/ws/group`;


export const {blue, red, yellow}: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
