import { useState } from "react";

const useLocalStorage = (key: string, initialValue: unknown) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setLocalStorage = (newValue: unknown) => {
    if (typeof newValue === "function") {
      setValue((prevValue: unknown) => {
        const updatedValue = newValue(prevValue);
        window.localStorage.setItem(key, JSON.stringify(updatedValue));
        return updatedValue;
      });
    } else {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setLocalStorage];
};

export default useLocalStorage;
