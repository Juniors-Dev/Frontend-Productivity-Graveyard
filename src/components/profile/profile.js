export function renderProfile(profile) {
  // Update profile picture
  const profilePicture = document.getElementById("profile-picture");
  profilePicture.src = profile.picture || "./assets/img/noimage.png";
  profilePicture.alt = `${profile.name}'s Profile Picture`;

  // Update profile name
  const profileName = document.getElementById("profile-name");
  profileName.textContent = profile.name;

  // Update profile nickname
  const profileNickname = document.getElementById("profile-nickname");
  profileNickname.textContent = profile.nickname;

  // Update location
  const profileLocation = document.getElementById("profile-location");
  profileLocation.innerHTML = `
      <img src="./assets/img/location.png" alt="Location Icon" width="25px" height="30px" />
      ${profile.location}
    `;

  // Update buried projects count
  const profileBuried = document.getElementById("profile-burried");
  profileBuried.innerHTML = `
      <img src="./assets/img/thombstone.png" alt="Buried Icon" width="25px" height="25px" />
      ${profile.buriedProjects} Projects Buried
    `;

  // Update member since
  const profileMemberSince = document.getElementById("profile-member-since");
  profileMemberSince.innerHTML = `
      <img src="./assets/img/membersince.png" alt="Member Since Icon" width="25px" height="25px" />
      ${profile.memberSince}
    `;
}

// Example usage:
const profileData = {
  picture: "./assets/img/noimage.png",
  name: "Johan Nordstrand",
  nickname: "@rage_ypei",
  location: "Norway",
  buriedProjects: 12,
  memberSince: "March 31, 2025",
};

renderProfile(profileData);
