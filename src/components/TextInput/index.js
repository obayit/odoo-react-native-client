import React from 'react';
import { Input } from '@ui-kitten/components';
import { Controller, useFormContext } from 'react-hook-form';
import { useLabelStyle } from '../../hooks/useLabelStyle';

export default function TextInputInner({ name, style, label, inputProps, onChangeCallBack, onBlurCallBack, required, labelStyle}) {
  label = required ? label + ' *' : label;
  label = useLabelStyle(label, labelStyle);
  return (
    <ConnectForm>
      {({ control }) =>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
          <Input
              label={label}
              value={value}
              style={style}
              onChangeText={value => {
                onChange(value);
                onChangeCallBack && onChangeCallBack(value)
              }}
              onBlur={e => {
                onBlur();
                onBlurCallBack && onBlurCallBack(value)
              }}
              {...inputProps}
          />
          )}
        />
      }
    </ConnectForm>
  );
}

export const ConnectForm = ({ children }) => {
  const methods = useFormContext();
  // NOTE: passing methods this way causes unnecessary rerenders, see the official react-hook-form docs for how to optimize this if needed
  return children({ ...methods });
};
