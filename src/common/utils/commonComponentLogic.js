import React from 'react';
import moment from 'moment';


export function getObjectById(objectList, targetId) {
  // will return an empty object if didn't find the ID
  if (objectList) {
    for (let i = 0; i < objectList.length; i++) {
      if (objectList[i].id === targetId) {
        return objectList[i];
      }
    }
  }
  return {};
}

export function trimTime(datetime) {
  // expected value is like "2020-07-04 14:41:26"
  if (!datetime) {
    return datetime;
  }
  return datetime.split(' ')[0];
}

export function displayDate(datetime) {
  let formattedDate = trimTime(datetime);
  try {
    formattedDate = moment(formattedDate, 'YYYY-MM-DD').format("DD MMM YYYY");
  } catch { }
  return formattedDate;
}

export function displayM2o(value) {
  if (value && value.length === 2) {
    return value[1]
  } else {
    return null
  }
}

export const fLCapital = s => {
  return s ? s.replace(/./, c => c.toUpperCase()) : ''
}

// sauce: https://stackoverflow.com/a/9436948/3557761
export const isString = input => (typeof input === 'string' || input instanceof String)

export const useYupValidationResolver = validationSchema =>
  React.useCallback(async data => {
    try {
      const values = await validationSchema.validate(data, {
        abortEarly: false
      });

      return {
        values,
        errors: {}
      };
    } catch (errors) {
      return {
        values: {},
        errors: errors.inner.reduce(
          (allErrors, currentError) => ({
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? "validation",
              message: currentError.message
            }
          }),
          {}
        )
      };
    }
  },
    [validationSchema]
  );

export function getRtkErrorMessage(error) {
  if (isString(error)) {
    return error
  }
  if (error?.error) {
    return error?.error
  }
  if (error) {
    return error + ''
  }
  return 'Error'
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
