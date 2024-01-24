const generateUsername = () => {
    // Get current date information
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
   
    // Generate random letters (uppercase)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * 26)) + letters.charAt(Math.floor(Math.random() * 26));
   
    // Handle random numbering
    function getUniqueNumber() {
      // Generate a random number between 0 and 99 (inclusive)
      const randomNum = Math.floor(Math.random() * 100);
      // Add leading zero if needed
      return randomNum < 10 ? `0${randomNum}` : randomNum;
    }
   
    // Construct the username
    const username = `${year}${month}${day}${randomLetters}${getUniqueNumber()}`;
   
    return username;
   }
   
   module.exports = generateUsername
   // Example usage:
   // const newUsername = generateUsername();
   // console.log(newUsername);  // Example output: 20240114AB01