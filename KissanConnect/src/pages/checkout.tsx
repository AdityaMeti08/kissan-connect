import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import { mintNFt } from '../App'; // Assuming this function is exported from App.tsx


const Checkout = () => {
  const { state, dispatch } = useCart(); // Assuming the useCart hook provides `state` and `dispatch`
  const navigate = useNavigate(); // Hook to navigate to another page

  const calculateTotal = () => {
    // Calculate total by summing the price of each product in the cart
    return state.cart.reduce((total, product) => total + Number(product.price), 0);
  };
  

  const handleProceed = async () => {
    // Mint NFT (Ensure mintNFt function is properly defined and accessible)
     
  
    // Calculate the total amount
    const totalAmount = calculateTotal();
  
    // Navigate to the payment page with the amount as a query parameter
    navigate(`/payment?amount=${totalAmount}`);
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      {state.cart.length === 0 ? (
        <p>Your cart is empty. Add items to the cart to proceed with checkout.</p>
      ) : (
        <div>
          {/* Display cart items */}
          {state.cart.map((product) => (
            <div key={product.id} className="checkout-item">
              <img src={product.imageUrl} alt={product.productName} />
              <div>
                <h2>{product.productName}</h2>
                <p>{product.description}</p>
                <p>Price: ₹{product.price}</p>
              </div>
            </div>
          ))}

          {/* Total price display */}
          <div className="checkout-total">Total: ₹{calculateTotal()}</div>

          {/* Proceed button */}
          <button
            className="proceed-button"
            onClick={handleProceed} // Handle the click to mint NFT and delete products
          >
            Proceed to Payment and Mint the NFT
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
