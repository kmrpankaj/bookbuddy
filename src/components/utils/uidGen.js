  function getRandomAvatar(gender) {
    // Define lists of avatar filenames for each gender
    const femaleAvatars = ["avatarf1", "avatarf2", "avatarf3", "avatarf4", "avatarf5"];
    const maleAvatars = ["avatarm1", "avatarm2", "avatarm3", "avatarm4"];
  
    // Select the appropriate list based on gender
    const avatarList = gender.toLowerCase() === "female" ? femaleAvatars : maleAvatars;
  
    // Choose a random avatar from the selected list
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    const randomAvatar = avatarList[randomIndex];
  
    return randomAvatar;
  }
  
  export default getRandomAvatar
