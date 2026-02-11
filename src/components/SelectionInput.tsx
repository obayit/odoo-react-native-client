import React, { useMemo } from 'react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import { Text, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-paper-dropdown';

export default function SelectionInput({ field, data, optionsExtractor, style = undefined, inputProps = undefined, onChangeCallBack = undefined }) {
  const name = field.name;
  const required = Boolean(field.required);
  const label = required ? field.label + ' *' : field.label;

  const methods = useFormContext();
  const {
    field: formField,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields, errors }
  } = useController({ name, control: methods.control })
  // note: should memo dropDownOptions?
  const dropDownOptions = optionsExtractor(data) ?? []

  function setDropdown(value) {
    formField.onChange(value)
    onChangeCallBack && onChangeCallBack(value)
  }

  return (
    <View style={style ?? styles.input}>
      <Dropdown
        error={errors[name]?.message}
        label={label}
        placeholder="Select an Option"
        options={dropDownOptions}
        value={formField.value}
        onSelect={setDropdown}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
})
