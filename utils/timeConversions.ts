export const convert24to12 = (time24: string): string => {
  const [hour, minute] = time24.split(":");
  const hour12 = parseInt(hour) % 12 || 12;
  const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${ampm}`;
};
