window.onload = initAll;

function initAll(){
	getAllElements();
	setAllActions();
}

var active_recs,shared_recs,new_invites;
function getAllElements(){
	active_recs = document.getElementById('active_recs')
	shared_recs = document.getElementById('shared_recs')
	new_invites = document.getElementById('new_invites')
}

function setAllActions(){
	collectAllActiveRecords();
	collectAllShareRecords();
	collectAllNewInvites();
}

var ninvreq;
function collectAllNewInvites(){
	ninvreq = new XMLHttpRequest();
	ninvreq.open('get','/todoapp/activenewinvites',false)
	ninvreq.onreadystatechange = showNewInvitesTodos;
	ninvreq.send()
}

function showNewInvitesTodos(){
	if (ninvreq.readyState==4 && ninvreq.status==200){
		var res = JSON.parse(ninvreq.responseText)
		displayRec_(res,new_invites)
	}
}

var shrreq;
function collectAllShareRecords(){
	shrreq = new XMLHttpRequest();
	shrreq.open('get','/todoapp/allsharedrecs',false)
	shrreq.onreadystatechange = showActiveShareTodos;
	shrreq.send()
}

function showActiveShareTodos(){
	if (shrreq.readyState==4 && shrreq.status==200){
		var res = JSON.parse(shrreq.responseText);
		displayRec(res,shared_recs)
	}
}

var actreq;
function collectAllActiveRecords(){
	actreq = new XMLHttpRequest();
	actreq.open('get','/todoapp/activerecords',false)
	actreq.onreadystatechange = showActiveRecords;
	actreq.send()
}

function showActiveRecords(){
	if (actreq.readyState==4 && actreq.status==200){
		var res = JSON.parse(actreq.responseText);
		displayRec(res,active_recs)
	}
}

function more(){
	var more = document.createElement('a')
		more.className = 'actmore'
		more.innerHTML = 'more>'
		more.href='/todoapp/showtodos/'
	return more
}

function displayRec(res,block){
	console.log(res)
	for (prop in res){
			var dv = document.createElement('div')
			dv.className = 'active_box'
			var ttl = document.createElement('span')
			ttl.innerHTML = res[prop].title;
			ttl.className = 'actttl'
			var crt = document.createElement('span')
			crt.innerHTML = res[prop].created.split('T')[0];
			crt.className = 'actcrt'
			var crti = document.createElement('span')
			crti.innerHTML = res[prop].created.split('T')[1];
			crti.className = 'acttime'
			var typ = document.createElement('img')
			typ.className = 'acttyp'
			//typ.style.height = '35px'
			if (res[prop].todotypeid==1){
				typ.src = '/static/images/textnote1.jpg'
			}else{
				typ.src = '/static/images/checklist.png';
			}
			dv.appendChild(typ)
			dv.appendChild(ttl)
			dv.appendChild(crt)
			block.appendChild(dv)
		}
		block.appendChild(more())
}

function displayRec_(res,block){
	for (prop in res){
			var dv = document.createElement('div')
			dv.className = 'active_box'
			var ttl = document.createElement('span')
			ttl.innerHTML = res[prop].username;
			ttl.className = 'actttl'
			var crt = document.createElement('span')
			crt.innerHTML = res[prop].city;
			crt.className = 'actcrt'
			var typ = document.createElement('img')
			typ.className = 'acttyp'
			typ.src = '/static/images/'+res[prop].profpic;
			dv.appendChild(typ)
			dv.appendChild(ttl)
			dv.appendChild(crt)
			block.appendChild(dv)
		}
	block.appendChild(more())
}