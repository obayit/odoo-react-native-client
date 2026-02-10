import React from 'react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import { useLabelStyle } from '../../hooks/useLabelStyle';
import { InputWrapper } from '../InputWrapper';
import { Text, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function TextInputInner({ name, style, label, inputProps, onChangeCallBack, onBlurCallBack, labelStyle, field }) {
  label = required ? label + ' *' : label;
  let required = false;
  if (field) {
    name = field.name;
    required = field.required;
    label = field.label;
  }

  const methods = useFormContext();
  const {
    field: formField,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields, errors }
  } = useController({ name, control: methods.control })

  return (
    <InputWrapper name={name} childStyle={style} errors={errors}>
      <TextInput
        label={label}
        value={formField.value}
        onChangeText={value => {
          formField.onChange(value);
          onChangeCallBack && onChangeCallBack(value)
        }}
        onBlur={e => {
          formField.onBlur();
          onBlurCallBack && onBlurCallBack(formField.value)
        }}
        style={style ?? styles.input}
        {...inputProps}
      />
    </InputWrapper>
  )
}

// export const ConnectForm = ({ children }) => {
//     const methods = useFormContext();
//     // NOTE: passing methods this way causes unnecessary rerenders, see the official react-hook-form docs for how to optimize this if needed
//     return children({ ...methods });
// };

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
})
