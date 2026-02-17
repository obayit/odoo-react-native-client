import * as yup from "yup";
import { isString, useYupValidationResolver } from '../../utils/commonComponentLogic.js'
import { useForm } from 'react-hook-form';
import { useEffect } from "react";

const fieldBuilder = field => {
  let res = false;
  switch (field.type) {
    case 'integer':
      // IMPLEMENT ME
      raise('unemplemented field type')
      break;

    default:
      res = yup.string();
      break;
  }
  if (field.label) {
    res = res.label(field.label);
  }
  if (field.required) {
    if (isString(field.required)) {
      res = res.required(field.required);
    } else {
      res = res.required();
    }
  }
  if (field.is_email) {
    res = res.email();
  }
  return res
}
export default (fields, options) => {
  options = options ? options : {};
  let record = options.record ? options.record : false;

  let shape = {};
  fields.map(field => shape[field.name] = fieldBuilder(field));
  const yupSchema = yup.object().shape(shape);
  const defaultValues = {};

  // setup default values
  if (record) {
    // value should not be set here, bbecause the record may be loaded after this is initialized
    // FIXME: handle different field types here as being implemented
    // fields.map(field => defaultValues[field.name] = record[field.name] ? record[field.name] : '');
  } else {
    fields.map(field => defaultValues[field.name] = field.defaultValue ? field.defaultValues : '');
  }

  useEffect(() => {
    if (record) {
      fields.map(field => {
        const newValue = field.accessor ? field.accessor(record) : (record[field.name] ?? '')
        const oldValue = formMethods.getValues(field.name)
        if (newValue && !oldValue) {
          formMethods.setValue(field.name, newValue+'')
        }
      });
    }
  }, [record])


  const resolver = useYupValidationResolver(yupSchema);
  const formMethods = useForm({ resolver, defaultValues });
  return {
    formMethods,
  }
}
