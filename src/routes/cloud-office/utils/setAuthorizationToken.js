// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: 'http://localhost:8080/cloudoffice/'
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token_id')}`;

// Also add/ configure interceptors && all the other cool stuff

//instance.interceptors.request...

export default instance;