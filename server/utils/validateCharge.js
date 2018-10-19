// Client sends data to backend that has been validated at client side. Here we
// try to detect data that has been tampered with by a malicious user, for
// example, the total cost has been reduced, or some mandatory items have been
// removed, etc.

// TODO test if kidGrades match classGrades

// TODO get eventId from payload -> check that event is opened for registration -> eventName

// TODO (test if kids fulfill the classGrades conditions) && (error.wrongGrade)
// ( test if event is open for booking) && (error.closedEvent = true)
// (chargeTotal !== exportData.total) && (error.totalMismatch = true)
// !!error && "There was a problem with your order. We couldn't complete your registration to this event. Your credit card hasn't been charged. You can try again or contact xxx for suport. We are sorry for the inconvenience."
// log the error.

// TODO move this to a middleware
// TODO validation: are these validChecked items really part of this event?
// TODO validation: for each of these, validate the file type (boolean, string, etc)
// TODO validation: is the user authorized to register this eventId? Is this
// eventId currently open for registration?
// check that the charge request received from frontend is valid

const InvalidInput = require('../errors/InvalidInput');
const getTestTotal = require('./getTestTotal');
const testKids = require('./testKids');
const testMandatory = require('./testMandatory');

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
    classItems,
    discountedPrices,
    mandatoryItems,
    familyItems
  }
}) => {
  let chargeErrors = [];
  // check if the kids data from frontend is valid:
  const errorValidKids = testKids({
    allKids: frontendAllKids,
    familyById: frontendFamilyById
  });
  errorValidKids && chargeErrors.push('Kids from frontend not all valid.');

  // check if the total price calculated by frontend is correct
  const testTotal = getTestTotal({
    familyId,
    frontendAllKids,
    frontendTotal,
    frontendFamilyById,
    frontendChecked,
    classItems,
    discountQualifiers,
    standardPrices,
    discountedPrices
  });
  testTotal.errorTotal &&
    chargeErrors.push(
      'Mismatch total price calculated by frontend vs calculated by backend.'
    );

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
    chargeErrors.push("Some of the mandatory items haven't been selected.");

  if (chargeErrors.length !== 0) {
    throw new InvalidInput(chargeErrors.join(' '));
  }

  return testTotal.applyDiscount;
};
