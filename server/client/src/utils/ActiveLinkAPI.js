import axios from 'axios';
const api = '/api/v1';
const authAPI = '/auth';

// For admin to update the data of several families in one click,
// for example to input the data collected from paper forms.
// payload = { familyData, selectedAsso, selectedEvent}
// familyData = array of FamilyObject
// FamilyObject = {familyId, parents, kids, photoConsent, familyMedia, addresses, registrations}
export const updateMany = payload => axios.put(`${api}/updatemany`, payload);

export const fetchDashboard = () => axios.get(`${api}/dashboard`);

export const requestPasswordReset = email =>
  axios.post(`${authAPI}/createResetToken`, {
    primaryEmail: email
  });

export const localLogin = ({ primaryEmail, password }) =>
  axios.post(`${authAPI}/local`, {
    primaryEmail,
    password
  });
// .catch(
//   error => error
// ({
// console.log('JSON.stringify(error): ', JSON.stringify(error));
// console.log('error.response.status: ', error.response.status);
// console.log('error.response.data: ', error.response.data);

// return {
// status: error.response.status,
// errorMessage: error.reponse.data.message
// })
// );

export const fetchFamily = () => axios.get(`${api}/current_family`);

export const createFamilies = ({ emailsArray, selectedAsso }) =>
  axios.put(`${api}/createFamilies`, {
    emailsArray,
    selectedAsso
  });

export const checkResetToken = token =>
  axios.get(`${authAPI}/checkResetToken/${token}`);

export const resetPassword = ({ resetToken, newPassword }) =>
  axios.post(`${authAPI}/resetPassword/${resetToken}`, {
    password: newPassword
  });
