import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
  token: string;
  name: string;
  role: string;
}

interface UserState {
  user?: User;
}

// Initial state with default values
const initialState: UserState = {};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    // Clear user data
    clearUser: state => {
      console.log(state, 'clear user');
      return {...initialState};
    },
  },
});

// Export actions and reducer
export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
