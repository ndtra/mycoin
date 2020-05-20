package com.dxc.controller;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.translate.AmazonTranslate;
import com.amazonaws.services.translate.AmazonTranslateClient;
import com.amazonaws.services.translate.model.TranslateTextRequest;
import com.amazonaws.services.translate.model.TranslateTextResult;

import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class HomeController {
	
	public static boolean isNullOrEmpty(String str) {
        if(str != null && !str.isEmpty()) 
            return false;
        return true;
    }
	
	@GetMapping("/")
	public ModelAndView home() {
		ModelAndView mv = new ModelAndView("home");
		return mv;
	}

	@PostMapping("/upload")
	@ResponseBody
	public byte[] analyzing(@RequestBody String input) {
		
		if(isNullOrEmpty(input)) return null;
		
		AWSCredentialsProvider awsCreds = DefaultAWSCredentialsProviderChain.getInstance();
        
        AmazonTranslate translate = AmazonTranslateClient.builder()
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds.getCredentials()))
                //.withRegion(DefaultAwsRegionProviderChain.class.getName())
                .build();
 
        TranslateTextRequest request = new TranslateTextRequest()
                .withText(input)
                .withSourceLanguageCode("en")
                .withTargetLanguageCode("vi");
        TranslateTextResult result  = translate.translateText(request);
        
        String res = result.getTranslatedText();
        
        System.out.println(res);
        
        byte[] b = res.getBytes(StandardCharsets.UTF_8);
        
		return b;
	}

}
