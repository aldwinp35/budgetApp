/**
 * Exlcudes properties from the original data.
 */
const removeExcludes = React.useCallback(
  (data, excludeProps) => {
    let newData = null;

    if (Array.isArray(excludeProps) && excludeProps.length > 0) {
      // Make excludes a set to make each prop unique
      const excludeSet = new Set(excludeProps);

      // Get data without the props specified in the exclude
      newData = data.map((_obj) => {
        let obj = _obj;

        excludeSet.forEach((property) => {
          if (property === 'id') {
            return;
          }
          const setNewProps = deleteProperty(property);
          obj = setNewProps(obj);
        });

        return obj;
      });
    } else if (Array.isArray(data) && data.length > 0) {
      newData = data;
    }

    return newData;
  },
  [options.exclude]
);

/**
 * Remove a property from an object dynamically
 * @param {string} property name
 * @returns a function that returns a new object
 */
function deleteProperty(property) {
  return ({ [property]: _, ...rest }) => rest;
}
