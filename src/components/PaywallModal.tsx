import React from 'react';
import { MomoPaymentModal, MomoPaymentModalProps } from './MomoPaymentModal';

// Re-export MomoPaymentModal for backward compatibility and clean alias
export const PaywallModal: React.FC<MomoPaymentModalProps> = (props) => {
  return <MomoPaymentModal {...props} />;
};

export default PaywallModal;
export { MomoPaymentModal };
