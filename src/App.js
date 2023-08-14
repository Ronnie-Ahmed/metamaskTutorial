import "./App.css";
import { ethers } from "ethers";
import { abi, address } from "./constant";
import token from "./assets/token.svg";

function App() {
  const handleclick = async () => {
    // window.ethereum.on("chainChanged", handleChainChanged(chainId));
    try {
      if (typeof window.ethereum !== "undefined") {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log(chainId);
        if (chainId !== "0x13881") {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai Testnet",
                rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                iconUrls: [token], // You can provide icon URLs if needed
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
              },
            ],
          });
        }

        // if (chainId !== 0x13881) {
        //   await window.ethereum.request({
        //     method: "wallet_switchEthereumChain",
        //     params: [
        //       {
        //         chainId: "0x13881",
        //       },
        //     ],
        //   });
        // }
      } else {
        console.log("metamask not found");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const addtoken = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        // const transaction = await contract.gottoken();
        // console.log(transaction);
        const tokenAddress = address;
        // await contract.minttoken();

        const tokenSymbol = await contract.symbol();
        const tokenDecimals = await contract.decimals();

        console.log(tokenSymbol, tokenDecimals);
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress, // The address of the token.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
              decimals: tokenDecimals, // The number of decimals in the token.
              image: token,
            },
          },
        });
        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <button onClick={handleclick}>Connect Wallet</button>
      <button onClick={addtoken}>Add Token</button>
    </div>
  );
}

export default App;
