// this is an invalid set of data for testing
module.exports = {
  frontendAllKids: ['k0', 'k1', 'k2', 'k3'],
  frontendAllParents: ['p0', 'p1'],
  frontendMedia: [
    {
      media: 'email',
      value: 'r3wedasczxrfadsxvzc.com',
      tags: ['private']
    },
    {
      media: 'phone',
      value: '21345e643',
      tags: ['private']
    },
    {
      media: 'email',
      value: 'ok@ok.ok',
      tags: ['private']
    },
    {
      media: 'phone',
      value: '1234567',
      tags: ['papa', 'private', 'mobile']
    }
  ],
  frontendFamilyById: {
    k0: {
      id: 'k0',
      firstName: 'a',
      familyName: 'AA',
      kidGrade: 'PS'
    },
    k1: {
      id: 'k1',
      firstName: '',
      familyName: 'BB',
      kidGrade: 'GS'
    },
    k2: {
      id: 'k2',
      firstName: 'c',
      familyName: '',
      kidGrade: 'CE1'
    },
    k3: {
      id: 'k3',
      firstName: 'd',
      familyName: 'DD',
      kidGrade: 'CM2'
    },
    p0: {
      id: 'p0',
      firstName: 'papa',
      familyName: 'PAPA'
    },
    p1: {
      id: 'p1',
      firstName: '',
      familyName: ''
    }
  },
  frontendTotal: 123400,
  frontendChecked: {
    family: ['i2', 'i5'], // i0 is a mandatory family item. i5 is not a family item.
    k0: ['i3'], //
    // k1: ['i0', 'i3'], // i0 is a family item
    k2: ['i2', 'i6'],
    k3: ['i2', 'i6', 'i5', 'i7']
  }
};
