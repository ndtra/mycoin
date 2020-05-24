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
			<button type="button" id="create">Tạo ví</button>
			<button type="button" id="send">Gửi coin</button>
			<button type="button" id="balance">Xem số dư</button>
			<button type="button" id="history">Lịch sử giao dịch</button>
		</div>
	</div>
</div>
<br>
<div class="row">
	<div class="col-xs-12">
		<div class="input-group" id="result">
		</div>
	</div>
</div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    $('#reset').click(function(){
    	$("#input").val("");
    })
    $('#translate').click(function(){
    	var ctx = "<%=request.getContextPath()%>";
        var input= $('#input').val();
        $.ajax({
    			url: ctx+"/upload",
    			type: 'POST',
    			processData: false,
    			contentType: "application/json;charset=utf-8",
    			data: input,
    			success: function(res){
    				if(res!=null){
    	      			$("#result").val(res);
    	      		}
    			}
    	});
    })
});

</script>
<html>