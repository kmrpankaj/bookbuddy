function generateUsername() {
    // Get current date information
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
   
    // Generate random letters (uppercase)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26));
   
    // Handle sequential numbering
    let counter = 0;
    function getUniqueNumber() {
      counter++;
      return String(counter).padStart(2, '0');
    }
   
    // Construct the username
    const username = `${year}${month}${day}${randomLetters}${getUniqueNumber()}`;
   
    return username;
   }
   
   // Example usage:
   const newUsername = generateUsername();
   console.log(newUsername);  // Example output: 20240114AB01