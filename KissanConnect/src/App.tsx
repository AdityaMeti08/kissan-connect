import { useEffect, useState } from "react";
import React from 'react';
import ReactDOM from "react-dom";
import Arweave from "arweave";
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createGenericFile, createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import * as fs from 'fs';

// IMP START - Quick Start
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import ImageUploading from 'react-images-uploading';
// IMP END - Quick Start
import Web3 from "web3";
import {
	SolanaPrivateKeyProvider,
	SolanaWallet,
} from '@web3auth/solana-provider';
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from '@solana/web3.js';

// Firebase libraries for custom authentication
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, UserCredential } from "firebase/auth";

import "./App.css";

// IMP START - SDK Initialization
// IMP START - Dashboard Registration
const clientId = "BKtu5x05Fhgwz4v5c_4f9BzrqO91VSu4zHrGJtycdeAKKTfSTYJGdchI2v5V9PFl5miqR-mXsU8HzNg00CeVsX4"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Verifier Creation
const verifier = "authenticator";
// IMP END - Verifier Creation

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x1",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Mainnet",
  blockExplorerUrl: "https://explorer.solana.com/",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

// IMP END - SDK Initialization

// IMP START - Auth Provider Login
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApSz11Fy1G1-RKHSrLdQ_OP68TrZr5Z5U",
  authDomain: "kissan-connect-33f10.firebaseapp.com",
  projectId: "kissan-connect-33f10",
  storageBucket: "kissan-connect-33f10.appspot.com",
  messagingSenderId: "745440975310",
  appId: "1:745440975310:android:016d39b3dfa765d69af39f",
};
// IMP END - Auth Provider Login


function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const nftDetail = {
    name: "QuickNode Pixel",
    symbol: "QP",
    uri: "IPFS_URL_OF_METADATA",
    royalties: 5.5,
    description: 'Pixel infrastructure for everyone!',
    imgType: 'image/png',
    attributes: [
        { trait_type: 'Speed', value: 'Quick' },
    ]
};


  // Firebase Initialisation
  const app = initializeApp(firebaseConfig);
  const onChange = (imageList:any , addUpdateIndex:any ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
    

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };


  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth initialised yet");
      return;
    }
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    const { payload } = decodeToken(idToken);

    const web3authProvider = await web3auth.connect({
      verifier,
      verifierId: (payload as any).sub,
      idToken,
    });

    if (web3authProvider) {
      setLoggedIn(true);
      setProvider(web3authProvider);
    }
  };
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };
  const getAccounts = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		const privateKey = await web3auth?.provider?.request({method: 'solanaPublicKey',});
		uiConsole(privateKey);
  };

  const getBalance = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const solanaWallet = new SolanaWallet(provider);
		// Get user's Solana public address
		const accounts = await solanaWallet.requestAccounts();

		const connectionConfig: any = await solanaWallet.request({
			method: 'solana_provider_config',
			params: [],
		});

		const connection = new Connection(connectionConfig.rpcTarget);

		// Fetch the balance for the specified public key
		const balance = await connection.getBalance(new PublicKey(accounts[0]));
		uiConsole(balance / 1000000000);
  };
  const get_aidrop = async () => {
    if (!provider) {
      uiConsole('Provider not initialized yet');
      return;
    }
  
    const solanaWallet = new SolanaWallet(provider);
  
    // Get user's Solana public address
    const accounts = await solanaWallet.requestAccounts();
    const publicKey = accounts[0]; // Solana public key
  
    const connectionConfig: any = await solanaWallet.request({
      method: 'solana_provider_config',
      params: [],
    });
  
    const connection = new Connection(connectionConfig.rpcTarget);
  
    // Request an airdrop of 1 SOL (example value)
    const solValue = 1; // You can change this value to the desired airdrop amount
  
    try {
      const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(publicKey), // User's public key
        solValue * LAMPORTS_PER_SOL // Convert SOL to lamports
      );
  
      await connection.confirmTransaction(fromAirDropSignature);
      uiConsole(`Airdrop of ${solValue} SOL successful`);
    } catch (error) {
      console.error('Airdrop failed', error);
      uiConsole('Airdrop failed', error);
    }
  };
  
  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };
  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };


  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={logout} className="card">Log Out</button>
          <button onClick={getUserInfo} className="card">Get User Info</button>
          <button onClick={getAccounts} className="card">Get Public Key</button>
          <button onClick={get_aidrop} className="card">Get Airdrop</button>
          <button onClick={getBalance} className="card">Get Balance</button>
          <button onClick={signMessage} className="card">Sign Message</button>
        </div>
        <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
        Kissanconnect
        </a>{" "}
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      

    </div>
  );
}

export default App;