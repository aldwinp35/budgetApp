/**
 * Convert string to title case. e.g: Hello World
 * @param {string} title string title
 * @returns {string} string title case
 */
export function toTitleCase(title) {
  const newTitle = title
    .replaceAll('_', ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return newTitle;
}

/**
 * Return value represented in the following date format: dd-M-yyyy.
 * @param {string} value iso format string date.
 * @return {string} string date
 */
export function toDate(value) {
  const d = new Date(value);
  return d.toUTCString().slice(5, -13).replaceAll(' ', '-');
}

/**
 * Return value represented as currency.
 * @param {number | string} value to be represented.
 */
export function toMoney(value) {
  let val = value;

  try {
    if (typeof value === 'string') {
      val = Number(value);
    }

    val = val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  } catch (error) {
    val = 'N/A';
    console.error(`Error details: ${error}`);
  }

  return val;
}

/**
 * Make sure "id" key is required and each key (field) exist in the data.
 * @param obj data object
 * @param keys array of object keys (fields)
 * @returns array of string keys (fields)
 */
export function checkForKeys(obj, keys = null) {
  // Make sure "id" key is required
  let objKeys = Object.keys(obj);
  if (objKeys.indexOf('id') === -1) {
    throw new Error(
      'Missing key or field "id". Each data object should have an "id" key.'
    );
  }

  // Make sure each key (field) exist in the data when keys are provided
  if (keys) {
    if (!Array.isArray(keys)) {
      throw new Error('Keys or fields should be an array.');
    }

    objKeys = keys;
    objKeys.forEach((key) => {
      if (!(key in obj)) {
        throw new Error(
          `Key or field "${key}" doesn't exist in the data object.`
        );
      }
    });
  }

  return objKeys;
}

/**
 * Returns an object to determine if each data field is sorted in ascending or descending order.
 *
 * @param {string} keys array of string object keys
 */
export function getOrderKeys(keys) {
  const orders = {};
  keys.forEach((val) => {
    const order = { ascending: false, name: val };
    orders[val] = order;
  });
  return orders;
}
