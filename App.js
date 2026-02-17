import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ABI = [
  "function mint(uint256 quantity) public payable",
  "function totalSupply() public view returns (uint256)",
  "function MAX_SUPPLY() public view returns (uint256)"
];

function App() {
  const [account, setAccount] = useState("");
  const [supply, setSupply] = useState(0);

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    }
  }

  async function handleMint() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.mint(1, { value: ethers.parseEther("0.05") });
      await tx.wait();
      alert("Mint Successful!");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <h1>NFT Minting Portal</h1>
      {account ? (
        <div>
          <p>Connected: {account.substring(0, 6)}...{account.slice(-4)}</p>
          <button onClick={handleMint} className="mint-btn">Mint 1 NFT (0.05 ETH)</button>
        </div>
      ) : (
        <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
