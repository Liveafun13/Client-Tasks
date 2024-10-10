import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../util.js';

const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useLocalStorage('taskly_user', null);

  const updateUser = (newUser) => {
    console.log('Обновляем пользователя:', newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
