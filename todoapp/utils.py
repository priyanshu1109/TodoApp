from twilio.rest import Client
import json
import requests
from django.core.mail import send_mail
import random

def sendOTP(mobnum,request):
	# Your Account Sid and Auth Token from twilio.com/console
	# DANGER! This is insecure. See http://twil.io/secure
	account_sid = 'ACa393ca0c99da652472a9b2b1d909fefb'
	auth_token = '6fdd4c332cf0bfa0ed615f135ab9fc86'
	client = Client(account_sid, auth_token)
	otp = str(random.randrange(111111,999999))
	request.session['otp']=otp
	message = client.messages \
					.create(
						 body="Hello From ISRDC todoapp!!Your OTP:"+otp,
						 from_='+19144255168',
						 to='+91'+mobnum
					 )

	print(message.sid)

def reCaptcha(request):
	responsekey = request.POST.get('g-recaptcha-response')
	secretkey = '6LcRiO8UAAAAAF0O3RXAR-8HZh294VbUeQyw39-F'
	captchadata = {'secret':secretkey,'response':responsekey}
	resp = requests.post('https://www.google.com/recaptcha/api/siteverify',captchadata)
	respdict = json.loads(resp.text)
	return respdict['success']
	
def verifyEmail(request,user):
	activation_code = random.randrange(111111111111,999999999999)
	request.session['activation_code']=activation_code
	#send_mail(<subject>,<mail>,[email1,email2],fail_silently=False)
	subject = 'Welcome to Todoapp!!'
	message = '''we are happy to see you on our platform <br /><br />
				Please click over the <a href='http://localhost:8000/todoapp/actact?id={}&act_code={}&uname={}'>link</a> to activate your account
				'''.format(user.id,activation_code,user.first_name+' '+user.last_name)
	send_mail(subject,'','TodoApp Welcomes You',[request.POST.get('email')],fail_silently=False,html_message=message)