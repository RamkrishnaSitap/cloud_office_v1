import axios from 'axios';

export default
   axios.create({
      baseURL: 'https://CloudOffice.theironnetwork.org/data/',
      timeout: 2000
   });