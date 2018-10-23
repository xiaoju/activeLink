// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// build receipt data out of stripeReceipt and database data
// TODO beware that from here on `stripeReceipt.status` can be 'succeeded' or not

const getNormalizedUsers = require('./getNormalizedUsers');
const capitalizeFirstLetter = require('./capitalizeFirstLetter');

const wrapAsync = require('./wrapAsync');

module.exports = wrapAsync(
  async ({
    familyId,
    primaryEmail,
    applyDiscount,
    frontendChecked,
    frontendTotal,
    thisFamily,
    thisAsso,
    thisEvent,
    stripeReceipt,
    userInput,
    newRegisteredEvents
  }) => {
    const {
      eventId,
      eventName,
      discountedPrices,
      standardPrices
    } = thisAsso.eventsById.e0;
    // TODO e0 is hardcoded!

    const paymentOption = userInput.paymentOption;

    const allKidsAndParents = [].concat(
      thisFamily.allKids,
      thisFamily.allParents
    );

    const allKidsFamilyParents = [familyId].concat(allKidsAndParents);

    const normalizedUsers = await getNormalizedUsers(allKidsAndParents);

    const applicablePrice = ({
      itemId,
      discountedPrices,
      standardPrices,
      applyDiscount
    }) => (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]);

    // the classes that have been booked by this family, so far
    const familyRegistrations = allKidsFamilyParents.map(userId => ({
      [userId]: thisAsso.registrations[userId]
    }));

    const itemBeneficiaries = ({ itemId, frontendChecked }) =>
      Object.keys(frontendChecked).filter(userId =>
        frontendChecked[userId].includes(itemId)
      );

    const allPurchasedItems = [
      ...new Set([].concat(...Object.values(frontendChecked)))
    ] // extract all the itemIds from frontendChecked, without duplicates
      .sort((i0, i1) => i0.substring(1) - i1.substring(1)); // sort, ascending, based on the digits in itemId

    purchasedItemsById = allPurchasedItems
      .map(itemId => thisAsso.itemsById[itemId]) // for each of these itemIds,
      // get the item object, here as array of objects.
      .reduce((obj, item) => {
        obj[item.id] = {
          id: item.id,
          name: item.name,
          period: item.period,
          paidPrice: applicablePrice({
            itemId: item.id,
            discountedPrices,
            standardPrices,
            applyDiscount
          }),
          beneficiaries: itemBeneficiaries({
            itemId: item.id,
            frontendChecked
          })
        };
        return obj;
      }, {});
    // convert this array to a normalized object, keeping only the useful properties

    const purchasedVolunteeringItems = thisEvent.volunteeringItems.filter(
      itemId => allPurchasedItems.includes(itemId)
    );
    const purchasedClassItems = thisEvent.classItems.filter(itemId =>
      allPurchasedItems.includes(itemId)
    );

    // extract the family names of all parents from the profile form, filter out
    // doublons, then concatenate string with '-' in between.
    // function capitalizeFirstLetter(thisString) {
    //   return thisString.charAt(0).toUpperCase() + thisString.slice(1);
    // }
    const mergedFamilyName = [
      ...new Set(
        thisFamily.allParents.map(thisParentId =>
          capitalizeFirstLetter(normalizedUsers[thisParentId].familyName)
        )
      )
    ].join('-');
    // console.log('mergedFamilyName: ', mergedFamilyName);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // one receipt is sent to fontEnd (publicReceipt)
    // one receipt is sent per email (emailBody / emailData)
    // one receipt is saved to database

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // put together the publicReceipt
    // TODO all the data in publicReceipt should be pulled from the database,
    // not from the request data, otherwise it will be wrong whenever there was
    // an erorr during database writing.
    const paymentReference = (
      eventId +
      '-' +
      familyId.slice(0, 4) +
      '-' +
      familyId.slice(4, 8)
    ).toUpperCase();
    const publicReceipt = {
      bookedEvents: ['e0'], // TODO for bookedEvents, should add this event
      // to the previous state (pulled from database) of the array,
      // and store into database
      paymentOption,
      assoName: thisAsso.name,
      assoAddress: thisAsso.address,
      assoReferenceNumbers: thisAsso.referenceNumbers,
      mergedFamilyName,
      familyId,
      users: normalizedUsers, // [{firstName, familyName, kidGrade},{},...]
      allKids: thisFamily.allKids,
      allParents: thisFamily.allParents,
      addresses: thisFamily.addresses,
      primaryEmail,
      familyMedia: thisFamily.familyMedia,
      photoConsent: thisFamily.photoConsent,
      eventName,
      paymentReference,
      datesToPay: thisEvent.installmentDates,
      bankReference: thisAsso.bankReference[0],
      installmentsQuantity:
        paymentOption !== 'creditCard' ? thisEvent.installments * 1 : 1,
      chequeOrder: thisAsso.chequeOrder,
      chequeCollection: thisAsso.chequeCollection,
      total: frontendTotal,
      livemode: paymentOption === 'creditCard' ? stripeReceipt.livemode : null,
      timeStamp: paymentOption === 'creditCard' ? stripeReceipt.created : null,
      currency: paymentOption === 'creditCard' ? stripeReceipt.currency : null,
      last4: paymentOption === 'creditCard' ? stripeReceipt.source.last4 : null,
      status: paymentOption === 'creditCard' ? stripeReceipt.status : null,
      chargeId: paymentOption === 'creditCard' ? stripeReceipt.id : null,
      familyRegistrations, // purchased in this order or BEFORE
      applyDiscount,
      allPurchasedItems, // purchased in THIS purchase order // TODO copy to family database with date of purchase, for archive
      purchasedVolunteeringItems,
      purchasedClassItems,
      purchasedItemsById, // purchased in THIS purchase order
      registeredEvents: newRegisteredEvents
    };

    return publicReceipt;
  }
);
