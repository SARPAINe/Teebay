export const convertTimestampToReadableDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10)); // Convert the string timestamp to a number
  const day = date.getUTCDate();
  const month = date.getUTCMonth(); // Months are 0-indexed in JavaScript
  const year = date.getUTCFullYear();

  // Function to determine the ordinal suffix for a day
  const getOrdinalSuffix = (day: number): string => {
    if (day % 10 === 1 && day !== 11) return "st";
    if (day % 10 === 2 && day !== 12) return "nd";
    if (day % 10 === 3 && day !== 13) return "rd";
    return "th";
  };

  const ordinalSuffix = getOrdinalSuffix(day);

  // Convert month number to month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[month];

  return `${day}${ordinalSuffix} ${monthName} ${year}`;
};

export const formatCategory = (input: string): string => {
  // Convert to lowercase and replace underscores with spaces
  const formatted = input
    .toLowerCase()
    .replace(/_/g, " ")
    // Capitalize the first letter of the string
    .replace(/^\w/, (c) => c.toUpperCase());

  return formatted;
};

export const adjustToLocalTime = (date: Date | null, isEndOfDay: boolean) => {
  if (!date) return null;
  const adjustedDate = new Date(date);
  adjustedDate.setHours(
    isEndOfDay ? 23 : 0,
    isEndOfDay ? 59 : 0,
    isEndOfDay ? 59 : 0,
    999
  );
  // Convert to Bangladeshi time (UTC+6)
  adjustedDate.setUTCHours(adjustedDate.getUTCHours() + 6);
  return adjustedDate.toISOString();
};

export const convertEpochToISO = (epoch: number) => {
  const date = new Date(epoch);
  return date.toISOString();
};
