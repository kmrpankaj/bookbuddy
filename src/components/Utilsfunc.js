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
        //console.log('Text copied to clipboard');
      } else {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Error copying text: ', err);
    }
    
    // Remove the temporary input from the document
    document.body.removeChild(temporaryInput);
  };