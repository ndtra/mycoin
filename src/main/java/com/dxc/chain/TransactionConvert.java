package com.dxc.chain;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.ArrayList;

import com.dxc.controller.HomeController;

public class TransactionConvert {
	public String transactionId; // this is also the hash of the transaction.
	public String sender; // senders address/public key.
	public String reciepient; // Recipients address/public key.
	public float value;
	
	public TransactionConvert(String transactionId, String sender, String reciepient, float value) {
		super();
		this.transactionId = transactionId;
		this.sender = sender;
		this.reciepient = reciepient;
		this.value = value;
	}
	
	public String getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getReciepient() {
		return reciepient;
	}
	public void setReciepient(String reciepient) {
		this.reciepient = reciepient;
	}
	public float getValue() {
		return value;
	}
	public void setValue(float value) {
		this.value = value;
	}
	
}
