package com.dxc.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.security.Security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.dxc.chain.Block;
import com.dxc.chain.SecuritySetting;
import com.dxc.chain.Transaction;
import com.dxc.chain.TransactionInput;
import com.dxc.chain.TransactionOutput;
import com.dxc.chain.Wallet;

@Controller
public class HomeController {

	@Autowired
	SecuritySetting securitySetting;

	public static List<Block> blockchain = new ArrayList<Block>();
	public static HashMap<String, List<Block>> blockchains = new HashMap<String, List<Block>>();
	public static HashMap<String, TransactionOutput> UTXOs = new HashMap<String, TransactionOutput>();

	public static List<Wallet> wallets = new ArrayList<Wallet>();

	public static int difficulty = 3;
	public static float minimumTransaction = 0.1f;
	public static Transaction genesisTransaction;
	public static Wallet newWallet;
	
	public static Wallet mainWallet;

	public static boolean isNullOrEmpty(String str) {
		if (str != null && !str.isEmpty())
			return false;
		return true;
	}

	public static void addBlock(Block newBlock) {
		newBlock.mineBlock(difficulty);
		blockchain.add(newBlock);
	}

	@GetMapping("/")
	public ModelAndView home() {
		ModelAndView mv = new ModelAndView("home");
		return mv;
	}
	
	@GetMapping("/admin")
	public String admin() {
		return "admin";
	}

	@PostMapping("/setting")
	@ResponseBody
	public byte[] settingWallet() {
		try {
			if(blockchain.size()==0) {
				mainWallet = new Wallet();
				Wallet coinbase = new Wallet();
				// create genesis transaction, which sends 100 NoobCoin to walletA:
				genesisTransaction = new Transaction(coinbase.publicKey, mainWallet.publicKey, 100000f, null);
				genesisTransaction.generateSignature(coinbase.privateKey); // manually sign the genesis transaction
				genesisTransaction.transactionId = "0"; // manually set the transaction id
				genesisTransaction.outputs.add(new TransactionOutput(genesisTransaction.reciepient, genesisTransaction.value, genesisTransaction.transactionId)); // manually add the Transactions Output
				UTXOs.put(genesisTransaction.outputs.get(0).id, genesisTransaction.outputs.get(0)); // its important to store our first transaction in the UTXOs list.
				Block genesis = new Block("0");
				genesis.addTransaction(genesisTransaction);
				addBlock(genesis);
				
				return "Tạo ví thành công".getBytes(StandardCharsets.UTF_8);
			}
			else {
				return "Ví đã được tạo".getBytes(StandardCharsets.UTF_8);
			}
			
		}
		catch (Exception e) {
			return "Tạo ví thất bại".getBytes(StandardCharsets.UTF_8);
			// TODO: handle exception
		}
	}

	@PostMapping("/create-wallet")
	@ResponseBody
	public String analyzing(@RequestBody String input) {
		newWallet = new Wallet();
		Block block = new Block(blockchain.get(blockchain.size() - 1).hash);
		block.addTransaction(wallets.get(0).sendFunds(newWallet.publicKey, 100f));
		addBlock(block);

		wallets.add(newWallet);
		
		return "";
	}
	
	@PostMapping("/balance")
	@ResponseBody
	public String balance(@RequestBody String publicKey) {
		if (wallets.size() > 0) {
			for (int i = 0; i < wallets.size(); i++) {
				if(wallets.get(i).publicKey.equals(publicKey))
				return wallets.get(i).getBalance()+"";
			}
		}
		
		return "";
	}
	
	@PostMapping("/send-coin")
	@ResponseBody
	public String sendCoin(@RequestBody String from, String to, float value) {
		Wallet fromWallet = new Wallet();;
		Wallet toWallet = new Wallet();
		int flag=0;
		if (wallets.size() > 0) {
			for (int i = 0; i < wallets.size(); i++) {
				if(wallets.get(i).publicKey.equals(from)) {
					fromWallet = wallets.get(i);
					flag++;
					if(flag==2) break;
				}
				else if(wallets.get(i).publicKey.equals(from)) {
					toWallet = wallets.get(i);
					flag++;
					if(flag==2) break;
				}
			}
		}
		Block block1 = new Block(blockchain.get(blockchain.size()-1).hash);
		block1.addTransaction(fromWallet.sendFunds(toWallet.publicKey, value));
		addBlock(block1);
		return "";
	}
	
	@PostMapping("/transaction-histories")
	@ResponseBody
	public String transactionHistories(@RequestBody String input) {
		if (blockchain.size() > 0) {
			for (int i = 0; i < blockchain.size(); i++) {
				System.out.println("block " + i + ":");
				List<Transaction> transBlock = blockchain.get(i).transactions;
				if (transBlock.size() > 0) {
					System.out.println(transBlock.get(0).toString());
				} else {
					System.out.println("Block " + i + " have no transaction");
				}
			}
		}
		return "";
	}
	
	@PostMapping("/test")
	@ResponseBody
	public String test(@RequestBody String input) {
		
		return isChainValid().toString();
	}
	
	

	public static Boolean isChainValid() {
		Block currentBlock;
		Block previousBlock;
		String hashTarget = new String(new char[difficulty]).replace('\0', '0');
		HashMap<String, TransactionOutput> tempUTXOs = new HashMap<String, TransactionOutput>(); // a temporary working
																									// list of unspent
																									// transactions at a
																									// given block
																									// state.
		tempUTXOs.put(genesisTransaction.outputs.get(0).id, genesisTransaction.outputs.get(0));

		// loop through blockchain to check hashes:
		for (int i = 1; i < blockchain.size(); i++) {

			currentBlock = blockchain.get(i);
			previousBlock = blockchain.get(i - 1);
			// compare registered hash and calculated hash:
			if (!currentBlock.hash.equals(currentBlock.calculateHash())) {
				System.out.println("#Current Hashes not equal");
				return false;
			}
			// compare previous hash and registered previous hash
			if (!previousBlock.hash.equals(currentBlock.previousHash)) {
				System.out.println("#Previous Hashes not equal");
				return false;
			}
			// check if hash is solved
			if (!currentBlock.hash.substring(0, difficulty).equals(hashTarget)) {
				System.out.println("#This block hasn\'t been mined");
				return false;
			}

			// loop thru blockchains transactions:
			TransactionOutput tempOutput;
			for (int t = 0; t < currentBlock.transactions.size(); t++) {
				Transaction currentTransaction = currentBlock.transactions.get(t);

				if (!currentTransaction.verifiySignature()) {
					System.out.println("#Signature on Transaction(" + t + ") is Invalid");
					return false;
				}
				if (currentTransaction.getInputsValue() != currentTransaction.getOutputsValue()) {
					System.out.println("#Inputs are note equal to outputs on Transaction(" + t + ")");
					return false;
				}

				for (TransactionInput input : currentTransaction.inputs) {
					tempOutput = tempUTXOs.get(input.transactionOutputId);

					if (tempOutput == null) {
						System.out.println("#Referenced input on Transaction(" + t + ") is Missing");
						return false;
					}

					if (input.UTXO.value != tempOutput.value) {
						System.out.println("#Referenced input Transaction(" + t + ") value is Invalid");
						return false;
					}

					tempUTXOs.remove(input.transactionOutputId);
				}

				for (TransactionOutput output : currentTransaction.outputs) {
					tempUTXOs.put(output.id, output);
				}

				if (currentTransaction.outputs.get(0).reciepient != currentTransaction.reciepient) {
					System.out.println("#Transaction(" + t + ") output reciepient is not who it should be");
					return false;
				}
				if (currentTransaction.outputs.get(1).reciepient != currentTransaction.sender) {
					System.out.println("#Transaction(" + t + ") output \'change\' is not sender.");
					return false;
				}

			}
		}
		System.out.println("Blockchain is valid");
		return true;
	}

}
