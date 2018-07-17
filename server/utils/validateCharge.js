// Client sends data to backend that has been validated at client side. Here we
// try to detect data that has been tampered with by a malicious user, for
// example, the total cost has been reduced, or some mandatory items have been
// removed, etc.

const getTestTotal = require('./getTestTotal');
const testKids = require('./testKids');
const testMandatory = require('./testMandatory');
// const datasetForTest = require('../utils/datasetForTest');

// invalid data for test
// const {
//   frontendAllKids,
//   frontendAllParents,
//   frontendMedia,
//   frontendFamilyById,
//   frontendTotal,
//   frontendChecked
// } = datasetForTest;

module.exports = ({
  familyId,
  frontendCharge: {
    frontendAllKids,
    frontendAllParents,
    frontendMedia,
    frontendFamilyById,
    frontendTotal,
    frontendChecked
  },
  thisEvent: {
    discountQualifiers,
    standardPrices,
    discountedPrices,
    mandatoryItems,
    familyItems
  }
}) => {
  // console.log('this is validateCharge');
  let chargeErrors = [];

  // check if the kids data from frontend is valid:
  const errorValidKids = testKids({
    allKids: frontendAllKids,
    familyById: frontendFamilyById
  });
  errorValidKids && chargeErrors.push('Kids from frontend not all valid. ');
  // console.log('errorValidKids: ', errorValidKids);
  // console.log('frontendAllKids: ', frontendAllKids);
  // console.log('frontendFamilyById: ', frontendFamilyById);
  // console.log('chargeErrors (after validKids check): ', chargeErrors);

  // check if the total price calculated by frontend is correct
  const testTotal = getTestTotal({
    familyId,
    frontendAllKids,
    frontendTotal,
    frontendFamilyById,
    frontendChecked,
    discountQualifiers,
    standardPrices,
    discountedPrices
  });
  testTotal.errorTotal &&
    chargeErrors.push(
      'Mismatch total price calculated by frontend vs calculated by backend. '
    );
  // console.log('testTotal.errorTotal: ', testTotal.errorTotal);
  // console.log('chargeErrors (after total check): ', chargeErrors);

  // test if all mandatory items have been selected (selected by 'family' for
  // the familyItems, selected by every Kids for the other items)
  const errorMandatoryItems = testMandatory({
    familyId,
    checked: frontendChecked,
    mandatoryItems,
    familyItems,
    allKids: frontendAllKids
  });
  errorMandatoryItems &&
    chargeErrors.push("Some of the mandatory items haven't been selected. ");
  // console.log('errorMandatoryItems: ', errorMandatoryItems);
  // console.log('chargeErrors (after mandatory check): ', chargeErrors);

  // TODO test if kidGrades match classGrades

  // TODO get eventId from payload -> check that event is opened for registration -> eventName

  // TODO
  // ( test if kids fulfill the classGrades conditions) && (error.wrongGrade)
  // ( test if event is open for booking) && (error.closedEvent = true)
  // (chargeTotal !== exportData.total) && (error.totalMismatch = true)
  // !!error && "There was a problem with your order. We couldn't complete your registration to this event. Your credit card hasn't been charged. You can try again or contact xxx for suport. We are sorry for the inconvenience."
  // log the error.

  return { chargeErrors, applyDiscount: testTotal.applyDiscount };
};
