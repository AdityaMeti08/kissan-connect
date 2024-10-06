import React, { useState } from "react";
import { Web3Auth } from "@web3auth/single-factor-auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider';



function Home() {
  const [user, setUser] = useState(null); // To store user info

  // Fetch user info and update state
  const handleGetUserInfo = async () => {
    try {
      console.log(localStorage.getItem("address")); // You can also log the user info for debugging
    } catch (error) {
    }
  };

  return (
    <div className="home">
      <h1>Home</h1>
      
      {/* Button to fetch user info */}
      <button onClick={handleGetUserInfo} className="get-user-info-btn">
        Get User Info
      </button>

      {/* Display user info if available */}
      {user && (
        <div className="user-info">
          <h2>User Information:</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Profile Image:</strong></p>
          <img src={user.profileImage} alt="User Profile" width="100" />
        </div>
      )}
    </div>
  );
}

export default Home;
