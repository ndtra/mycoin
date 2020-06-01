package com.dxc.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.io.FileWriter;
import java.io.IOException;
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
	int index=0;

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
			try
			{
			    String filename= "C:\\Users\\tnguyen583\\Desktop\\HCMUS\\CNM\\blockchain-canhan\\mycoin\\MyFile.txt";
			    FileWriter fw = new FileWriter(filename,true); //the true will append the new data
			    fw.write(wallets.size()+"\n");//appends the string to the file
			    fw.write(newWallet.privateKey+"\n");
			    fw.write(newWallet.publicKey+"\n");
			    fw.close();
			}
			catch(IOException ioe)
			{
			    System.err.println("IOException: " + ioe.getMessage());
			}
			
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
	public TransactionConvert sendCoin(@RequestBody String data) {
		String[] datas = data.split("pattern");
		if(datas.length ==3) {
			String from = datas[0];
			String to = datas[1];
			float value = Float.parseFloat(datas[2]);
			if(value>0) {
				Wallet fromWallet = new Wallet();;
				Wallet toWallet = new Wallet();
				int flag=0;
				if (wallets.size() > 0) {
					for (int i = 0; i < wallets.size(); i++) {
						if(StringUtil.comparrKey(wallets.get(i).privateKey.toString(),from)) {
							fromWallet = wallets.get(i);
							flag++;
							if(flag==2) break;
						}
						else if(StringUtil.comparrKey(wallets.get(i).publicKey.toString(),to)) {
							toWallet = wallets.get(i);
							flag++;
							if(flag==2) break;
						}
					}
				}
				Block block1 = new Block(blockchain.get(blockchain.size()-1).hash);
				block1.addTransaction(fromWallet.sendFunds(toWallet.publicKey, value));
				addBlock(block1);
				List<Transaction> transBlock = blockchain.get(blockchain.size()-1).transactions;
				TransactionConvert e = new TransactionConvert(transBlock.get(0).transactionId, transBlock.get(0).sender.toString(), transBlock.get(0).reciepient.toString(), transBlock.get(0).value);
				return e;
			}
		}
		
		return null;
	}

}
