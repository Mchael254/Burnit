export const getExpiryDate = (activePeriod: string): string => {
  try {
    const endDateStr = activePeriod.split(',')[1].slice(0, -1);
    return new Date(endDateStr).toLocaleDateString();
  } catch (error) {
    console.error("Error parsing expiry date:", error);
    return 'Expired';
  }
};

export const isWalletExpired = (activePeriod: string): boolean => {
  try {
    const endDateStr = activePeriod.split(',')[1].slice(0, -1);
    const endDate = new Date(endDateStr);
    const now = new Date();
    return endDate < now;
  } catch (error) {
    console.error("Error checking wallet expiry:", error);
    return true;
  }
};