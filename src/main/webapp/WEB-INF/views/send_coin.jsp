
<div id="sendPage" style="display: none;">
<div class="content-header row">
	<div class="content-header-left col-md-6 col-xs-12 mb-1">
		<h2 class="content-header-title">Send coin</h2>
	</div>
</div>

<br>
<div class="row">
	<div class="col-xs-12">
		<div class="input-group">
			<div class="row">
				<label>privateKey</label>
				<textarea class="form-control" aria-label="With textarea" name="privateKeySendPage" id="privateKeySendPage"></textarea>
			</div>
			<div class="row">
				<label>publicKey's reciepient</label>
				<textarea class="form-control" aria-label="With textarea" name="publicKeySendPage" id="publicKeySendPage"></textarea>
			</div>
			<div class="row">
				<label>Value</label>
				<textarea class="form-control" aria-label="With textarea" name="valueSendPage" id="valueSendPage"></textarea>
			</div>
			<div class="row">
				<button type="button" id="sendOfSendPage">Send</button>
			</div>
		</div>
	</div>
</div>
<br>
<hr>
<br>
<div class="row">
	<div class="col-xs-12">
		<div class="input-group">
			<table class="table table-striped" id="tableSendCoin" style="display: none;">
			  <thead>
			    <tr>
			      <th scope="col">Transaction Id</th>
			      <th scope="col">Sender</th>
			      <th scope="col">Reciepient</th>
			      <th scope="col">Value</th>
			    </tr>
			  </thead>
			  <tbody id="tbodySendCoin">
			  </tbody>
			</table>
			<label id="sendFailed" style="display: none;">Send coin failed</label>
		</div>
	</div>
</div>
</div>