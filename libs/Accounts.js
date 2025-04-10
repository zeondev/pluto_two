async function login(u, p) {
  let fet = await fetch("https://zeon.dev/api/public/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add any additional headers needed for authentication or other purposes
    },
    body: JSON.stringify({
      // Add your request data in the appropriate format
      username: u,
      password: p,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 200) return data;

      if (!sessionStorage.getItem("userData")) {
        sessionStorage.setItem("userData", JSON.stringify(data.info));
        checkUserData();
        return data;
      } else {
        return data;
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the request
      console.error("the error occurred", error);
    });
  await checkUserData();
  return fet;
}

function logout() {
  sessionStorage.removeItem("userData");
  checkUserData();
}

const stockUserData = {
  username: "User",
  pfp: "./assets/user-avatar.svg",
  id: -1,
  email: null,
  onlineAccount: false,
};

let currentUserData = {
  username: "User",
  pfp: "./assets/user-avatar.svg",
  id: -1,
  email: null,
  onlineAccount: sessionStorage.getItem("userData") !== null,
};

function checkUserData() {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem("userData") !== null) {
      try {
        const data = JSON.parse(sessionStorage.getItem("userData"));

        if (data.token === undefined)
          return Object.assign(currentUserData, stockUserData);
        fetch("https://zeon.dev/api/public/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers needed for authentication or other purposes
          },
          body: JSON.stringify({
            // Add your request data in the appropriate format
            username: data.user,
            token: data.token,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.status !== 200) {
              sessionStorage.removeItem("userData");
              return resolve(Object.assign(currentUserData, stockUserData));
            }
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            console.error("the error occurred", error);
            sessionStorage.removeItem("userData");
            return resolve(Object.assign(currentUserData, stockUserData));
          })
          .then(() => {
            if (data.user && data.pfp && data.id && data.email) {
              console.error(data);

              currentUserData.username = data.user;
              currentUserData.pfp = data.pfp.replace("/", "https://zeon.dev/");
              currentUserData.id = data.id;
              currentUserData.email = data.email;
              currentUserData.onlineAccount = true;
              console.error(currentUserData);
              return resolve(currentUserData);
            }
          });
      } catch (e) {
        sessionStorage.removeItem("userData");
        return resolve(Object.assign(currentUserData, stockUserData));
      }
    } else {
      sessionStorage.removeItem("userData");
      return resolve(Object.assign(currentUserData, stockUserData));
    }
  });
}
console.error("CHECKEDc", currentUserData);
console.log(sessionStorage.getItem("userData"));
await checkUserData();
console.error("CHECKEDc", currentUserData);

export default {
  login,
  logout,
  getUserData() {
    checkUserData();
    return currentUserData;
  },
};
