window.onload = initAll;

function initAll(){
	getAllElements();
	setAllActions();
}

var srch_fld,srch_res,connects,records,invite,all_conn,loader;
function getAllElements(){
	srch_fld = document.getElementById('srch_fld')
	srch_res = document.getElementById('search_result')
	connects = document.getElementById('connects')
	records = document.getElementById('_records')
	invite = document.getElementById('invite')
	all_conn = document.getElementById('all_connect')
	loader = document.getElementById('loader')
}

function setAllActions(){
	srch_fld.onkeyup = function(e){
		if (e.keyCode==13){
			loader.style.display="inline"
			searchUser();
		}
		
	}
	srch_fld.onfocus = function(){
		srch_res.style.display = 'none'
	}
	collectAllConn()
	invite.onclick = collectInvite;
	all_conn.onclick = collectAllConn;
}

var srchreq;
function searchUser(){
	srchreq = new XMLHttpRequest()
	srchreq.open('get','/todoapp/searchuser/?search_key='+srch_fld.value,true)
	srchreq.onreadystatechange = showSearchResult;
	srchreq.send()
}

function showSearchResult(){
	if (srchreq.readyState==4 && srchreq.status==200){
		var search = JSON.parse(srchreq.responseText)
		srch_res.innerHTML = ''
		for (i=0;i<search.length ;i++ )
		{
			var obj = document.createElement('div')
			obj.className='result_rec'
			obj.innerHTML = search[i].fields.username
			obj.userid = search[i].pk
			srch_res.appendChild(obj)
			obj.onmouseover  = function(){
				this.className = 'result_rec result_rec_ov'
			}
			obj.onmouseout  = function(){
				this.className = 'result_rec result_rec_ot'	
			}
			obj.onclick = userRecords;
		}
		loader.style.display="none"
		srch_res.style.display = 'block'
	}
}

var dtlreq;
function userRecords(){
	dtlreq = new XMLHttpRequest()
	dtlreq.open('get','/todoapp/userdetail/?userid='+this.userid,false)
	dtlreq.onreadystatechange = showUserDetails;
	dtlreq.send()
}

function showUserDetails(){
	if(dtlreq.readyState==4 && dtlreq.status==200){
		srch_res.style.display = 'none'
		
		resp = JSON.parse(dtlreq.responseText);
		user=resp[0]
		userprof = resp[1]
		city = resp[2]
		records.innerHTML = ''
		connect = resp[3]
		showOneConnect(user,userprof,city,connect)
	}
}

function showOneConnect(user,userprof,city,connect){
	var img = document.createElement('img')
	img.className = 'prof_pic'
	img.src = '/static/images/'+userprof.fields.profpic
	records.append(img)
	var span = document.createElement('span')
	
	span.className = 'prof_name'
	span.innerHTML = user.fields.username
	records.append(span)
	var span1 = document.createElement('span')
	span1.className = 'prof_city'
	span1.innerHTML = city.fields.city_name
	records.append(span1)	
	var span2 = document.createElement('span')
	span2.className = 'prof_mobile'
	span2.innerHTML = userprof.fields.mobile
	records.append(span2)
	var connect_span = document.createElement('span')
	connect_span.className = 'prof_con_status'
	records.append(connect_span)
	var cur_st = document.createElement('span')
	cur_st.className = 'curr_st'
	var cur_act = document.createElement('span')
	cur_act.className = 'action'
	if(!connect){
		cur_st.innerHTML = 'Not Connected'
		cur_act.innerHTML = 'Connect'
		cur_act.touserid = user.pk
		cur_act.onclick = startConnection;
		connect_span.appendChild(cur_st)
		connect_span.appendChild(cur_act)
		
	}else{
		cur_act.conid = connect.pk
		var stid = connect.fields.status;
		cur_st.innerHTML = stid==4?'Pending':stid==5?'Accepted':'Rejected'
		cur_act.onclick = changeConnectionStatus;
		if (stid==4){
			if(user.pk=connect.fields.from_user){
				cur_act.innerHTML = 'Accept'
				//action=1(Accept)|2(Reject)|3(Disconnect)|4(Cancel)
				cur_act.action = 1
				var	cur_act2 = document.createElement('span')
				cur_act2.className = 'action2'
				cur_act2.innerHTML = 'Reject'
				cur_act2.conid = connect.pk
				cur_act2.action = 2
				cur_act2.onclick = changeConnectionStatus;
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
				connect_span.appendChild(cur_act2)
			}else{
				cur_act.innerHTML = 'Cancel'
				cur_act.action = 4
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			} 
		}else if(stid==5){
			connect_span.appendChild(cur_st)
			cur_act.className = 'action2'
			cur_act.innerHTML = 'Disconnect'
			cur_act.action = 3
			connect_span.appendChild(cur_act)
		}else{
			if(user.pk==connect.fields.from_user){
				cur_act.innerHTML = 'Accept'
				cur_act.action = 1
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			}else{
				cur_act.innerHTML = 'Cancel'
				cur_act.className = 'action2'
				cur_act.action = 4
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			}	
		}
	}
}

var conreq;
function startConnection(){
	conreq = new XMLHttpRequest()
	conreq.open('get','/todoapp/startconnection/?touserid='+this.touserid,false)
	conreq.onreadystatechange = afterConnection;
	conreq.send()
}

function afterConnection(){
	if (conreq.status==200 && conreq.readyState==4){
		if(conreq.responseText=='done'){
			records.innerHTML = ''
			var dv = document.createElement('div')
			dv.className = 'message .message_success'
			dv.innerHTML = 'Connection Established succesfully'
			records.append(dv)
		}
	}
}

var constreq;
function changeConnectionStatus(){
	var stid = this.action==1?5:this.action==2?6:0
	constreq = new XMLHttpRequest()
	constreq.open('get','/todoapp/changeconstatus/?conid='+this.conid+'&statusid='+stid,false)
	constreq.onreadystatechange = afterConStatusChange;
	constreq.send()
}

function afterConStatusChange(){
	if (constreq.status==200 && constreq.readyState==4){
		if(constreq.responseText=='done'){
			records.innerHTML = ''
			var dv = document.createElement('div')
			dv.className = 'message .message_success'
			dv.innerHTML = 'Connection Established succesfully'
			records.append(dv)
		}
	}
}

var invreq;
function collectInvite(){
	all_conn.className = 'con_link'
	invite.className = 'con_link con_act'
	invreq = new XMLHttpRequest()
	invreq.open('get','/todoapp/collectinvites',false)
	invreq.onreadystatechange = showInvites;
	invreq.send()
}

function showInvites(){
	if (invreq.status==200 && invreq.readyState==4){
		var res = JSON.parse(invreq.responseText)
		records.innerHTML = ''
		for(prop in res){
			showOneConnectAtATime(res[prop])
		}
	}
}

var allconreq;
function collectAllConn(){
	all_conn.className = 'con_link con_act'
	invite.className = 'con_link con_link'
	allconreq = new XMLHttpRequest()
	allconreq.open('get','/todoapp/collectallconnections',false)
	allconreq.onreadystatechange = showAllConnect;
	allconreq.send()
}

function showAllConnect(){
	if (allconreq.status==200 && allconreq.readyState==4){
		var res = JSON.parse(allconreq.responseText)
		records.innerHTML = ''
		for(prop in res){
			showOneConnectAtATime(res[prop])
		}
	}
}

function showOneConnectAtATime(obj){
	var record1 = document.createElement('div')
	record1.className = 'records1'
	var img = document.createElement('img')
	img.className = 'prof_pic'
	img.src = '/static/images/'+obj.profpic
	record1.append(img)
	var span = document.createElement('span')
	
	span.className = 'prof_name'
	span.innerHTML = obj.username
	record1.append(span)
	var span1 = document.createElement('span')
	span1.className = 'prof_city'
	span1.innerHTML = obj.city_name
	record1.append(span1)	
	var span2 = document.createElement('span')
	span2.className = 'prof_mobile'
	span2.innerHTML = obj.mobile
	record1.append(span2)
	var connect_span = document.createElement('span')
	connect_span.className = 'prof_con_status'
	record1.append(connect_span)
	var cur_st = document.createElement('span')
	cur_st.className = 'curr_st'
	var cur_act = document.createElement('span')
	cur_act.className = 'action'
	if(!obj){
		cur_st.innerHTML = 'Not Connected'
		cur_act.innerHTML = 'Connect'
		cur_act.touserid = obj.user_id
		cur_act.onclick = startConnection;
		connect_span.appendChild(cur_st)
		connect_span.appendChild(cur_act)
		
	}else{
		cur_act.conid = obj.conid
		var stid = obj.status_id;
		cur_st.innerHTML = stid==4?'Pending':stid==5?'Accepted':'Rejected'
		cur_act.onclick = changeConnectionStatus;
		if (stid==4){
			if(obj.user_id!=obj.from_user_id){
				cur_act.innerHTML = 'Accept'
				//action=1(Accept)|2(Reject)|3(Disconnect)|4(Cancel)
				cur_act.action = 1
				var	cur_act2 = document.createElement('span')
				cur_act2.className = 'action2'
				cur_act2.innerHTML = 'Reject'
				cur_act2.conid = obj.conid
				cur_act2.action = 2
				cur_act2.onclick = changeConnectionStatus;
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
				connect_span.appendChild(cur_act2)
			}else{
				cur_act.innerHTML = 'Cancel'
				cur_act.action = 4
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			} 
		}else if(stid==5){
			connect_span.appendChild(cur_st)
			cur_act.className = 'action2'
			cur_act.innerHTML = 'Disconnect'
			cur_act.action = 3
			connect_span.appendChild(cur_act)
		}else{
			if(obj.user_id==obj.from_user_id){
				cur_act.innerHTML = 'Accept'
				cur_act.action = 1
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			}else{
				cur_act.innerHTML = 'Cancel'
				cur_act.className = 'action2'
				cur_act.action = 4
				connect_span.appendChild(cur_st)
				connect_span.appendChild(cur_act)
			}	
		}
	}
	records.appendChild(record1)
}

