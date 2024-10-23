import { useCart } from './CartContext';
import '../App.css'; // Import the CSS file

const Checkout = () => {
  const { state } = useCart(); // Access the cart context

  const calculateTotal = () => {
    return state.cart.reduce((total, product) => total + product.price, 0).toFixed(2); // Calculate total price
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      {state.cart.length === 0 ? (
        <p>Your cart is empty. Add items to the cart to proceed with checkout.</p>
      ) : (
        <div>
          {state.cart.map((product) => (
            <div key={product.id} className="checkout-item">
              <img src={product.imageUrl} alt={product.productName} />
              <div>
                <h2>{product.productName}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="checkout-total">Total: ${calculateTotal()}</div>
          <button className="proceed-button">Proceed to Payment</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
