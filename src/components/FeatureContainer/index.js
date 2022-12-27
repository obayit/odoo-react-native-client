import React from 'react';
import { SafeAreaLayout } from '../safe-area-layout.component';
import ErrorModal from '../ErrorModal';

export function FeatureContainer ({children}) {
  return (
    <SafeAreaLayout>
      <ErrorModal/>
      {children}
    </SafeAreaLayout>
  );
};
