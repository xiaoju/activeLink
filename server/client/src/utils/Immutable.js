// https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#updating-an-item-in-an-array
// Updating one item in an array can be accomplished by using Array.map,
// returning a new value for the item we want to update, and returning the
// existing values for all other items:
export function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      return item;
    }
    return {
      ...item,
      ...action.item
    };
  });
}
