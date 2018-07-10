module.exports = ({ checked, mandatoryItems, familyItems, allKids }) => {
  // handle the case if there is no mandatory item:
  // if (!mandatoryItems.length) {errorMandatory = false};

  //  MANDATORY AND FAMILY

  // the items that are both "mandatory" and "family Items":
  const mandatoryFamilyItems = mandatoryItems.filter(item =>
    familyItems.includes(item)
  );
  console.log('mandatoryFamilyItems: ', mandatoryFamilyItems);

  // handle the case where there is no family item that is mandatory
  // if (!mandatoryFamilyItems.length) {
  //   testFamilyMandatory = true;
  // } else {

  // reduce these into true (= each of these also belongs to checked.family, so
  // it's conform to the checked being manatory) or false:
  testFamilyMandatory = mandatoryFamilyItems.reduce(
    (acc, item) => acc && checked.family.includes(item),
    true
  );
  console.log('testFamilyMandatory: ', testFamilyMandatory);

  // MANDATORY AND NON-FAMILY
  // the items that are "mandatory" but not "family Items":
  mandatoryNonFamilyItems = mandatoryItems.filter(
    item => !familyItems.includes(item)
  );
  console.log('mandatoryNonFamilyItems: ', mandatoryNonFamilyItems);

  // TODO handle case where above array is empty (that is when no kid item is mandatory)
  if (!mandatoryNonFamilyItems.length) {
    testNonFamilyMandatory = true;
  } else {
    // for each kid, reduce these into true or false:
    testNonFamilyMandatoryArray = allKids.map(kidId =>
      mandatoryNonFamilyItems.reduce(
        (acc, item) => acc && checked[kidId].includes(item),
        true
      )
    ); // [[true, true, true], [false, true]]
    console.log('testNonFamilyMandatoryArray: ', testNonFamilyMandatoryArray);

    // then we consolidate the results we got for each kid, into one value.
    testNonFamilyMandatory = testNonFamilyMandatoryArray
      .map(smallArray => smallArray.reduce((acc, bool) => acc && bool, true))
      .reduce((acc, bool) => acc && bool, true);
    console.log('testNonFamilyMandatory: ', testNonFamilyMandatory);
  }
  // PUT TOGETHER NON-FAMILY and FAMILY
  const errorMandatory = !testFamilyMandatory || !testNonFamilyMandatory;
  console.log('errorMandatory: ', errorMandatory);

  return errorMandatory;
};
