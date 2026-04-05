// Fake in-memory user service backed by src/data/users.json
// Swap the functions below for real api.js calls when a backend is ready.
import seedUsers from "../data/users.json";

let users = [...seedUsers];
let nextId = users.length + 1;

export const getUsers = () => [...users];

export const getUserById = (id) => users.find((u) => u.id === id) || null;

export const createUser = (data) => {
  const user = { id: nextId++, ...data };
  users.push(user);
  return user;
};

export const updateUser = (id, data) => {
  users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
  return getUserById(id);
};

export const deleteUser = (id) => {
  users = users.filter((u) => u.id !== id);
};
