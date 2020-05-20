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
<%--     <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script> --%>
    <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
	
</head>

<body>
	<section class="sgds-section">
		<div class="sgds-container">
			<div class="content">
				<div class="row">
					<div class="col is-12">
						<h3><strong>E-INVOICING REGISTRATION GRANT</strong></h3>
						<p>The E-Invoicing registration grant is a new scheme from IMDA in partnership with ESG to help businesses to digitalise. As businesses looks for digital solutions to enable their staff to work remotely this grant will directly assist business to enable e-invoicing features on their existing or new solutions, allowing their finance staff to work remotely and create a network effect so all participating businesses can benefit from improved efficiency and reduced cost and be paid in a timely manner.</p>  
						<p>This grant provides businesses with a onetime payment of $200 per UEN, upon first registration to the E-Invoicing Network on or before 31 December 2020. This grant is applicable for businesses which valid, active and registered in Singapore on or before 25 March 2020. Payment will be disbursed by PayNow Corporate to the registered UEN (without suffix).</p>
						<div class="col is-8 is-offset-2">
						<img alt="" src="/asset/img/Registered.png" style="align-items: center; width: 100%">
						</div>
						<p>No application is required for the grant. Participants who qualify will receive the payout automatically provided they have complied with the above.</p>
						<u><a href="#">Click here to see terms and conditions, and excluded entities.</a></u>
						
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="sgds-section">
		<div class="sgds-container">
			<div class="content">
				<div class="row">
					<div class="col is-6 is-offset-3">
						<div class="sgds-accordion">
							<div class="sgds-accordion-set">
								<div class="sgds-accordion-body is-open">
									<form action="/" method="POST" class="sgds-box padding--lg has-background-white">
										<div class="row">
											<div class="col is-12">
												<h3 class="has-text-weight-semibold margin--bottom">
													Check Your Payment Status
												</h3>
											</div>
										</div>
										<div class="row">
											<div class="col is-3 field">
												<label for="name" class="label das-label require"><strong>Enter UEN</strong></label>
											</div>

											<div class="col is-9 field">
												<input type="text" class="input das-input is-shadowless" required="required" style="text-transform: uppercase;" name="uen" id="uen" placeholder="UEN">
												<input type="hidden" id="token" name="token" value="" />
												<label for="error" class="help is-danger" id="error" style="display: none;">UEN is invalid</label>
											</div>

										</div>
										<div class="row">
											<div class="padding--lg col is- 6 is-offset-3">
												<input name="submit" type="submit" class="sgds-button das-input is-success is-medium" id="submit" value="Submit" alt="Submit" title="Submit"/>
												<input name="submit" type="reset" class="sgds-button das-input is-danger is-medium" id="reset" value="Reset" alt="Reset" title="Reset"/>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="sgds-section">
		<div class="sgds-container">
			<div class="content">
				<div class="row">
					<div class="col is-12">
						<h4><strong><u>Additional Information</u></strong></h4>
						<ul>
							<li>Check Frequency Ask Questions on this here. [link to PDF FAQ on ERG]</li>
							<li>For assistance with Corporate PayNow registration please approach the participating banks of PayNow Corporate found at https://abs.org.sg/consumer-banking/pay-now</li>
							<li>For enquiries, please contact <a href="mailto:einvoice@imda.gov.sg">einvoice@imda.gov.sg</a>.</li>
						</ul>
												
					</div>
				</div>
			</div>
		</div>
	</section>
<script type="text/javascript" src="<c:url value='/asset/js/jquery/dist/jquery.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/asset/js/validateUEN.js'/>"></script>
<script>
$(document).ready(function() {
    $('form').submit(function(event) {
        search(event);
    });
    $('#reset').click(function(){
    	$("#uen").val("");
    	$("#error").attr("style","display: none;");
    })
});

function search(event){
    event.preventDefault();

    if (typeof grecaptcha !== 'undefined') {
        var siteKey = '${siteKey}';
        grecaptcha.execute(siteKey, {action: 'search'}).then(function(response) {
            $('#token').val(response);
            var formData= $('form').serialize();
            let uen = $("#uen").val();
            if(validString(uen)){
	            if(validateUEN(uen)[0]){
	            	$("#error").attr("style","display: none;");
	            	$.post("/payment/search",formData ,function(data) {
	                    if(data.success == "true") {
	                        window.location.href = 'result';
	                    }
	                })
	                    .fail(function(data) {
	                    });
	            }
	            else{
	            	document.getElementById("error").innerHTML = validateUEN(uen)[1];
	            	$("#error").attr("style","");
	            }
            }
            else{
            	document.getElementById("error").innerHTML = 'UEN is invalid';
            	$("#error").attr("style","");
            }
            
        });
    }
}

</script>
</body>

</html>