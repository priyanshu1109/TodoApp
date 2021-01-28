from django.shortcuts import render,redirect
from todoapp.forms import SignupForm,ProfileForm,TodoListForm
from todoapp.models import UserProfile,TodoList,TodoPoint,City,Connects,TodoAccess
from django.http import HttpResponse,JsonResponse
import json
from django.core import serializers
from django.db import connections,connection,reset_queries
from django.core.exceptions import ObjectDoesNotExist

import requests

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
import random
from .utils import sendOTP,reCaptcha,verifyEmail
# Create your views here.
def index_view(request):
	if request.session.get('_auth_user_id'):
		return redirect('/todoapp/dashboard')
	return redirect('/accounts/login')

def signup_view(request):
	if request.method=='POST':
		verified = reCaptcha(request)
		if verified:
			#-------Twilio OTP-----#
			#sendOTP()
			#-------Twilio OTP-----#
		
			form = SignupForm(request.POST)
			user = form.save()
			user.set_password(user.password) 
			user.is_active = 0
			#user.is_active = 1
			user.save()
			print('--------------')
			verifyEmail(request,user)
			return render(request,'todoapp/aftersignup.html')
		else:
			return redirect('/todoapp/signup')
	else:
		form = SignupForm()
		return render(request,'todoapp/signup.html',{'form':form})

def account_activation_view(request):
	uid = request.GET.get('id')
	print(uid)
	request.session['uid'] = uid
	request.session['_auth_user_id'] = uid
	uname = request.GET.get('uname')
	request.session['uname'] = uname
	act_code = request.GET.get('act_code')
	activation_code = str(request.session.get('activation_code'))
	try:
		user = User.objects.get(id=uid)
		if str(act_code)==activation_code:
			user.is_active=1
			user.save()
			return redirect('/todoapp/profile')
	except:
		return render(request,'todoapp/error.html')
	

def profile_view(request):
	request.session['login']=True
	if request.method=='POST':
		form = ProfileForm(request.POST)
		profpic = request.FILES.get('profpic')
		mobile = request.POST.get('mobile')
		city = request.POST.get('city')
		uid = request.session['_auth_user_id'] 
		print(uid)
		uf = UserProfile(user_id=uid,city_id=city,mobile=mobile,profpic=profpic)
		uf.save()
		return redirect('/accounts/login')

	else:
		form = ProfileForm()
		return render(request,'todoapp/profile.html',{'form':form})

@login_required
def showtodos_view(request):
	uid = request.session['_auth_user_id']
	user = User.objects.get(id=uid)
	userprof = UserProfile.objects.get(user_id=uid)
	todoid_ = TodoAccess.objects.filter(user_id=uid).values('todolist_id')
	alltodos = TodoList.objects.filter(userprof_id=userprof.id)|TodoList.objects.filter(id__in=todoid_)
	if request.method == 'POST':
		todoform = TodoListForm()
		title = request.POST.get('title')
		todotype = request.POST.get('urselection')
		todolist = TodoList(title=title,userprof_id=userprof.id,todotype_id=todotype,status_id=1)
		todolist.save()
		return redirect('/todoapp/showtodos/')
	else:
		todoform = TodoListForm()
		return render(request,'todoapp/todolist.html',{'todos':alltodos})

@login_required
def dashboard_view(request):
	flag = request.session.get('login')
	path = 'todoapp/dashboard.html'
	if flag==True:
		print('Already Logged In!')
	else:
		print('just now logged in')
		request.session.get('login')
		uid = request.session['_auth_user_id']
		try:
			userprof = UserProfile.objects.get(user_id=uid)
		except ObjectDoesNotExist:
			userprof=None
		user = User.objects.get(id=uid)
		if userprof==None:
			return redirect('/todoapp/profile')
		if userprof.usertype_id==1:
			path = 'todoapp/admin.html'
		elif userprof.usertype_id==2:
			path = 'todoapp/manager.html'
		else:
			pass
	return render(request,path)

def sendotp_view(request):
	mobnum = request.GET.get('mobile')

	#sendOTP(mobnum,request)
	return HttpResponse('true')

def checkotp_view(request):
	userotp = request.GET.get('otp')
	serverotp = request.session['otp']
	print(userotp)
	print(serverotp)
	resp = 'false'
	if(userotp==serverotp):
		resp = 'true'
	

	return HttpResponse(resp)

@login_required
def changetitle_view(request):
	new_title = request.GET.get('title') 
	todoid = request.GET.get('todoid')
	todoobj = TodoList.objects.get(id=todoid)
	todoobj.title = new_title
	todoobj.save()
	return HttpResponse("done")

@login_required
def delete_view(request):
	todoid = request.GET.get('todoid')
	todoobj = TodoList.objects.get(id=todoid)
	todoobj.delete()
	return HttpResponse("done")

@login_required
def savetextnote_view(request):
	todoid = request.GET.get('todo_id')
	textnote = request.GET.get('textnote')
	todoobj = TodoList.objects.get(id=todoid)
	todoobj.textnote = textnote
	todoobj.save()
	return HttpResponse('done')

@login_required
def savechecklist_view(request):
	points = request.GET.getlist('point')
	actives = request.GET.getlist('active')
	todo_id = request.GET.get('todoid')
	tp = TodoPoint.objects.filter(todolistid_id=todo_id)
	for i in tp:
		i.delete()
	j = 0
	for todop in points:
		active = actives[j]
		print(active)
		j+=1
		if active=='false':
			status_id=2
		else:
			status_id=1
		todopoint = TodoPoint(todopoint=todop,todolistid_id=todo_id,status_id=status_id)
		todopoint.save()
	return HttpResponse('done')

@login_required
def getallpoints_view(request):
	uid = request.session['_auth_user_id']
	userprof = UserProfile.objects.get(user_id=uid)
	resp = 'norecords'
	todoid = request.GET.get('todoid')
	recs = TodoList.objects.filter(userprof_id=userprof.id,id=todoid)
	if len(recs)==1:
		todopoints = TodoPoint.objects.filter(todolistid_id=todoid)
		if len(todopoints)!=0:
			ser = serializers.serialize('json',todopoints)
			point = json.loads(ser)
			resp = json.dumps(point)
	else:
		resp = 'Bad Request'
	return HttpResponse(resp)

def setpoint_view(request):
	todopointid = request.GET.get('todopoint_id')
	todopoint = TodoPoint.objects.get(id=todopointid)
	todopoint.status_id = 2
	todopoint.save()
	return HttpResponse('done')

def activepoint_view(request):
	todopointid = request.GET.get('todopoint_id')
	todopoint = TodoPoint.objects.get(id=todopointid)
	todopoint.status_id = 1
	todopoint.save()
	return HttpResponse('done')

def show_connect_view(request):
	return render(request,'todoapp/connects.html')

def search_user_view(request):
	search_key = request.GET.get('search_key')
	users = User.objects.filter(username__contains=search_key)
	ser = serializers.serialize('json',users)
	usrs = json.loads(ser)
	return HttpResponse(json.dumps(usrs))

def user_detail_view(request):
	userid = request.GET.get('userid')
	user = User.objects.get(id=userid)
	uid = request.session['_auth_user_id']
	userprof = UserProfile.objects.get(user_id=userid)
	city = City.objects.get(id=userprof.city_id)
	connects = Connects.objects.filter(from_user_id=uid,to_user_id=userid)|Connects.objects.filter(to_user_id=uid,from_user_id=userid)
	
	lst = [user,userprof,city]
	if len(connects)!=0:
		lst.append(connects.first())
	ser = serializers.serialize('json',lst)
	usrs = json.loads(ser)
	return HttpResponse(json.dumps(usrs))

def startconnection_view(request):
	touserid = request.GET.get('touserid')
	fromuserid = request.session['_auth_user_id']
	connect = Connects(from_user_id=fromuserid,to_user_id=touserid,status_id=4)
	connect.save()
	return HttpResponse('done')

def changeconnectionstatus_view(request):
	conid = request.GET.get('conid')
	stid = int(request.GET.get('statusid'))
	if stid==0:
		con = Connects.objects.get(id=conid)
		con.delete()
	else:
		con = Connects.objects.get(id=conid)
		con.status_id=stid
		con.save()
	return HttpResponse('done')

def collect_invite_view(request):
	uid = request.session['_auth_user_id']
	uid = int(uid)
	recs = dict()
	i = 0
	cons = Connects.objects.filter(from_user_id=uid,status_id=4)|Connects.objects.filter(to_user_id=uid,status_id=4)
	for con in cons:
		if con.from_user_id == uid:
			invid=con.to_user_id
		elif con.to_user_id == uid:
			invid=con.from_user_id
		else:
			invid=con.from_user_id
		user = User.objects.get(id=invid)
		userprof = UserProfile.objects.get(user_id=invid)
		city = City.objects.get(id=userprof.city_id)
		recs['obj'+str(i)] = {'username':user.username,'user_id':user.id,'mobile':userprof.mobile,'profpic':str(userprof.profpic),'city_name':city.city_name,'conid':con.pk,'from_user_id':con.from_user_id,'from_user_id':con.to_user_id,'status_id':con.status_id}
		i+=1
	#ser = serializers.serialize('json',lst)
	#resp = json.loads(ser)
	return JsonResponse(recs)
	
def collect_allconnect_view(request):
	uid = request.session['_auth_user_id']
	uid = int(uid)
	recs = dict()
	i = 0
	cons = Connects.objects.filter(from_user_id=uid,status_id=5)|Connects.objects.filter(to_user_id=uid,status_id=5)
	for con in cons:
		if con.from_user_id == uid:
			invid=con.to_user_id
		elif con.to_user_id == uid:
			invid=con.from_user_id
		else:
			invid=con.from_user_id
		user = User.objects.get(id=invid)
		userprof = UserProfile.objects.get(user_id=invid)
		city = City.objects.get(id=userprof.city_id)
		recs['obj'+str(i)] = {'username':user.username,'user_id':user.id,'mobile':userprof.mobile,'profpic':str(userprof.profpic),'city_name':city.city_name,'conid':con.pk,'from_user_id':con.from_user_id,'from_user_id':con.to_user_id,'status_id':con.status_id}
		i+=1
	return JsonResponse(recs)
	
def sharetodo_view(request):
	uid = request.GET.get('uid')
	todoid = request.GET.get('todoid')
	todoaccess = TodoAccess(todolist_id=todoid,user_id = uid)
	todoaccess.save()
	return HttpResponse('done')

@login_required
def activerecords_view(request):
	uid = request.session['_auth_user_id']
	userprof = UserProfile.objects.get(user_id=uid)
	act_recs = TodoList.objects.filter(userprof_id=userprof.pk).order_by('-updated_at')
	lst = act_recs[0:4:1]
	d = dict()
	i = 0
	for rec in lst:
		d['obj'+str(i)] = {'todoid':rec.id,'title':rec.title,'created':rec.created,'todotypeid':rec.todotype_id}
		i+=1
	return JsonResponse(d)

@login_required
def sharedrecords_view(request):
	uid = request.session['_auth_user_id']
	userprof = UserProfile.objects.get(user_id=uid)
	todoacc = TodoAccess.objects.filter(user_id=uid).values('todolist_id').order_by('-id')
	recs = TodoList.objects.filter(id__in=todoacc)[0:3:1]
	d = dict()
	i = 0
	for rec in recs:
		d['obj'+str(i)] = {'todoid':rec.id,'title':rec.title,'created':rec.created,'todotypeid':rec.todotype_id}
		i+=1
	print(d)
	return JsonResponse(d)

def newinvites_view(request):
	uid = request.session['_auth_user_id']
	cons = Connects.objects.filter(to_user_id=uid,status_id=4).values('from_user_id').order_by('-id')
	users = User.objects.filter(id__in=cons)[:3:1]
	print(users)
	resp = dict()
	i=0
	for user in users:
		prof = UserProfile.objects.get(user_id=user.id)
		#city = City.objects.get(id=prof.city)
		resp['obj'+str(i)]={'username':user.username,'joined':user.date_joined,'email':user.email,'mobile':prof.mobile,'profpic':str(prof.profpic),'city':str(prof.city)}
		i+=1
	print(resp)
	i=1
	return JsonResponse(resp)

@login_required
def myprofile_view(request):
	uid = request.session['_auth_user_id']
	user = User.objects.get(id=uid)
	userprof = UserProfile.objects.get(user_id=uid)
	return render(request,'todoapp/my_profile.html',{'user_details':user,'user_profile':userprof})