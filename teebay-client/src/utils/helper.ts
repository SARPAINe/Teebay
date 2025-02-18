export function convertTimestampToReadableDate(timestamp: string): string {
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
}
