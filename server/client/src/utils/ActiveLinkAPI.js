import axios from 'axios';

// For admin to update the data of serveral families in one click,
// for example to input the data collected from paper forms.
// payload = { familyData, selectedAsso, selectedEvent}
// familyData = array of FamilyObject
// FamilyObject = {familyId, parents, kids, photoConsent, familyMedia, addresses, registrations}
export const updateMany = payload => axios.put('/api/v1/updatemany', payload);
