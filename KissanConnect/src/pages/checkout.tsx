import { useCart } from './CartContext';
import '../App.css'; 
import bs58 from 'bs58';
import { getED25519Key } from "@web3auth/auth-adapter";
import { chainConfig } from './config/config';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
	SolanaPrivateKeyProvider,
	SolanaWallet,
} from '@web3auth/solana-provider';
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { web3auth} from '../App';
import { mintNFt } from '../App';
const Checkout = () => {
  const { state } = useCart(); 

  const calculateTotal = () => {
    return state.cart.reduce((total, product) => total + product.price, 0); 
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
                <p>Price: ${product.price}</p>
              </div>
            </div>
          ))}
          <div className="checkout-total">Total: ${calculateTotal()}</div>
          <button className="proceed-button" onClick={mintNFt}>Proceed to Payment and mint the NFT's</button>
          
        </div>
      )}
    </div>
  );
};

export default Checkout;
