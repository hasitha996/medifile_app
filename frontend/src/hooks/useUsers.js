import { useState, useEffect } from "react";
import { getUsers, deleteUser as removeUser } from "../services/userService";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      setUsers(getUsers());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const deleteUser = (id) => {
    removeUser(id);
    setUsers(getUsers());
  };

  return { users, loading, deleteUser };
};

export default useUsers;
