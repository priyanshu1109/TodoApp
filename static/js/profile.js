window.onload = initAll;

function initAll(){
	getAllElements();
	setAllActions();
}

function getAllElements(){
	otp_btn = document.getElementById('send_otp');
	mobile = document.getElementById('id_mobile')
	otp_box = document.getElementById('otp_box')
	otp = document.getElementById('otp')
	sv_otp = document.getElementById('sv_otp')
	otp_ctrl = document.getElementById('otp_row')
	sv_btn = document.getElementById('sv_btn')
}

function setAllActions(){
	otp_btn.onclick = sendOTP
	sv_otp.onclick = checkOTP
}

var otpreq;
function sendOTP(){
	if(mobile.value.length==10&&!isNaN(mobile.value)){
		otpReq = new XMLHttpRequest()
		otpReq.open('GET','/todoapp/sendotp/?mobile='+mobile.value,true)
		otpReq.onreadystatechange = otpResponse;
		otpReq.send()
	}else{
		alert('Please enter a valid number!!')
	}
}

function otpResponse(){
	if (otpReq.readyState==4&&otpReq.status==200){
		if (otpReq.responseText=='true')
		{
			otp_box.style.display='inline'
		}
	}
}

function checkOTP(){
	otpval = otp.value
	if(otpval.length==6&&!isNaN(otpval)){
		coreq = new XMLHttpRequest()
		coreq.open('get','/todoapp/checkotp/?otp='+otpval,true)
		coreq.onreadystatechange = chkOtpResponse
		coreq.send()
	}
}

function chkOtpResponse(){
	if (coreq.readyState==4&&coreq.status==200){
		if (coreq.responseText=='true'){
			otp_box.style.display='none'
			otp_btn.style.display = 'none'
			sv_btn.style.visibility='visible'
		}
	}
}