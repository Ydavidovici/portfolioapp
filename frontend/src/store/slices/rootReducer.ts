// src/store/slices/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import roleReducer from './roleSlice';
import projectReducer from './projectSlice';
import taskReducer from './taskSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  roles: roleReducer,
  tasks: taskReducer,
  projects: projectReducer,


});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
