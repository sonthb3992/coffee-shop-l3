import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './store';
import { RootState } from './root-reducer';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppDispatch: ThunkDispatch<
//   RootState,
//   unknown,
//   Action<any>
// > = useDispatch<AppDispatch>();
