import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import {useStoreContext} from "../../utils/GlobalState";
//import IDB function
import { idbPromise} from '../../utils/helpers';

function CategoryMenu() {
  //call useStoreContext Hook to retrieve the current state from the global state object 
  //and the dispatch method to update state 
  const [state, dispatch] = useStoreContext();
  //destructure the categories array from the state 
  const {categories} = state;
  //update the hook to destructure a loading variable
  const {loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  
  // useEffect hook used to to catch data from useQuery to add to automoatically run the dispatch()
  useEffect(() => {
    //if categoryData exists or has changed for the response of useQuery, then run dispatch()
    if(categoryData) {
      //execute our dispatch function with out action object indicating the type 
      //of action and the data to set our state for categories to 
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      //but let's also take each category and save it the IDB using the helper function
      categoryData.categories.forEach(category => {
        //using our function to add each category as a category with the put method
        idbPromise('categories', 'put', category);
      });
      // add else if to check if `loading` is undefined in `useQuery`
      //this check if to see if we should lean on IDB for the data instead i.e. if we're offline
    } else if (!loading) {
       //since we're offline, get all of the data from the `category store
       idbPromise('categories', 'get').then((categories) => {
         //use retrieved data to set global state for offline browsing
         dispatch({
           type: UPDATE_CATEGORIES,
           categories: categories
         });
       });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
