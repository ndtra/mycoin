<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<br>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8'">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
<link
	href="https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i%7COpen+Sans:300,300i,400,400i,600,600i,700,700i"
	rel="stylesheet">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/bootstrap.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/fonts/font-awesome/css/font-awesome.min.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/bootstrap-extended.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/app.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/colors.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/core/menu/menu-types/vertical-menu.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/core/menu/menu-types/vertical-overlay-menu.css' />">
<link rel="stylesheet" type="text/css"
	href="<c:url value='/asset/css/style.css' />">
<script src="<c:url value='/asset/js/jquery.min.js' />"
	type="text/javascript"></script>

</head>
<div class="container">
<div class="content-header row">
	<div class="content-header-left col-md-6 col-xs-12 mb-1">
		<h2 class="content-header-title">MYCOIN</h2>
	</div>
</div>

<div class="row">
	<div class="col-xs-12">
		<div class="input-group">
			<button type="button" id="btnhomePage">Trang chủ</button>
			<button type="button" id="btnwalletPage" onclick="showDetectModeration(this.id)">Tạo ví</button>
			<button type="button" id="btnsendPage" onclick="showDetectModeration(this.id)">Gửi coin</button>
			<button type="button" id="btnbalancePage" onclick="showDetectModeration(this.id)">Xem số dư</button>
		</div>
	</div>
</div>
<br>
<jsp:include page="balance.jsp"></jsp:include>
<jsp:include page="wallet.jsp"></jsp:include>
<jsp:include page="send_coin.jsp"></jsp:include>
<br>
<hr>
<br>
<div id="historiesAll" style="">
<div class="content-header row">
	<div class="content-header-left col-md-6 col-xs-12 mb-1">
		<h2 class="content-header-title">Lịch sử giao dịch</h2>
	</div>
</div>

<div class="row">
	<div class="col-xs-12">
		<div class="input-group">
			<table class="table table-striped" id="table">
			  <thead>
			    <tr>
			      <th scope="col">Transaction Id</th>
			      <th scope="col">Địa chỉ gửi</th>
			      <th scope="col">Địa chỉ nhận</th>
			      <th scope="col">Số coin gửi</th>
			    </tr>
			  </thead>
			  <tbody id="tbody">
			  </tbody>
			</table>
		</div>
	</div>
</div>
</div>
</div>
<script type="text/javascript">

const listId = ["balancePage","walletPage", "sendPage"];
function showDetectModeration(id){
	$("#"+id.substr(3)).attr("style","");
	listId.forEach(item => {
		if(item != id.substr(3)){
			$("#"+item).attr("style","display: none;");
		}
	});
	$("#historiesAll").attr("style","display: none;");
}
$(document).ready(function() {
    $(function(){
    	let index=0;
    	const ctx = "<%=request.getContextPath()%>";
    	setInterval(getData, 3000);
    	function getData(){
    		if($("#tbody").val() == ""){
    			index = 0;
    		}
    		$.ajax({
        		url: ctx+"/"+'getData',
    			type: 'POST',
    			processData: false,
    			contentType: false
            }).done(function(data) { 
            	console.log(data);
            	//$('#tbody').empty();
            	if(data.length>0){
            		for(i=index; i<data.length; i++){
            			var line = '<tr><th scope="row">'+data[i].transactionId+'</th>'+
            			      '<td>'+data[i].sender+'</td>'+
            			      '<td>'+data[i].reciepient+'</td>'+
            			      '<td>'+data[i].value+'</td></tr>';
            			$('#tbody').append(line);
            		}
            		index = data.length;
            	}
            	else{
            		$('#table').empty();
            		//$('#table').append("Chưa có giao dịch nào.");
            	}
            	
            });
    	}
    } );
	$('#send').click(function(){
		var input= $('#privateKey').val();
        $.ajax({
    			url: ctx+"/get-balance",
    			type: 'POST',
    			processData: false,
    			contentType: "application/json;charset=utf-8",
    			data: input,
    			success: function(res){
    				if(res!=null){
    					$("#balance").val(res);
    	      		}
    			}
    	});
    });
	$("#btnhomePage").click(function(){
		listId.forEach(item => {
				$("#"+item).attr("style","display: none;");
		});
		$("#historiesAll").attr("style","");
	});
	$('#sendOfSendPage').click(function(){
		var from= $('#privateKeySendPage').val();
		var to= $('#publicKeySendPage').val();
		var value =  $('#valueSendPage').val();
        $.ajax({
    			url: "/mycoin/send-coin",
    			type: 'POST',
    			processData: false,
    			contentType: "application/json;charset=utf-8",
    			data: from+'pattern'+to+'pattern'+value,
    			success: function(res){
    				if(res!=null && res!= ""){
    					$("#tableSendCoin").attr("style","")
    					$("#tbodySendCoin").empty();
    					var line = '<tr><th scope="row">'+res.transactionId+'</th>'+
				      			      '<td>'+res.sender+'</td>'+
				      			      '<td>'+res.reciepient+'</td>'+
				      			      '<td>'+res.value+'</td></tr>';
    					$("#tbodySendCoin").append(line);
    	      		}
    				else{
    					$("#tableSendCoin").attr("style","display: none;");
    					
    				}
    			}
    	});
    });
    $('#sendOfBalancePage').click(function(){
		var privateKey= $('#privateKey').val();
        $.ajax({
    			url: "/mycoin/get-balance",
    			type: 'POST',
    			processData: false,
    			contentType: "application/json;charset=utf-8",
    			data: privateKey,
    			success: function(res){
    				if(res!=null){
    					$("#balance").val(res);
    	      		}
    			}
    	});
    });
	
});

</script>
<html>