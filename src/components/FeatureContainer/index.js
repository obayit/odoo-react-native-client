import React from 'react';
import { SafeAreaLayout } from '../safe-area-layout.component';
import ErrorModal from '../ErrorModal';
import { LoadingOverlay } from '../LoadingOverlay';

export function FeatureContainer({ children, loading }) {
  return (
    <SafeAreaLayout>
      <LoadingOverlay loading={loading} />
      <ErrorModal />
      {children}
    </SafeAreaLayout>
  );
}
