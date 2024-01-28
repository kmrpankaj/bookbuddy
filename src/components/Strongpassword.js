function generateStrongPassword(length = 14) {
    // Define character sets
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%&";
  
    // Generate initial password with guaranteed diversity
    let password = "";
    password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
  
    // Fill remaining characters randomly
    for (let i = password.length; i < length; i++) {
      const characterSet = Math.floor(Math.random() * 4);
      let char;
      switch (characterSet) {
        case 0:
          char = lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
          break;
        case 1:
          char = uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
          break;
        case 2:
          char = numbers[Math.floor(Math.random() * numbers.length)];
          break;
        case 3:
          char = symbols[Math.floor(Math.random() * symbols.length)];
          break;
      }
      password += char;
    }
  
    // Shuffle for added randomness
    password = password.split("").sort(() => 0.5 - Math.random()).join("");
  
    return password;
  }
  
   
   export default generateStrongPassword