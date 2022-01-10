import React, { useEffect} from 'react';
import { useQuery } from '@apollo/client';
// import { useStoreContext } from '../../utils/GlobalState';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRODUCTS } from '../../utils/actions';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

//import out idbPromise
import {idbPromise} from '../../utils/helpers';

function ProductList() {
  //execute the useStoreContest() function to retrieve the global state object
  // //and the dispatch method to update state.
  // const [state, dispatch] = useStoreContext();
  //use redux instead of the global state
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  //deconstruct the currentCategory data out of the state object
  const {currentCategory} = state;
  //
  const {loading, data } = useQuery(QUERY_PRODUCTS);
  //implement the useEffect hook, once the data goes from undefined to a value we execute out dispatch()
  useEffect(() => {
    // if there's data to be stored
    if (data) {
      // let's store it in the global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
      //but let's also take each product and save it the IDB using the helper function
      data.products.forEach((product) => {
        //using our function to add each product as a product with the put method
        idbPromise('products', 'put', product);
      });
      // add else if to check if `loading` is undefined in `useQuery`
      //this check if to see if we should lean on IDB for the data instead i.e. if we're offline
    } else if (!loading) {
      //since we're offline, get all of the data from the `products` store
      idbPromise('products','get').then((products) => {
        //use retrieved data to set global state for offline browsing
        dispatch({
          type:UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data,loading, dispatch]);
  
  //once this is done we execute it again to give us product data
  function filterProducts(){
    if (!currentCategory) {
      return state.products;
    }
    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
