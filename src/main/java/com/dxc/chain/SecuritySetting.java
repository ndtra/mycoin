package com.dxc.chain;

import java.security.Security;

public class SecuritySetting {
	
	public SecuritySetting() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider()); //Setup Bouncey castle as a Security Provider
	}
}
