import axios from 'axios';
const api = '/api/v1';

// For admin to update the data of several families in one click,
// for example to input the data collected from paper forms.
// payload = { familyData, selectedAsso, selectedEvent}
// familyData = array of FamilyObject
// FamilyObject = {familyId, parents, kids, photoConsent, familyMedia, addresses, registrations}
export const updateMany = payload => axios.put(`${api}/updatemany`, payload);

export const fetchDashboard = () => axios.get(`${api}/dashboard`);
