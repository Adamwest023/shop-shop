import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import {useStoreContext} from "../../utils/GlobalState";

function CategoryMenu({}) {
  //call useStoreContext Hook to retrieve the current state from the global state object 
  //and the dispatch method to update state 
  const [state, dispatch] = useStoreContext();
  //destructure the categories array from the state 
  const {categories} = state;

  const {data: categoryData } = useQuery(QUERY_CATEGORIES);
  
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
    }
  }, [categoryData, dispatch]);

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
