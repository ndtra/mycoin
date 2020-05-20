<%--
  Created by IntelliJ IDEA.
  User: cvo5
  Date: 4/14/2020
  Time: 1:02 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags"%>
<html>

<head>
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" href="<c:url value='/asset/styles/sgds.css'/>">
    <link rel="stylesheet" href="<c:url value='/asset/styles/main.css'/>">
</head>
<html>
<head>
    <title>Title</title>
</head>
<body>
	<section class="sgds-section">
		<div class="sgds-container">
			<div class="content">
				<div class="row">
					<div class="col is-12">
						<c:choose>
							<c:when test="${paymentDTO.status == 1 }">
								<h3><strong>ERG Payment Status for ${paymentDTO.uen}</strong></h3>
								<p>Dear Sir/Madam,</p>
								<p>Thank you for your online enquiry on ERG payment. We are happy to inform that your grant payment was completed on ${paymentDTO.paymentCompletionDate} into your PayNow Corporate account ${paymentDTO.bankAccount} (Reference Transaction ID – ${paymentDTO.transactionID}).</p>
								<p>Happy E-invoicing!</p>
								<p>For any further information, please check the contents of our website or visit our FAQ.</p>
							</c:when>
							<c:when test="${paymentDTO.status == 0 }">
								<h3><strong>Not paid</strong></h3>
							</c:when>
							<c:when test="${paymentDTO.status == 2 }">
								<h3><strong>In Progress</strong></h3>
							</c:when>
							<c:otherwise>
								<h3><strong>Not found</strong></h3>
							</c:otherwise>
						</c:choose>
						<br>
						<button type="button" class="sgds-button is-link is-rounded" onclick="window.history.back();">
							Back
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
<script type="text/javascript" src="<c:url value='/asset/js/jquery/dist/jquery.min.js'/>"></script>
</body>
</html>
