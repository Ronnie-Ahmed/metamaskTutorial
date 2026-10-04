import "./App.css";
import { ethers } from "ethers";
import { abi, address } from "./constant";
import token from "./assets/token.svg";

function App() {
  // Chain details for Polygon Amoy Testnet (Chain ID: 80002 / 0x13882)
  const AMOY_CHAIN_ID = "0x13882"; // Hexadecimal for 80002

  const handleclick = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Prompt user to switch network if not on Polygon Amoy
        if (currentChainId !== AMOY_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: AMOY_CHAIN_ID }],
            });
          } catch (switchError) {
            // Error code 4902 indicates the chain has not been added to MetaMask yet
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: AMOY_CHAIN_ID,
                    chainName: "Polygon Amoy Testnet",
                    rpcUrls: ["https://rpc-amoy.polygon.technology"],
                    nativeCurrency: {
                      name: "POL",
                      symbol: "POL",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://amoy.polygonscan.com"],
                  },
                ],
              });
            } else {
              throw switchError;
            }
          }
        } else {
          console.log("Already connected to Polygon Amoy Testnet");
        }
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  const addtoken = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);

        const tokenAddress = address;
        const tokenSymbol = await contract.symbol();
        const tokenDecimals = await contract.decimals();

        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: token,
            },
          },
        });

        if (wasAdded) {
          console.log("Token successfully added to MetaMask!");
        } else {
          console.log("Token addition rejected.");
        }
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (err) {
      console.error("Error adding token:", err);
    }
  };

  const transfertoken = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Ensure wallet is connected
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);

        // Adjust parameters to match your specific contract function call
        const tx = await contract.transferTokens(); 
        console.log("Transaction submitted:", tx.hash);

        // Wait for 1 confirmation block
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        alert("Tokens transferred successfully!");
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction Reverted or Cancelled");
    }
  };

  return (
  <div className="App">
    <div className="App-card">
      <h1 className="App-title">MetaMask Portal</h1>
      <div className="button-group">
        <button onClick={handleclick}>Connect / Switch Wallet</button>
        <button onClick={addtoken}>Add Token to Wallet</button>
        <button onClick={transfertoken}>Transfer Token</button>
      </div>
    </div>
  </div>
);
}

export default App;