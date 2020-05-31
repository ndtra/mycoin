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
import com.dxc.chain.StringUtil;
import com.dxc.chain.Transaction;
import com.dxc.chain.TransactionConvert;
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
	List<TransactionConvert> result = new ArrayList<TransactionConvert>();
	int index=1;

	public static int difficulty = 3;
	public static float minimumTransaction = 0.1f;
	public static Transaction genesisTransaction;
	public static Wallet newWallet;
	
	public static Wallet walletA;
	public static Wallet walletB;
	
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
	
	@PostMapping("/getData")
	@ResponseBody
	public List<TransactionConvert> getData() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
		if (blockchain.size() > 0) {
			for (int i = index; i < blockchain.size(); i++) {
				System.out.println("block " + i + ":");
				List<Transaction> transBlock = blockchain.get(i).transactions;
				if (transBlock.size() > 0) {
					TransactionConvert e = new TransactionConvert(transBlock.get(0).transactionId, transBlock.get(0).sender.toString(), transBlock.get(0).reciepient.toString(), transBlock.get(0).value);
					result.add(e);
				}
			}
			index = blockchain.size();
		}
		return result;
	}
	
	@GetMapping("/admin")
	public String admin() {
		return "admin";
	}

	@PostMapping("/setting")
	@ResponseBody
	public byte[] settingWallet() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
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
				wallets.add(mainWallet);
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
	
	@GetMapping("/create-wallet")
	public String createWallet() {
		return "new_wallet";
	}

	@PostMapping("/create-wallet")
	@ResponseBody
	public byte[] saveWallet() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
		try {
			newWallet = new Wallet();
			Block block = new Block(blockchain.get(blockchain.size() - 1).hash);
			block.addTransaction(wallets.get(0).sendFunds(newWallet.publicKey, 100f));
			addBlock(block);
			wallets.add(newWallet);
			return "Tạo ví thành công".getBytes(StandardCharsets.UTF_8);
		}
		catch (Exception e) {
			return "Tạo ví thất bại".getBytes(StandardCharsets.UTF_8);
			// TODO: handle exception
		}
		
	}
	
	@PostMapping("/get-balance")
	@ResponseBody
	public float balance(@RequestBody String privateKey) {
		if (wallets.size() > 0) {
			for (int i = 0; i < wallets.size(); i++) {
				if(StringUtil.comparrKey(wallets.get(i).privateKey.toString().trim(),privateKey.trim()))
					return wallets.get(i).getBalance();
			}
		}
		
		return 0;
	}
	
	@PostMapping("/send-coin")
	@ResponseBody
	public String sendCoin(@RequestBody String from,@RequestBody String to,@RequestBody String value) {
		Wallet fromWallet = new Wallet();;
		Wallet toWallet = new Wallet();
		int flag=0;
		if (wallets.size() > 0) {
			for (int i = 0; i < wallets.size(); i++) {
				if(wallets.get(i).privateKey.toString().equals(from)) {
					fromWallet = wallets.get(i);
					flag++;
					if(flag==2) break;
				}
				else if(wallets.get(i).publicKey.toString().equals(to)) {
					toWallet = wallets.get(i);
					flag++;
					if(flag==2) break;
				}
			}
		}
		Block block1 = new Block(blockchain.get(blockchain.size()-1).hash);
		block1.addTransaction(fromWallet.sendFunds(toWallet.publicKey, Float.parseFloat(value)));
		addBlock(block1);
		return "";
	}
	
	@PostMapping("/test")
	@ResponseBody
	public String test(@RequestBody String input) {
		
		return isChainValid().toString();
	}
	
	public static void main(String[] args) {	
		//add our blocks to the blockchain ArrayList:
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider()); //Setup Bouncey castle as a Security Provider
		
		//Create wallets:
		walletA = new Wallet();
		walletB = new Wallet();		
		Wallet coinbase = new Wallet();
		
		//create genesis transaction, which sends 100 NoobCoin to walletA: 
		genesisTransaction = new Transaction(coinbase.publicKey, walletA.publicKey, 100f, null);
		genesisTransaction.generateSignature(coinbase.privateKey);	 //manually sign the genesis transaction
		
		genesisTransaction.transactionId = "0"; //manually set the transaction id
		genesisTransaction.outputs.add(new TransactionOutput(genesisTransaction.reciepient, genesisTransaction.value, genesisTransaction.transactionId)); //manually add the Transactions Output
		UTXOs.put(genesisTransaction.outputs.get(0).id, genesisTransaction.outputs.get(0)); //its important to store our first transaction in the UTXOs list.
		System.out.println("Creating and Mining Genesis block... ");
		Block genesis = new Block("0");
		genesis.addTransaction(genesisTransaction);
		addBlock(genesis);
		
		//testing
		Block block1 = new Block(genesis.hash);
		System.out.println("\nWalletA\'s balance is: " + walletA.getBalance());
		System.out.println("\nWalletA is Attempting to send funds (40) to WalletB...");
		block1.addTransaction(walletA.sendFunds(walletB.publicKey, 40f));
		addBlock(block1);
		System.out.println("\nWalletA\'s balance is: " + walletA.getBalance());
		System.out.println("WalletB\'s balance is: " + walletB.getBalance());
		
		Block block2 = new Block(block1.hash);
		System.out.println("\nWalletA Attempting to send more funds (1000) than it has...");
		block2.addTransaction(walletA.sendFunds(walletB.publicKey, 1000f));
		addBlock(block2);
		System.out.println("\nWalletA\'s balance is: " + walletA.getBalance());
		System.out.println("WalletB\'s balance is: " + walletB.getBalance());
		
		Block block3 = new Block(block2.hash);
		System.out.println("\nWalletB is Attempting to send funds (20) to WalletA...");
		block3.addTransaction(walletB.sendFunds( walletA.publicKey, 20));
		addBlock(block3);
		System.out.println("\nWalletA\'s balance is: " + walletA.getBalance());
		System.out.println("WalletB\'s balance is: " + walletB.getBalance());
		
		Block block4 = new Block(block3.hash);
		System.out.println("\nWalletA Attempting to send more funds (1000) than it has...");
		block4.addTransaction(walletA.sendFunds(walletB.publicKey, 10f));
		addBlock(block4);
		System.out.println("\nWalletA\'s balance is: " + walletA.getBalance());
		System.out.println("WalletB\'s balance is: " + walletB.getBalance());
		
		
		isChainValid();
		System.out.println("Histories block");
		
		if(blockchain.size()>0) {
			for(int i=0; i<blockchain.size();i++) {
				System.out.println("block "+i+":");
				List<Transaction> transBlock = blockchain.get(i).transactions;
				if(transBlock.size()>0) {
					System.out.println(transBlock.get(0).toString());
				}
				else {
					System.out.println("Block "+i+" have no transaction");
				}
				
			}
		}
		System.out.println("thahahahahaahaha:"+walletA.privateKey.toString().equals(walletA.privateKey.toString()));
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
