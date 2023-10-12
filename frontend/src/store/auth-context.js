import React, { useState } from "react";

const AuthContext = React.createContext({
  changeDisplayName: (displayName) => {},
  displayName: "",
});

export const AuthContextProvider = (props) => {
  const [displayName, setDisplayName] = useState("");

  const onChangeDisplayName = (newName) => {
    setDisplayName(newName);
  };

  return (
    <AuthContext.Provider
      value={{
        changeDisplayName: onChangeDisplayName,
        displayName: displayName,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
