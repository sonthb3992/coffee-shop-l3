import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import { auth } from '../domain/firebase';
import { GetUserDataFromFirebase, UserData } from '../domain/user';

interface UserState {
  userData: UserData | null;
  userUid: string;
  loading: boolean;
  error: Error | null;
}

const initialState: UserState = {
  userData: null,
  userUid: '',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    fetchUserDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDataSuccess: (state, action: PayloadAction<UserData | null>) => {
      state.loading = false;
      state.userData = action.payload;
      console.log(action.payload);
      console.log('fetch user data success');
    },
    fetchUserDataFailure: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
    },
    setUserUid: (state, action: PayloadAction<string>) => {
      state.userUid = action.payload;
    },
  },
});

export const {
  fetchUserDataRequest,
  fetchUserDataSuccess,
  fetchUserDataFailure,
  setUserUid,
} = userSlice.actions;

export const fetchUserData = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<any>
> => {
  return async (dispatch) => {
    console.log('fetching user data');
    dispatch(fetchUserDataRequest());
    try {
    } catch (error: any) {
      console.log(error);
      dispatch(fetchUserDataFailure(error));
    }
    const user = auth.currentUser;
    setUserUid(user?.uid ?? '');
    if (!user) {
      dispatch(fetchUserDataFailure(new Error('User not logged in.')));
      return;
    }

    const data = await GetUserDataFromFirebase(user.uid);
    if (data === null) {
      dispatch(
        fetchUserDataFailure(new Error('Fetch user data failed: data is null'))
      );
      return;
    }
    dispatch(fetchUserDataSuccess(data));
  };
};

export default userSlice.reducer;
