// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// build receipt data out of stripeReceipt and database data
// TODO beware that from here on `stripeReceipt.status` can be 'succeeded' or not
const allKidsAndParents = [].concat(family.allKids, family.allParents);
const allKidsFamilyParents = [familyId].concat(allKidsAndParents);

family = await Family.findOne({ familyId });

// TODO rename users (the extract from database) to usersArray, to avoid mix up format (array vs object)

users = await User.find({ id: { $in: allKidsAndParents } }); // [{id, firstName, familyName, kidGrade},{},...]

const normalizedUsers = users.reduce((obj, thisUser) => {
  obj[thisUser.id] = thisUser;
  return obj;
}, {});

// TODO add familyId to the normalizedUsers, to avoid bug when looking up info about the familyItems

// console.log('users: ', users);
// console.log('normalizedUsers: ', normalizedUsers);
// normalized state

// TODO try get registrations directly through a (nested) database query
// const registrations = await Asso.find({
//   userId: { $in: allKidsAndParents }
// });
const applicablePrice = ({
  itemId,
  discountedPrices,
  standardPrices,
  applyDiscount
}) => (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]);

thisAsso = await Asso.findOne({ id: 'a0' });

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
    family.allParents.map(thisParentId =>
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

let publicReceipt = {
  paymentOption,
  assoName: thisAsso.name,
  mergedFamilyName,
  familyId,
  users: normalizedUsers, // [{firstName, familyName, kidGrade},{},...]
  allKids: family.allKids,
  allParents: family.allParents,
  addresses: family.addresses,
  primaryEmail,
  familyMedia: family.familyMedia,
  photoConsent: family.photoConsent,
  eventName,
  paymentOption,
  paymentReference,
  datesToPay: thisEvent.installmentDates,
  bankReference: thisAsso.bankReference[0],
  installmentsQuantity:
    paymentOption !== 'creditCard' ? thisEvent.installments * 1 : 1,
  chequeOrder: thisAsso.chequeOrder,
  chequeCollection: thisAsso.chequeCollection,
  total: validatedTotal,
  livemode:
    paymentOption === 'creditCard' ? stripeReceipt.livemode : null,
  timeStamp:
    paymentOption === 'creditCard' ? stripeReceipt.created : null,
  currency:
    paymentOption === 'creditCard' ? stripeReceipt.currency : null,
  last4:
    paymentOption === 'creditCard' ? stripeReceipt.source.last4 : null,
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
