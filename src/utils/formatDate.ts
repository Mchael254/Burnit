export const formatDateTimeWithTZ = (date: string) => {
    return `${date}T00:00:00+03:00`;
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr); 

  return date.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
   
  });
};
