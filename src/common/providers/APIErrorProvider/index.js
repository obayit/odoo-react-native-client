import React, { useState, useCallback } from 'react';
import { INVALID_MOBILE_VERIFICATION } from '../../api/remote_errors';

export const actions = {
  sessionInvalid: 'session_invalid',
  updateRequired: 'update_required',
}

export const APIErrorContext = React.createContext({
  error: null,
  addError: (message, options) => {},
  removeError: () => {},
});

export default function APIErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const removeError = () => {
    setError(null);
  }

  const addError = (message, options) => { 
    if(options && options.errorCode === INVALID_MOBILE_VERIFICATION){
      // mobile verification error doesn't need a modal
      return;
    }
    if(!error){
      // FIXME: only show the first error to the user! or show multiple errors!
      setError({ message, options });
    }
  }

  const contextValue = {
    error,
    addError: useCallback((message, options) => addError(message, options), []),
    removeError: useCallback(() => removeError(), [])
  };

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  );
}
