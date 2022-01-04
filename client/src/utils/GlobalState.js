import React, { createContext, useContext } from "react";
import { useProductReducer } from "./reducers";

//instantiate the global state object
const StoreContext = createContext();
const { Provider } = StoreContext;

//instantiate our initial global state with the useProductReducer
//Because that wraps around the useReducer hook from react, every time we run 
//useProductReducer, we receive :
//state: the most up-to-date version of our global state object
//dispatch: the method we execute to update our state, it looks for an action object to be passed in as it's arguement 
const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        categories: [],
        currentCategory: '',
    });
    //use this to confirm it works!
    //return the component with our state object and dispatch the function provided as data for the value prop
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

//create custom fuction using hook to be used by the components
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext};