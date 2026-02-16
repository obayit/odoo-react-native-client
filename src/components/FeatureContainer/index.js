import React from 'react';
import { SafeAreaLayout } from '../safe-area-layout.component';
import ErrorModal from '../ErrorModal';
import { LoadingOverlay } from '../LoadingOverlay';

export function FeatureContainer({ children, loading=false, insets=undefined }) {
  // insets: if this is used in a tab screen, set insets='top'
  // if used in stack screen (without bottom navigation) use default insets='vertical'
  return (
    <SafeAreaLayout insets={insets}>
      <ErrorModal />
      <LoadingOverlay loading={loading} />
      {children}
    </SafeAreaLayout>
  );
}
