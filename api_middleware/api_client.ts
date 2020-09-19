import axios from 'axios';
import { AsyncStorage } from 'react-native';

const axiosApiInstance = axios.create();

export const config = {
    expoClientId: '260269100580-5m6deds5j5fg0mcktvf6h36ine2ul2m9.apps.googleusercontent.com',
    iosClientId: '260269100580-mjn536bchrjebb4ns97p076t8h1d42sa.apps.googleusercontent.com',
    androidClientId: '260269100580-5vp9bfg6k4erkr5il5che90b63m4gvkv.apps.googleusercontent.com',
};

axiosApiInstance.interceptors.request.use(async function (config) 
    {
        const accessToken = await AsyncStorage.getItem('accessToken');
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    }, function (error) {  
        return Promise.reject(error);
    }
);

axiosApiInstance.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    console.log(error);
      
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        console.log('try refreshing token');
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();  
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
  });


async function refreshAccessToken() {
    const url = 'https://oauth2.googleapis.com/token';
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    const response = await axios.post(url, {
        client_id: config.iosClientId,
        //  client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
    });
    AsyncStorage.setItem('accessToken', response.data.access_token);
    return response.data.access_token;
}

export default axiosApiInstance;