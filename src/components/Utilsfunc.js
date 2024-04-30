// Function to copy text from innerHTML or input box value to clipboard
export const copyToClipboard = (elementId) => {
    // Find the element by ID
    const element = document.getElementById(elementId);
  
    if (!element) {
      console.error("Element not found");
      return;
    }
  
    let textToCopy = '';
  
    // Check if the element is an input or textarea
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      textToCopy = element.value;
    } else {
      // If not, use its innerHTML
      textToCopy = element.innerHTML;
    }
  
    // Create a temporary input element to hold and select the text
    const temporaryInput = document.createElement('input');
    temporaryInput.setAttribute('value', textToCopy);
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    
    try {
      // Copy the text inside the temporary input to the clipboard
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Text copied to clipboard');
      } else {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Error copying text: ', err);
    }
    
    // Remove the temporary input from the document
    document.body.removeChild(temporaryInput);
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