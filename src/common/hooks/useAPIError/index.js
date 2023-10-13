import React, { useContext } from 'react';
import { APIErrorContext } from '../../providers/APIErrorProvider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, selectErrors, addError } from '../../store/authSlice';



export default function useAPIError() {
  const errors = useSelector(selectErrors)
  const error = errors?.length ? errors[errors.length - 1] : false
  const dispatch = useDispatch()
  const addErrorWrapper = (error) => {
    dispatch(addError(error))
  }
  const removeError = () => {
    dispatch(clearErrors)
  }
  return { error, addError: addErrorWrapper, removeError };
}
