import React, { useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

function ProductList({}) {
  //execute the useStoreContest() function to retrieve the global state object
  //and the dispatch method to update state.
  const [state, dispatch] = useStoreContext();
  //deconstruct the currentCategory data out of the state object
  const {currentCategory} = state;
  //
  const {loading, data } = useQuery(QUERY_PRODUCTS);
  //implement the useEffect hook, once the data goes from undefined to a value we execute out dispatch()
  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });
    }
  }, [data, dispatch]);
  
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
