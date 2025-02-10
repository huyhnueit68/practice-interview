// src/stores/commonStore.ts
import { createStore, Reducer } from 'redux';

// Action type constants
const SET_RECORD_MODE = 'SET_RECORD_MODE'; // Action type for record mode (add/edit)
const SET_DATA_ARRAY = 'SET_DATA_ARRAY'; // Action type for data array

// Define types for the state
export interface DataEntry {
    dateTime: string; // Date and time
    marketPrice: number; // Numeric value
}

interface State {
    recordMode: 'add' | 'edit'; // Record status
    dataArray: DataEntry[]; // Data array
}

// Define the initial state
const initialState: State = {
    recordMode: 'add', // Default is 'add'
    dataArray: [], // Default is an empty array
};

// Define types for actions
interface Action {
    type: string;
    payload?: any;
}

// Define the reducer
const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case SET_RECORD_MODE:
            return { ...state, recordMode: action.payload }; // Update record status
        case SET_DATA_ARRAY:
            return { ...state, dataArray: action.payload }; // Update data array
        default:
            return state;
    }
};

// Create the store
const commonStore = createStore(reducer);

// Define action to update record status
export const setRecordMode = (mode: 'add' | 'edit') => ({
    type: SET_RECORD_MODE,
    payload: mode,
});

// Define action to update data array
export const setDataArray = (data: DataEntry[]) => ({
    type: SET_DATA_ARRAY,
    payload: data,
});

// Define RootState type
export type RootState = ReturnType<typeof reducer>; // This infers the state shape from the reducer

export default commonStore;