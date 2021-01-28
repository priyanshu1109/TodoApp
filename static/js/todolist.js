//on drag and drop checkbox is not swapping now

window.onload = main;

function main(){
	getAllElements()
	setAllActions()
}

var txtnote,chklist,urselectiontext,urselection,edit,recbox;
var main_table,textnote_box,checklist_box;
var save,title_type,title_type_2,title_text,title_text_2,title_created,title_created_2,title_text_edit,title_text_delete;
var txtnote_edit,txtnote_data,del_todo
var checklist_box,rec_box,rec_box_cb;

var tbody1,tbody2,share,share_cb
var success_msg,success_msg_2;

function getAllElements(){
	txtnote = document.getElementById('textnote')
	share = document.getElementById('share')
	share_cb = document.getElementById('share_cb')
	rec_box = document.getElementById('rec_box')
	rec_box_cb = document.getElementById('rec_box_cb')
	checklist_table = document.getElementById('checklist_box')
	checklist_table_checked = document.getElementById('checklist_box_checked')
	chklist = document.getElementById('chklist')
	urselectiontext = document.getElementById('urselectiontext')
	urselection = document.getElementById('urselection')
	recbox = document.getElementById('my_todo_table')
	main_table = document.getElementById('main_table')
	textnote_box = document.getElementById('textnote_main_box')
	checklist_box = document.getElementById('checklist_main_box')
	title_type = document.getElementById('title_type')
	title_type_2 = document.getElementById('title_type_2')
	title_text = document.getElementById('title_text')
	title_text_edit = document.getElementById('title_text_edit')
	title_text_2 = document.getElementById('title_text_2')
	title_created = document.getElementById('title_created')
	title_created_2 = document.getElementById('title_created_2')
	save = document.getElementById('save_text')
	save1 = document.getElementById('save_check')
	del_todo = document.getElementById('delete_check')
	txtnote_edit = document.getElementById('txtnote_edit')
	tbody1 = document.getElementById('tbody1')
	tbody2 = document.getElementById('tbody2')
	success_msg = document.getElementById('suc_mess_1')
	success_msg_2 = document.getElementById('suc_mess_2')
	title_text_delete = document.getElementById('delete_text')
	var i=1
	while(true){
		var elm = document.getElementById('_edit_'+i)
		var hdn = document.getElementById('todo_id_'+i)
		var del = document.getElementById('_del_'+i)
		var ttlsp = document.getElementById('ttl_txt_'+i)
		var created = document.getElementById('_created_'+i)
		var todotype = document.getElementById('todo_type_'+i)
        txtnote_data = document.getElementById('txnote_data_'+i)	
		i++
		if (hdn!=null)
		{
			elm.todoid = hdn.value
		}
		if(!elm){
			break;
		}else{
			ttlsp.todoid = hdn.value
			ttlsp.todotype = todotype.value
			ttlsp.created = created.innerHTML
			ttlsp.txtnote = txtnote_data.value
			ttlsp.onclick = showTodoBox;
			
			elm.onclick = function(){
				var rec_id = this.id.substr(6)
				var ttl = document.getElementById('ttl_txt_'+rec_id)
				var ttl_edit = document.getElementById('ttl_edit_'+rec_id)
				ttl.style.display='none'
				ttl_edit.style.display = 'inline'
				ttl_edit.value = ttl.innerHTML
				ttl_edit.focus()
				ttl_edit.todoid = this.todoid
				ttl_edit.recnum = rec_id
				ttl_edit.onblur = saveChanges;/*function(){
					ttl.style.display='inline'
					ttl_edit.style.display = 'none'
				}*/
			};
			del.todoid = hdn.value
			save.todo_id = hdn.value
			title_text_edit.todoid = hdn.value
	
			del.onclick = del_record
			title_text_delete.onclick = deleteTodo;
		}
	}
	del_todo.onclick = deleteTodo
}

function setAllActions(){

	chklist.txt = 'Check List'
	txtnote.txt = 'Text Note'
	txtnote.typeid=1
	chklist.typeid=2
	txtnote.onclick =chklist.onclick=todoTypeFunct;
	share.onclick = showAllConnects;
	share_cb.onclick = showAllConnectsCb;
	title_text.onclick = function(){
		title_text.style.display = 'none'
		title_text_edit.style.display = 'inline'
		title_text_edit.value = title_text.innerHTML
		title_text_edit.focus()
	}
	title_text_edit.onblur = function(){
		if (title_text_edit.value!=title_text.innerHTML){
			saveTitle2()
		}else{
			title_text.style.display = 'inline'
			title_text_edit.style.display = 'none'
		}
	}
	save.onclick = function(){
		if (save.todotypeid == 1){
			saveTextNote()
		}else{
			saveCheckNote()
		}
	};

	save1.onclick = function(){
		saveCheckNote()
	}
}

//-------------------------------------

var allconreq;
function showAllConnects(){
	allconreq = new XMLHttpRequest()
	allconreq.open('get','/todoapp/collectallconnections',false)
	allconreq.onreadystatechange = showAllConnect;
	allconreq.send()
}

function showAllConnect(){
	if (allconreq.status==200 && allconreq.readyState==4){
		var res = JSON.parse(allconreq.responseText)
		rec_box.innerHTML = ''
		rec_box.style.visibility = 'visible'
		for(prop in res){
			var obj = res[prop]
			var dv = document.createElement('div')
			dv.className = 'conrec_'
			dv.innerHTML = obj.username
			dv.user_id = obj.user_id
			dv.onmouseover = function(){
				this.className = 'conrec_ov'
			};
			dv.onmouseout = function(){
				this.className = 'conrec_ot'
			};
			dv.onclick = saveTodoShare(save.todo_id,dv.user_id);
			rec_box.appendChild(dv)
		}
	}
}

function showAllConnectsCb(){
	allconreq = new XMLHttpRequest()
	allconreq.open('get','/todoapp/collectallconnections',false)
	allconreq.onreadystatechange = showAllConnectCb;
	allconreq.send()
}

function showAllConnectCb(){
	if (allconreq.status==200 && allconreq.readyState==4){
		var res = JSON.parse(allconreq.responseText)
		rec_box_cb.innerHTML = ''
		rec_box_cb.style.visibility = 'visible'
		for(prop in res){
			var obj = res[prop]
			var dv = document.createElement('div')
			dv.className = 'conrec_'
			dv.innerHTML = obj.username
			dv.user_id = obj.user_id
			/*alert(save1.todo_id)*/
			dv.onmouseover = function(){
				this.className = 'conrec_ov'
			};
			dv.onmouseout = function(){
				this.className = 'conrec_ot'
			};
			dv.onclick = saveTodoShare(save1.todo_id,dv.user_id);
			rec_box_cb.appendChild(dv)
		}
	}
}

var sharereq
function saveTodoShare(todoid,userId){
	sharereq = new XMLHttpRequest()
	sharereq.open('get','/todoapp/sharetodo/?uid='+userId+'&todoid='+todoid,true)
	sharereq.onreadystatechange = afterTodoShare;
	sharereq.send()
}

function afterTodoShare(){
	if(sharereq.readyState==4 && sharereq.status==200){
		rec_box.style.visibilty = 'false'
		rec_box_cb.style.visibilty = 'false'
	}
}
//-------------------------------------

function todoTypeFunct(){
	document.getElementById('textnote').classList.remove('selected_image');
	document.getElementById('chklist').classList.remove('selected_image');
	urselectiontext.innerHTML = "Selected todotype:"+this.txt
	this.classList.add('selected_image')
	urselection.value = this.typeid
}

var ttlreq;
function saveChanges(){
	var ttl = document.getElementById('ttl_txt_'+this.recnum)
	ttl.recnum = this.recnum
	var ttl_edit = document.getElementById('ttl_edit_'+this.recnum)	
	var loader = document.getElementById('_loader'+this.recnum)	
	if(ttl.innerHTML!=ttl_edit.value){
		loader.style.display = 'inline'
		ttlreq = new XMLHttpRequest()
		ttlreq.recnum = this.recnum
		ttlreq.open('get','/todoapp/changetitle/?title='+this.value+'&todoid='+this.todoid,false)
		ttlreq.onreadystatechange = afterTitleSave;
		ttlreq.send()
	}else{
		ttl.style.display='inline'
		ttl_edit.style.display = 'none'
	}
}

function afterTitleSave(){
	if (ttlreq.readyState==4 && ttlreq.status==200){
		if(ttlreq.responseText=='done'){
			var ttl = document.getElementById('ttl_txt_'+ttlreq.recnum)
			var ttl_edit = document.getElementById('ttl_edit_'+ttlreq.recnum)	
			var loader = document.getElementById('_loader'+ttlreq.recnum)	
			loader.style.display = 'none'
			ttl.style.display='inline'
			ttl_edit.style.display = 'none'
			ttl.innerHTML = ttl_edit.value
		}
	}
}

var delReq;
function del_record(){
	delReq = new XMLHttpRequest();
	delReq.recordbox = this.parentNode.parentNode.rowIndex
	delReq.open('get','/todoapp/deltodo/?todoid='+this.todoid,false);
	delReq.onreadystatechange = afterDel;
	delReq.send()
}

function afterDel(){
	if (delReq.readyState==4 && delReq.status==200)
	{
		if(delReq.responseText=='done'){
			recbox.deleteRow(delReq.recordbox)
		}
	}
}

var pointreq;
var cellClass = new Array('check_drag','check_lft','check_mid','check_rht')
var row_index = 0
function showTodoBox(){
	main_table.style.display='none'
	if (this.todotype == 1)
	{
		title_text.innerHTML = this.innerHTML
		title_created.innerHTML = this.created
		title_type.src = '/static/images/textnote1.jpg'
		textnote_box.style.display = 'block'
		save.todo_id = this.todoid
		save.todotypeid = 1
		txtnote_edit.value = this.txtnote
		var cross = document.getElementsByClassName('close')
		cross[0].onclick = function(){
			textnote_box.style.display = 'none'	
			main_table.style.display = 'block'
		}
	}else{
		save1.todo_id = this.todoid
		save1.todotypeid = 2
		title_text_2.innerHTML = this.innerHTML
		title_created_2.innerHTML = this.created
		title_type_2.src = '/static/images/checklist.png'
		checklist_box.style.display = 'block'
		pointreq = new XMLHttpRequest();
		pointreq.open('get','/todoapp/getallpoints/?todoid='+this.todoid,true)
		pointreq.onreadystatechange=showPoints;
		pointreq.send()
		
		var cross = document.getElementsByClassName('close')
		cross[0].onclick = function(){
			checklist_box.style.display = 'none'	
			main_table.style.display='block'
		}
}
}

function showPoints(){
	if (pointreq.readyState==4 && pointreq.status==200){
		var rec = pointreq.responseText
		if(rec == 'norecords'){
			checkListRow()
		}else if(rec=='Bad Request'){
			alert('You are not allowed to get access')
		}else{
			var points = JSON.parse(pointreq.responseText);
			for(i=0;i<points.length;i++){
				if(points[i].fields.status==1){
				checkListRow(points[i].fields.todopoint,points[i].pk)
				}else{
					doneCheckListRow(points[i].fields.todopoint,points[i].pk)
				}
			}
		}
	}
}

var svreq1;
function saveTextNote(){
	svreq1 = new XMLHttpRequest()
	svreq1.open('get','/todoapp/savetextnote/?todo_id='+save.todo_id+'&textnote='+txtnote_edit.value,false)
	svreq1.setRequestHeader('Content-Type','text/plain')
	svreq1.onreadystatechange = afterTextNoteSave
	svreq1.send()
}

function afterTextNoteSave(){
	if (svreq1.readyState==4 && svreq1.status==200){
		if (svreq1.responseText=='done'){
			textnote_box.style.display = 'block'	
			main_table.style.display = 'none'
			success_msg.style.display = 'block';
			setTimeout(function(){success_msg.style.display = 'none';},2000)
		}
	}
}

var ttlreq1;
function saveTitle2(){
	ttlreq1 = new XMLHttpRequest()
	ttlreq1.recnum = this.recnum
	ttlreq1.open('get','/todoapp/changetitle/?title='+title_text_edit.value+'&todoid='+title_text_edit.todoid,false)
	ttlreq1.onreadystatechange = afterTitleSave2;
	ttlreq1.send()
}

function afterTitleSave2(){
	if (ttlreq1.readyState==4 && ttlreq1.status==200){
		if (ttlreq1.responseText=='done'){
			title_text.style.display = 'inline'
			title_text_edit.style.display = 'none'
		}
	}
}

var ttl_del
function deleteTodo(){
	ttl_del = new XMLHttpRequest()
	ttl_del.open('get','/todoapp/deltodo/?todoid='+save.todo_id,false)
	ttl_del.onreadystatechange = afterDelTodo
	ttl_del.send()
}

function afterDelTodo(){
	if (ttl_del.readyState==4 && ttl_del.status==200)
	{
		if(ttl_del.responseText=='done'){
			window.location.href = '/todoapp/showtodos/'
		}
	}
}

function checkListRow(todopoint,todopointid){
	//var row = checklist_table.insertRow(row_index)
	var row = tbody1.insertRow(row_index)
	row.id = '_row_id_'+row_index
	var img = document.getElementsByTagName('img')[0]
	img.draggable = true
	checklist_table.rows
	row.ondragstart = function(e){
		var dragrow = row
		var inp = this.getElementsByTagName('input')[1]
		e.dataTransfer.setData('inpid',inp.id)
		e.dataTransfer.setData('drgrowindex',dragrow.rowIndex)
	};
	row.ondragover = function(e){
		e.preventDefault()
	};	
	
	row.ondrop = function(e){
		e.preventDefault()
		var droprowindex = this.rowIndex
		var draginp = e.dataTransfer.getData('inpid')
		var draginpfld = document.getElementById(draginp)
		var temp = draginpfld.value

		var dragrowindex = e.dataTransfer.getData('drgrowindex')
		if(dragrowindex<droprowindex){
			for(i=parseInt(dragrowindex);i<parseInt(droprowindex);i++){
				var a = tbody1.rows[i].getElementsByTagName('input')[1]
				var b = tbody1.rows[i+1].getElementsByTagName('input')[1]
				a.value=b.value
			}
			if (i==droprowindex){
				b.value = temp
			} 
		}else{
			for(i=parseInt(dragrowindex);i>parseInt(droprowindex);i--){
				var a = tbody1.rows[i].getElementsByTagName('input')[1]
				var b = tbody1.rows[i-1].getElementsByTagName('input')[1]
				a.value=b.value
			}
			if (i==droprowindex){
				b.value = temp
			}
		}
		saveCheckNote();
	};
	for (j=0;j<4;j++ ){
				var cell = row.insertCell(j)
				cell.className = cellClass[j]
				if(j==0){
					var dragimg = document.createElement('img')
					dragimg.src = '/static/images/3dots.png'
					dragimg.className = '_dragimg_'
					cell.appendChild(dragimg)
					dragimg.id = '_drag_'+row_index	
				}else if (j==1){
					var chk = document.createElement('input')
					chk.type = 'checkbox'
					chk.className = '_chk_'
					if (todopoint)
					{
						chk.todopoint = todopoint
						chk.todopointid = todopointid
					}
					chk.onclick = moveToDoneCheckList
					cell.appendChild(chk)
				}else if(j==2){
					var ptfield = document.createElement('input')
					ptfield.active = true
					ptfield.className = '_ptfield_'
					ptfield.id = '_ptfield_'+row_index
					if(todopoint){
						ptfield.value = todopoint
					}
					ptfield.onkeyup = function(e){
											if(e.keyCode==13){
												checkListRow()
											}
										}
					cell.appendChild(ptfield)
					ptfield.focus()
				}else if(j==3){
					var delimg = document.createElement('img')
					delimg.src = '/static/images/cross.png'
					delimg.className = '_delimg_'
					cell.appendChild(delimg)
					delimg.id = '_delpoint_'+row_index++
					delimg.onclick = delOneRow;
				}
	}
	//var tr = document.createElement('tr')
	//tr.innerHTML = '<hr />'
}

var done_req
function moveToDoneCheckList(){
	doneCheckListRow(this.todopoint,this.todopointid)
	tbody1.deleteRow(this.parentNode.parentNode.rowIndex)
	row_index--;
	done_req = new XMLHttpRequest();
	done_req.open('get','/todoapp/set_point/?todopoint_id='+this.todopointid,true)
	done_req.onreadystatechange = afterDoneSet;
	done_req.send()
}

var active_req
function moveToActiveCheckList(){
	checkListRow(this.todopoint,this.todopointid)
	active_req = new XMLHttpRequest();
	active_req.open('get','/todoapp/active_point/?todopoint_id='+this.todopointid,true)
	active_req.onreadystatechange = afterActiveSet;
	active_req.send()
	tbody2.removeChild(this.parentNode.parentNode)
	//tbody2.deleteRow(this.parentNode.parentNode.rowIndex)
	row_index_--
}

function afterDoneSet(){
	if (done_req.readyState=='4' && done_req.status=='200'){
		if (done_req.responseText=='done'){
			alert('Done	')
		}
	}
}

function afterActiveSet(){
	if (active_req.readyState=='4' && active_req.status=='200'){
		if (active_req.responseText=='done'){
			alert('Done	')
		}
	}
}

var row_index_ = 1;

function doneCheckListRow(todopoint,todopointid){
	//var row = checklist_table.insertRow(row_index)
	var row = tbody2.insertRow(row_index_)
	row.id = '_row_id_'+row_index_
	/*var img = document.getElementsByTagName('img')[0]
	img.draggable = true
	row.ondragstart = function(e){
		var dragrow = row
		var inp = this.getElementsByTagName('input')[1]
		e.dataTransfer.setData('inpid',inp.id)
		e.dataTransfer.setData('drgrowindex',dragrow.rowIndex)
	};
	row.ondragover = function(e){
		e.preventDefault()
	};	
	
	row.ondrop = function(e){
		e.preventDefault()
		var droprowindex = this.rowIndex
		var draginp = e.dataTransfer.getData('inpid')
		var draginpfld = document.getElementById(draginp)
		var temp = draginpfld.value

		var dragrowindex = e.dataTransfer.getData('drgrowindex')
		if(dragrowindex<droprowindex){
			for(i=parseInt(dragrowindex);i<parseInt(droprowindex);i++){
				var a = tbody1.rows[i].getElementsByTagName('input')[1]
				var b = tbody1.rows[i+1].getElementsByTagName('input')[1]
				a.value=b.value
			}
			if (i==droprowindex){
				b.value = temp
			} 
		}else{
			for(i=parseInt(dragrowindex);i>parseInt(droprowindex);i--){
				var a = tbody1.rows[i].getElementsByTagName('input')[1]
				var b = tbody1.rows[i-1].getElementsByTagName('input')[1]
				a.value=b.value
			}
			if (i==droprowindex){
				b.value = temp
			}
		}
		saveCheckNote();
	};*/
	for (j=0;j<4;j++ ){
				var cell = row.insertCell(j)
				cell.className = cellClass[j]
				if(j==0){
					var dragimg = document.createElement('img')
					dragimg.src = '/static/images/3dots.png'
					dragimg.className = '_dragimg_'
					cell.appendChild(dragimg)
					dragimg.id = '_drag_'+row_index	
				}else if (j==1){
					var chk = document.createElement('input')
					chk.type = 'checkbox'
					chk.className = '_chk_'
					chk.checked = 'checked' 
					if (todopoint)
					{
						chk.todopoint = todopoint
						chk.todopointid = todopointid
					}
					chk.onclick = moveToActiveCheckList
					cell.appendChild(chk)
				}else if(j==2){
					var ptfield = document.createElement('input')
					ptfield.active = false
					ptfield.className = '_ptfield_'
					ptfield.id = '_ptfield_x_'+row_index_
					
					if(todopoint){
						ptfield.value = todopoint
					}
					ptfield.disabled = true
					/*ptfield.onkeyup = function(e){
											if(e.keyCode==13){
												checkListRow()
											}
										}
					*/
					cell.appendChild(ptfield)
					//ptfield.focus()
				}else if(j==3){
					var delimg = document.createElement('img')
					delimg.src = '/static/images/cross.png'
					delimg.className = '_delimg_'
					cell.appendChild(delimg)
					delimg.id = '_delpoint_x_'+row_index_++
					delimg.onclick = delOneRow;
				}
	}
	//var tr = document.createElement('tr')
	//tr.innerHTML = '<hr />'
}

function delOneRow(){
	var recnum = this.id.substr(10,)
	var row = document.getElementById('_row_id_'+recnum)
	var rowIndex = row.rowIndex
	tbody1.deleteRow(rowIndex);
	row_index--;
	saveCheckNote();
}

var chksave;
function saveCheckNote(){
	var allInputs = checklist_table.getElementsByTagName('input')
	var i=1
	var str=''
	while(true){
		if (allInputs[i]){
			var active = allInputs[i].active
			str = str+"&point="+allInputs[i].value+'&active='+active
			i = i+2
		}else{
			break	
		}
		
	}
	chksave = new XMLHttpRequest()
	chksave.open('get','/todoapp/savechecklist/?todoid='+save1.todo_id+str,false)
	chksave.onreadystatechange = afterCheckListSave;
	chksave.send()
}

function afterCheckListSave(){
	if(chksave.readyState==4 && chksave.status==200){
		if(chksave.responseText=='done'){
			success_msg_2.style.display = 'block';
			setTimeout(function(){success_msg_2.style.display = 'none';},2000)
		}
	}
}