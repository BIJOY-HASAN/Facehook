export const getDateDifferenceFromNow = (fromDate) => {
  let difference = new Date().getTime() - new Date(fromDate).getTime();

  difference = difference / 1000;

  // 1. Days calculation
  let dayDifference = Math.floor(difference / 86400);
  difference -= dayDifference * 86400;

  // 2. Hours calculation
  let hourDifference = Math.floor(difference / 3600);
  difference -= hourDifference * 3600;

  // 3. Minutes calculation
  let minuteDifference = Math.floor(difference / 60);
  difference -= minuteDifference * 60;

  let message = "";

  // Days string mapping (1 day vs 2 days)
  if (dayDifference > 0) {
    message = `${dayDifference} day${dayDifference > 1 ? "s" : ""}`;
  }

  // Hours string mapping (1 hour vs 2 hours)
  if (hourDifference > 0) {
    const hourStr = `${hourDifference} hour${hourDifference > 1 ? "s" : ""}`;
    message = message ? `${message} ${hourStr}` : hourStr;
  }

  // Minutes string mapping (1 minute vs 2 minutes)
  if (minuteDifference > 0) {
    const minuteStr = `${minuteDifference} minute${minuteDifference > 1 ? "s" : ""}`;
    message = message ? `${message} ${minuteStr}` : minuteStr;
  }

  // Seconds string mapping (1 second vs 2 seconds)
  const seconds = Math.round(difference);
  if (seconds > 0) {
    const secondStr = `${seconds} second${seconds > 1 ? "s" : ""}`;
    message = message ? `${message} ${secondStr}` : secondStr;
  }

  return message || "just now";
};

// export const getDateDifferenceFromNow = (fromDate) => {
//   let difference = new Date().getTime() - new Date(fromDate).getTime();

//   difference = difference / 1000;
//   let hourDifference = Math.floor(difference / 3600);
//   difference -= hourDifference * 3600;
//   let minuteDifference = Math.floor(difference / 60);
//   difference -= minuteDifference * 60;

//   let message;

//   if (hourDifference > 0) {
//     message = `${hourDifference} hour`;
//   }

//   if (minuteDifference > 0) {
//     message = message
//       ? `${message} ${minuteDifference} minutes`
//       : `${minuteDifference} minutes`;
//   }

//   if (difference) {
//     message = message
//       ? `${message} ${Math.round(difference)} seconds`
//       : `${Math.round(difference)} seconds`;
//   }

//   return message;
// };
