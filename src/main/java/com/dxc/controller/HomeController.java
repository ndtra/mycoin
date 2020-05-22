package com.dxc.controller;

import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
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

	@PostMapping("/upload1")
	@ResponseBody
	public String analyzing(@RequestBody String input) {
		if(isNullOrEmpty(input)) return "";
		
		return "";
	}
	
}

