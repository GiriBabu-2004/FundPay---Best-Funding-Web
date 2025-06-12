export const preparePaymentFormData = (payment) => {
  const formData = new FormData();
  formData.append('campaignId', payment.campaignId);
  formData.append('userId', payment.userId);
  formData.append('amount', payment.amount);
  formData.append('screenshot', payment.screenshot); // should be a File object
  return formData;
};
