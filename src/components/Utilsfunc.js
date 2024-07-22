// Function to copy text from innerHTML or input box value to clipboard
export const copyToClipboard = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
      console.error("Element not found");
      return;
  }

  let textToCopy = '';
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      textToCopy = element.value;
  } else {
      textToCopy = element.innerText; // Use innerText for non-editable elements
  }

  try {
      await navigator.clipboard.writeText(textToCopy);
      console.log('Text copied to clipboard!');

  } catch (err) {
      console.error('Failed to copy text:', err);
  }
};

  export const capitalizeFirstLetter = (word) => {
    if (!word) return word; // Return the original word if it's empty or undefined
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const oneMonthValidity = (originalDate) => {
  let date = new Date(originalDate); // Parse string to Date object

  let newMonth = date.getMonth() + 1; // Get next month (0-indexed, 0=January, 11=December)
  let newYear = date.getFullYear();

  if (newMonth > 11) { // Handle December case, move to next year
      newMonth = 0; // January of next year
      newYear += 1;
  }

  date.setFullYear(newYear, newMonth); // Set year and month correctly
  date.setDate(date.getDate()); // Set to the day before in the next month

  // Format the date back into "YYYY-MM-DD" string format
  return date.toISOString().split('T')[0];
}

// --------------------------- formatted date ---------------------------
export const formatDate = (dateString) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month}, ${year}`;
}

export const convertSlotToTimings = (slot) => {
  const slotMap = {
      morning: "06 am to 10 am",
      afternoon: "10 am to 02 pm",
      evening: "02 pm to 06 pm",
      night: "06 pm to 10 pm",
  };
  return slotMap[slot] || slot; // Return the original slot if not found
}


// --------------------------- formatted time ---------------------------
export const  convertToIST = (timestamp) => {
  // Create a Date object from the given timestamp
  const date = new Date(timestamp);

  // Calculate the IST offset in milliseconds (5 hours 30 minutes)
  const ISTOffset = 5.5 * 60 * 60 * 1000;

  // Create a new Date object for IST
  const istDate = new Date(date.getTime() + ISTOffset);

  // Extract hours, minutes, and seconds
  let hours = istDate.getUTCHours();
  let minutes = istDate.getUTCMinutes();
  let seconds = istDate.getUTCSeconds();

  // Format hours, minutes, and seconds to hh:mm:ss
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}