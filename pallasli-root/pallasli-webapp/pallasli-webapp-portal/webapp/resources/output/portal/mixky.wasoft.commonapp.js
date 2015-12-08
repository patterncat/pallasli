
//=================================================================
//	�ļ�����atwasoft.app.bpm.js
//=================================================================
Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.BpmAction = function(app, formKey,businessId,actionType, panelId,config) {
	
	config=config || {};
			    	
	var defaultConfig = {
		minWidth : 50
	};	
	
	var processBar;
	var beforeFn,submitFn,afterFn;	
		
	switch (actionType) {
	case 'BU1001':
		defaultConfig.text = '办理完成';
		defaultConfig.iconCls = 'icon-common-flow-processover';	
		
		defaultConfig.beforefn=function(callback){
			
			var panel=this;
			
			if (Ext.isDefined(panel.checkField)) {
				// 自定义表单校验函数校验失败
				if (panel.checkField(panel.form) === false) {
					callback(false);
					return;
				}
			}			
			
			if (Ext.isDefined(panel.formValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.formValidator() === false) {
					callback(false);
					return;
				}
			}	
			
			if (Ext.isDefined(panel.bpmformValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.bpmformValidator(panel.form) === false) {
					callback(false);
					return;
				}
			}			
					
			Ext.MessageBox.confirm('操作提示', '您确定要执行“办理完成”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar=panel.pb=Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	    callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
			var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						if(Ext.isDefined(a.result.documentid)){						
							   panel.documentid = a.result.documentid;  
						}else if(Ext.isDefined(a.result.id)){
							   panel.documentid=a.result.id;	 						  
						}else{
							// console.log('---------not id-'+panel.documentid);
						}
						
						var id=panel.form.getForm().findField('id');
						if(id){
							id.setValue(panel.documentid);
						}				
																
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
						Ext.applyIf(formvalues,allFormData);		
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				Ext.applyIf(formvalues,allFormData);												
				callback(formvalues);		
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);	
			
				Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
				         icon:Ext.Msg.INFO,width:250,closable:false});
				win.close();
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}			
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);	
			
			beforeFn=panel.beforefn || defaultConfig.beforefn;		
		    	
	    	        beforeFn.call(panel,function(isNext){
	    		
        	    		if(!isNext) return;    		
        	    		
        	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
        	        	
        	        	submitFn=panel.submitfn || defaultConfig.submitfn;
        	        	
        	        	var win = panel.findParentByType('window');
        	        	
        	        	afterFn= panel.afterfn || defaultConfig.afterfn;
        	        	
        	        	try{
        	        		submitFn.call(panel,function(data){
        	            		if(!data){
        	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
        	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
        	            			return;
        	            		}
        	            		
        	            		businessId=data.documentid || businessId || 0;
        	            		actionType=data.WF_Action || actionType;
        	            		
        	            		var nextUserList=data.WF_NextUserList || "";
        	            		var nextNodeId=data.WF_NextNodeId || "";
        	            		
        	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
        	            			data.WF_AutoRunFlag="1";
        	            		}   
        	            		
        	            		//console.log("sumbmit process data:",data);
        	            		
        	            		fn(data, formKey, businessId, actionType, function(result, e){
        	            				//console.log(result,e);
        	            				afterFn.call(panel,result,win);
        	            		});
        	            		
        	            	
        	            	}); 	
        	        	}catch(e){
        	        		//console.log(e.message);
        	        		Ext.MessageBox.hide();
        	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
        	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
        	        	}        	
        	    	
        	    	});	    	
	    	
		};	
		break;
	case 'BU1002':
		defaultConfig.text = '转他人处理';
		defaultConfig.iconCls = 'icon-common-flow-forward';
		
		defaultConfig.beforefn=function(callback){
			
			var panel=this;
			
			if (Ext.isDefined(panel.formValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.formValidator() === false) {
					callback(false);
					return;
				}
			}	
			
			if (Ext.isDefined(panel.bpmformValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.bpmformValidator(panel.form) === false) {
					callback(false);
					return;
				}
			}			
					
			Ext.MessageBox.confirm('操作提示', '您确定要执行“转他人处理”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	    callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag2 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						if(Ext.isDefined(a.result.documentid)){						
							   panel.documentid = a.result.documentid;  
						}else if(Ext.isDefined(a.result.id)){
							   panel.documentid=a.result.id;	 						  
						}else{
							// console.log('---------not id-'+panel.documentid);
						}
						
						var id=panel.form.getForm().findField('id');
						if(id){
							id.setValue(panel.documentid);
						}				
																
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
						Ext.applyIf(formvalues,allFormData);
						formvalues.WF_NextNodeId=formvalues.WF_CurrentNodeid;
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				Ext.applyIf(formvalues,allFormData);
				formvalues.WF_NextNodeId=formvalues.WF_CurrentNodeid;
				
				callback(formvalues);		
			}
			
		};
						
						
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);					
			
			beforeFn=panel.beforefn2 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn2 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn2 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1003':
		defaultConfig.text = '返回给回退者';
		defaultConfig.iconCls = 'icon-common-flow-assistover';
		defaultConfig.beforefn=function(callback){
								
			Ext.MessageBox.confirm('操作提示', '您确定要执行“返回给回退者”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag3 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						if(Ext.isDefined(a.result.documentid)){						
							   panel.documentid = a.result.documentid;  
						}else if(Ext.isDefined(a.result.id)){
							   panel.documentid=a.result.id;	 						  
						}else{
							 //console.log('---------not id-'+panel.documentid);
						}
						
						var id=panel.form.getForm().findField('id');
						if(id){
							id.setValue(panel.documentid);
						}				
						
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_NextNodeId=formvalues.WF_CurrentNodeid;
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_NextNodeId=formvalues.WF_CurrentNodeid;
				
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);	
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);			
			
			beforeFn=panel.beforefn3 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn3 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn3 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		
		break;
	case 'BU1004':
		defaultConfig.text = '回退上一环节';
		defaultConfig.iconCls = 'icon-common-flow-assistover';
		defaultConfig.beforefn=function(callback){
								
			Ext.MessageBox.confirm('操作提示', '您确定要执行“回退上一环节”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag4 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
					panel.form.getForm().submit({
					success : function(f,a){
												
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action='gotoprvuser';
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};		
									
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action='gotoprvuser';
											
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){			
				
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);					
			
			beforeFn=panel.beforefn4 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn4 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn4 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1005':
		defaultConfig.text = '回退首环节';
		defaultConfig.iconCls = 'icon-common-flow-turnback';
		defaultConfig.beforefn=function(callback){
								
			Ext.MessageBox.confirm('操作提示', '您确定要执行“回退首环节”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag5 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action="gotofirstnode";
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action="gotofirstnode";
				
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);				
			
			beforeFn=panel.beforefn5 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn5 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn5 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1006':
		defaultConfig.text = '结束流程';
		defaultConfig.iconCls = 'icon-common-flow-takeback';
		defaultConfig.beforefn=function(callback){
											
			Ext.MessageBox.confirm('操作提示', '您确定要执行“结束流程”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
			
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag6 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
																		
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action="gotoendprocess";						
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action="gotoendprocess";			
											
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);				
			
			beforeFn=panel.beforefn6 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn6 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn6 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}    
	            		
	            		data.WF_FORCE_END="1";
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1060':
		defaultConfig.text = '返回给转交者';
		defaultConfig.iconCls = 'icon-common-flow-request';
		defaultConfig.beforefn=function(callback){
							
			Ext.MessageBox.confirm('操作提示', '您确定要执行“返回给转交者"吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag7 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
								
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action='GoToBackReassignment';
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action='GoToBackReassignment';
											
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);					
			
			beforeFn=panel.beforefn7 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn7 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn7 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1061':
		defaultConfig.text = '提交给下一会签用户';
		defaultConfig.iconCls = 'icon-common-flow-stop';
		defaultConfig.beforefn=function(callback){
			
			var panel=this;
			
			if (Ext.isDefined(panel.formValidator)) {
				
				if (panel.formValidator() === false) {
					callback(false);
					return;
				}
			}	
			
			if (Ext.isDefined(panel.bpmformValidator)) {
				
				if (panel.bpmformValidator(panel.form) === false) {
					callback(false);
					return;
				}
			}			
					
			Ext.MessageBox.confirm('操作提示', '您确定要执行“提交给下一会签用户”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){			
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag8 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						if(Ext.isDefined(a.result.documentid)){						
							   panel.documentid = a.result.documentid;  
						}else if(Ext.isDefined(a.result.id)){
							   panel.documentid=a.result.id;	 						  
						}else{
							 //console.log('---------not id-'+panel.documentid);
						}
						
						var id=form.getForm().findField('id');
						if(id){
							id.setValue(panel.documentid);
						}				
						
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action='GoToNextParallelUser';
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action='GoToNextParallelUser';
											
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);	
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);					
			
			beforeFn=panel.beforefn8 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn8 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn8 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	case 'BU1062':
		defaultConfig.text = '提交下一串行用户';
		defaultConfig.iconCls = 'icon-common-flow-archive';
		defaultConfig.beforefn=function(callback){
			
			var panel=this;
			
			if (Ext.isDefined(panel.formValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.formValidator() === false) {
					callback(false);
					return;
				}
			}	
			
			if (Ext.isDefined(panel.bpmformValidator)) {
				// 自定义表单校验函数校验失败
				if (panel.bpmformValidator(panel.form) === false) {
					callback(false);
					return;
				}
			}			
					
			Ext.MessageBox.confirm('操作提示', '您确定要执行“提交下一串行用户”吗？', function(btn){
			    if(btn == 'yes'){
			    	processBar= Ext.MessageBox.show({title:'提示',wait:true,msg:"正在办理,请稍候...",
			        modal:true,icon:Ext.Msg.WARNING,width:250,closable:false});	
				    callback(true);
			    }else{
			    	callback(false);
			    }
		    }); 
		};
		
		defaultConfig.submitfn=function(callback){
		        var panel=this;
			var allFormData=panel.form.getForm().getFieldValues();
			var isFirstExecuteBusiness=panel.WF_ExecBusinessFlag2 || false;
			if("1"==allFormData.WF_NewDocFlag){
			    isFirstExecuteBusiness=true;
			}
			//console.log("isFirstExecuteBusiness:"+isFirstExecuteBusiness);
			if(isFirstExecuteBusiness){
				panel.form.getForm().submit({
					success : function(f,a){
						
						if(Ext.isDefined(a.result.documentid)){						
							   panel.documentid = a.result.documentid;  
						}else if(Ext.isDefined(a.result.id)){
							   panel.documentid=a.result.id;	 						  
						}else{
							 //console.log('---------not id-'+panel.documentid);
						}
						
						var id=panel.form.getForm().findField('id');
						if(id){
							id.setValue(panel.documentid);
						}				
						
						var formvalues={documentid:panel.documentid,id:panel.documentid};				
											
						var submitData=panel.getSubmitData();
						if(submitData){
							Ext.applyIf(formvalues,submitData);		
						}
						
						formvalues.WF_Action='GoToNextSerialUser';
													
						callback(formvalues);
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
						if(processBar){
						   processBar.hide();
					    }
					}
				});
			}else{				
				
				var formvalues={documentid:panel.documentid,id:panel.documentid};				
				
				var submitData=panel.getSubmitData();
				if(submitData){
					Ext.applyIf(formvalues,submitData);		
				}
				
				formvalues.WF_Action='GoToNextSerialUser';
											
				callback(formvalues);										
				
			}
			
			
			
		};
		
		defaultConfig.afterfn=function(result,win){
			
			//console.log(this);
			
			if(processBar)processBar.hide();
			
			if(result && result.success){				
			
				//MixkyApp.showInfoMessage(result.msg);	
			    Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
			         icon:Ext.Msg.INFO,width:250,closable:false});
			    
				win.close();
				
				var module = MixkyApp.desktop.getCurrentModule();
				var openerId;
				if(module){
					var view = module.getCurrentView();
					if(view){
						openerId = view.getId();
					}
				}
				if(Ext.isDefined(openerId)){
					var opener = Ext.getCmp(openerId);
					if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
						opener.refresh();
					}
				}
				/*刷新桌面待办*/
				var sj = MixkyApp.getSubject(null,'sys-todo');
			    if(Ext.isDefined(sj)){
				    var p = Ext.getCmp('portlet-sys-todo');
				    p.refresh();
			    }
			}else{			
				Ext.MessageBox.show({title:'提示',msg:result.msg,
				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});    				
			}
		};
				
		
		defaultConfig.handler = function() {
			
			var panel=Ext.getCmp(panelId);
			if(!panel){
				Ext.MessageBox.show({title:'提示',msg:'panelId配置错误',
	  				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
				return;
			}
			
			if(config.isDocument){
				//console.log("进入文档判断，获取第一个标签");
				panel=panel.items.items[0];
			}
			
			//console.log(panel);				
			
			beforeFn=panel.beforefn9 || defaultConfig.beforefn;		
		    	
	    	beforeFn.call(panel,function(isNext){
	    		
	    		if(!isNext) return;    		
	    		
	    		var fn = eval(app.keyPrefix + 'AppDirect.runBpmProcess');
	        	
	        	submitFn=panel.submitfn9 || defaultConfig.submitfn;
	        	
	        	var win = panel.findParentByType('window');
	        	
	        	afterFn= panel.afterfn9 || defaultConfig.afterfn;
	        	
	        	try{
	        		 submitFn.call(panel,function(data){
	            		if(!data){
	            			Ext.MessageBox.show({title:'提示',msg:'未获取流程数据',
	           				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	            			return;
	            		}
	            		
	            		businessId=data.documentid || businessId || 0;
	            		actionType=data.WF_Action || actionType;
	            		
	            		var nextUserList=data.WF_NextUserList || "";
	            		var nextNodeId=data.WF_NextNodeId || "";
	            		
	            		if(actionType=='GoToNextNode' && !nextUserList && !nextNodeId){
	            			data.WF_AutoRunFlag="1";
	            		}   
	            		
	            		//console.log(data);
	            		
	            		fn(data, formKey, businessId, actionType, function(result, e){
	            				//console.log(result,e);
	            				afterFn.call(panel,result,win);
	            		});
	            		
	            	
	            	}); 	
	        	}catch(e){
	        		//console.log(e.message);
	        		Ext.MessageBox.hide();
	        		Ext.MessageBox.show({title:'提示',msg:'执行出错',
	      				 modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.ERROR,width:300,closable:false});
	        	}        	
	    	
	    	});	    	
	    	
		};	
		break;
	/*
	case 'BU1022':
		defaultConfig.text = '暂存文档';
		defaultConfig.iconCls = 'icon-common-flow-archive';
		break;
	case 'BU1023':
		defaultConfig.text = '保存为草稿';
		defaultConfig.iconCls = 'icon-common-flow-archive';
		break;
	case 'BU1024':
		defaultConfig.text = '拷贝回草稿箱';
		defaultConfig.iconCls = 'icon-common-flow-archive';
		break;
	case 'BU1190':
		defaultConfig.text = '打印处理单';
		defaultConfig.iconCls = 'icon-common-flow-archive';
		break;
	*/
	default:break;
	}	
	
	return new Ext.Action(Ext.apply(defaultConfig, config));
};
//=================================================================
//	�ļ�����atwasoft.app.im.js
//=================================================================
Ext.namespace("Mixky.wasoft.lib");var isCRM=!0,isDirect=typeof OrganizAppDirect!="undefined";DirectFunc={};DirectFunc.getUsers=isDirect?OrganizAppDirect.getUsers:Ext.emptyFn;DirectFunc.getZzjgTree=isDirect?OrganizAppDirect.getZzjgTree:Ext.emtyFn;DirectFunc.chkUser=isDirect?OrganizAppDirect.chkUser:Ext.emtyFn;
MsgTip=function(){var a;return{msg:function(b,c,a,e){this.display(!1,b,c,a,e)},msg_corner:function(b,c,a,e){this.display(!0,b,c,a,e)},display:function(b,c,d,e,f){a||(a=Ext.DomHelper.insertFirst(document.body,{id:"msg-div22",style:"position:absolute;top:10px;width:300px;margin:0 auto;z-index:20000;"},!0));c=Ext.DomHelper.append(a,{html:['<div class="msg"><div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div><div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc" style="font-size=12px;"><h3>',
c,"</h3>",d,'</div></div></div><div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div></div>'].join("")},!0);b?(a.alignTo(document,"br-br"),c.slideIn("b")):(a.alignTo(document,"t-t"),c.slideIn("t"));!Ext.isEmpty(e)&&e==!0&&(Ext.isEmpty(f)&&(f=3),c.pause(f).ghost("tr",{remove:!0}))},hide:function(b){Ext.get(b.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement).ghost("tr",{remove:!0})}}}();
var ChatHelper={VER:"\u5728\u7ebf\u4ea4\u6d41V20121221",delay:3E3,notifyDelay:8E3,maxLength:512,maxImage:512,maxPic:30,msgNum:150,maxLateUsers:30,isFocus:!0,ctrlEnter:!0,picsUrl:[],audiosUrl:[],lateUsers:[],LS_ITEM_LATEUSERS:"LateUsers",autoOpens:[],LS_ITEM_AUTOOPENS:"autoOpens",registEvent:function(){window.onfocus=function(){ChatHelper.isFocus=!0};window.onblur=function(){ChatHelper.isFocus=!1};window.onbeforeunload=function(){Chat.close();Console.log("exit");return"exit?"};Ext.fly(Ext.getDoc()).on("dragover",
function(a){a.stopPropagation();a.preventDefault()}).on("drop",function(a){a.stopPropagation();a.preventDefault()})}(),initCtrl:function(){var a=localStorage.getItem("ctrlEnter");a==null?(this.ctrlEnter=!0,localStorage.setItem("ctrlEnter","true")):this.ctrlEnter=a=="true"?!0:!1},initLateUsers:function(){var a=localStorage.getItem(this.LS_ITEM_LATEUSERS);if(a)this.lateUsers=Ext.decode(a)},initResourceUrl:function(){var a="resources/images/common";this.picsUrl.notify=a+"/quote.gif";this.picsUrl.clear=
"resources/icon/app/common/gjdyhwd.gif";this.picsUrl.recorder=a+"/clock.gif";this.picsUrl.tip=a+"/favoriteon.png";a="resources/audio";this.audiosUrl.msg=a+"/msg.ogg";this.audiosUrl.group=a+"/group.ogg"},init:function(){this.initCtrl();this.initLateUsers();this.initResourceUrl()},setCtrlEnter:function(){this.ctrlEnter=Ext.getCmp("btn_ctrl_enter").checked;this.log("ctrlEnter --\> "+this.ctrlEnter);localStorage.setItem("ctrlEnter",this.ctrlEnter)},fireClickEvent:function(a,b,c){c=Ext.getCmp(c);this.ctrlEnter?
a.ctrlKey&&a.keyCode==Ext.EventObject.ENTER&&c.fireEvent("click"):a.keyCode==Ext.EventObject.ENTER&&(a.ctrlKey?b.setValue(b.getValue()+"\r\n"):(c.fireEvent("click"),a.preventDefault()))},log:function(a){window.console&&console.log&&console.log(a)},getStrLength:function(a){var b=a.match(/[^\x00-\xff]/ig);return a.length+(b==null?0:b.length)},isOverMax:function(a){return this.getStrLength(a)>this.maxLength},dropImage:function(a,b,c){a.stopPropagation();a.preventDefault();for(var d=a.browserEvent.dataTransfer.files,
e=0;a=d[e];e++)if((a.type?a.type:"n/a").indexOf("image")>=0){d=new FileReader;d.onload=function(a){return function(d){a.size<=ChatHelper.maxImage*1024?Chat.sendMessage(d.target.result,b,c,"img"):alert("\u4e0a\u4f20\u6587\u4ef6\u8bf7\u63a7\u5236\u5728"+ChatHelper.maxImage+"k\u5185")}}(a);d.readAsDataURL(a);break}else alert("\u53ea\u80fd\u53d1\u9001\u56fe\u7247")},insertHtml:function(a,b){var c=Ext.getCmp(a).body,d="<p class="+(b.from==Chat.userid||b.title.indexOf(Chat.getNickname())==0?"im-title-self":
"im-title-common")+">"+b.title+"</p><p class='im-content'>"+unescape(b.content)+"</p>";c.insertHtml("beforeEnd",d)},addMsgToPanel:function(a,b){this.insertHtml(a,b);b.from!=0&&webSql.insertMsg(b.from,b.to,b.title,b.content);for(var c=Ext.getCmp(a).body.dom;c.childNodes.length>this.msgNum;)c.removeChild(c.firstChild);c.scrollTop=c.scrollHeight-c.offsetHeight},clearPanel:function(a){for(a=Ext.getCmp(a).body.dom;a.lastChild;)a.removeChild(a.lastChild)},removeHTMLTag:function(a){a=a.replace(/<br>/g,"\n");
a=a.replace(/<\/?[^>]*>/g,"");a=a.replace(/[ | ]*\n/g,"\n");a=a.replace(/\n[\s| | ]*\r/g,"\n");a=a.replace(/&nbsp;/ig," ");this.log(a);return a},sendNotify:function(a){Console.log("send to me msg: "+Ext.encode(a)+", isFocus: "+this.isFocus);if(!this.isFocus&&this.isNotify()){var b=this.removeHTMLTag(a.title),c=b.split(" "),a={url:ChatHelper.picsUrl.notify,title:b.length>=3?c[0]+" "+c[2]:b,body:this.removeHTMLTag(unescape(a.content))};(new DesktopNotification(1,a,this.notifyDelay)).init()}else Console.log("ignore notification")},
isNotify:function(){var a=new DesktopNotification;return a.checkSupport()&&a.checkPermission()==0},getPicurl:function(a){a=isCRM?"download/photo/"+a.id+".JPG":a.pic?"/OA/upload/"+a.id+"/thumbnails/"+a.pic:"/OA/upload/nobody/"+Math.floor(Math.random()*this.maxPic+1)+".gif";Console.log("picurl: "+a);return a},zd:function(a){var b=["top","left"],c=0;u=setInterval(function(){document.getElementById(a).style[b[c%2]]=c++%4<2?0:4;c>15&&(clearInterval(u),c=0)},32)},getGroupIconClass:function(a){return a?
"icon-sys-m_org_flash":"icon-sys-m_org"},clearGroupIconClass:function(a){Ext.Element.fly(a).removeClass("icon-sys-m_org_flash");Ext.Element.fly(a).removeClass("icon-sys-m_org")},getIconClass:function(a){return a.online?this.getOnlineIconClass(a):this.getOfflineIconClass()},getOfflineIconClass:function(){return"icon-sys-m_user_off"},getOnlineIconClass:function(a){return a.sex==0?a.status==0?"icon-sys-m_user":"icon-sys-m_user_busy":a.status==0?"icon-sys-m_leader":"icon-sys-m_leader_busy"},clearIconClass:function(a){Ext.Element.fly(a).removeClass("icon-sys-m_user_off");
Ext.Element.fly(a).removeClass("icon-sys-m_user");Ext.Element.fly(a).removeClass("icon-sys-m_user_busy");Ext.Element.fly(a).removeClass("icon-sys-m_leader");Ext.Element.fly(a).removeClass("icon-sys-m_leader_busy")}};ChatHelper.init();var Console={};Console.log=ChatHelper.log;Console.log("ctrlEnter from localStorage: "+ChatHelper.ctrlEnter);
var geo={getLocation:function(){navigator.geolocation?navigator.geolocation.getCurrentPosition(this.coodrs,this.handleError,{enableHighAccuracy:!0,maximumAge:1E3}):alert("\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u4f7f\u7528HTML 5\u6765\u83b7\u53d6\u5730\u7406\u4f4d\u7f6e\u670d\u52a1")},handleError:function(a){switch(a.code){case 1:alert("\u4f4d\u7f6e\u670d\u52a1\u88ab\u62d2\u7edd");break;case 2:alert("\u6682\u65f6\u83b7\u53d6\u4e0d\u5230\u4f4d\u7f6e\u4fe1\u606f");break;case 3:alert("\u83b7\u53d6\u4fe1\u606f\u8d85\u65f6");
break;case 4:alert("\u672a\u77e5\u9519\u8bef")}},coodrs:function(a){alert("longitude="+a.coords.longitude+",latitude="+a.coords.latitude)},showMap:function(a){var a=new BMap.Point(a.coords.longitude,a.coords.latitude),b=new BMap.Marker(a),c=new BMap.Map("map");c.centerAndZoom(a,15);c.addOverlay(b)},openMap:function(){window.open("map.html","_blank")}};
Chatroom_sql=function(a,b){var c=b||{},c={version:c.version||"1.0",desc:c.desc||"db_"+a,size:c.size||10240},d=function(b,c){var a=0;return b.replace(/(\?)/g,function(){return c[a++]})},e;window.openDatabase!==void 0?(Console.log("Info: connect websql success!"),e=openDatabase(a,c.version,c.desc,c.size)):(Console.log("Error: connect websql failed!"),e=null);this.db=e;this.execSql=function(b,c,a,g){if(e){c||(c=[]);a===void 0&&(a=function(){Console.log("Info: success --\> "+d(b,c))});var j=toString.call(g)===
"[object Function]"?function(a,e){g.call(this,a,e,d(b,c))}:function(a,e){Console.log("Error:failed --\> msg:"+e.message+" sql:"+d(b,c))};e.transaction(function(d){try{d.executeSql(b,c,a,j)}catch(e){Console.log("Error: database execute --\>"+e.message)}})}else Console.log("Error: init database and table first!")}};
var webSql={maxRecorderNum:5E3,support:!1,chatTable:"t_chat_130220",chatSql:"",init:function(){this.chatSql=new Chatroom_sql("ChatRoom",{version:"1.0",desc:"chat",size:5242880});this.chatSql.execSql("CREATE TABLE IF NOT EXISTS "+webSql.chatTable+"(id integer primary key autoincrement,f_timestamp TIMESTAMP default (datetime('now', 'localtime')),f_from integer, f_to integer, f_title, f_msg TEXT)");this.support=!0;this.qureyMsgCount()},insertMsg:function(a,b,c,d){this.support&&this.chatSql.execSql("INSERT INTO "+
webSql.chatTable+"(f_from, f_to, f_title, f_msg) values(?, ?, ?, ?)",[a,b,c,d])},qureyMsgCount:function(){this.support&&this.chatSql.execSql("SELECT count(*) cnt FROM "+webSql.chatTable,[],function(a,b){var c=b.rows.item(0).cnt;Console.log("count = "+c);c>webSql.maxRecorderNum?(webSql.chatSql.execSql("delete from "+webSql.chatTable+" where f_timestamp <= datetime('now','-30 day')",[]),Console.log("delete data before 30 days")):Console.log("space is enough not delete data")})},queryMsg:function(a,
b,c){if(this.support){var d="SELECT * FROM "+webSql.chatTable+" where ";d+=b?"f_to="+c:"f_from="+c+" and f_to="+Chat.userid;d+=" order by id";this.chatSql.execSql(d,[],function(b,c){for(var d=0;d<c.rows.length;d++){var i={from:c.rows.item(d).f_from,to:c.rows.item(d).f_to,title:c.rows.item(d).f_title,content:c.rows.item(d).f_msg};ChatHelper.insertHtml(a,i)}d=Ext.getCmp(a).body.dom;d.scrollTop=d.scrollHeight-d.offsetHeight})}else alert("\u672c\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u79bb\u7ebf\u5b58\u50a8\uff01")}};
webSql.init();function DesktopNotification(a,b,c){this.isSupport=void 0;this.permissionStatue=1;this.notificationStyle=a||1;this.options=b||{url:"",title:"",body:""};this.displayTime=c||2E3;this.content=void 0}
DesktopNotification.prototype={constructor:DesktopNotification,checkSupport:function(){return this.isSupport=!!window.webkitNotifications},checkPermission:function(){return this.checkSupport?window.webkitNotifications.checkPermission():-1},requestPermission:function(){Console.log("requestPermission");window.webkitNotifications.requestPermission();this.permissionStatue=window.webkitNotifications.checkPermission()},checkPermissionStatue:function(){this.permissionStatue==0?this.notificationContent():
this.permissionStatue==2?(new Ext.Window({layout:"fit",width:350,height:150,plain:!0,html:"\u4f60\u66fe\u7ecf\u62d2\u7edd\u4e86\u5bf9\u672c\u7f51\u7ad9\u7684\u6d88\u606f\u63d0\u9192\uff0c\u9009\u62e9\u4ee5\u4e0b\u4fe1\u606f\u62d6\u5230\u6d4f\u89c8\u5668\u5730\u5740\u680f\uff1a<br><br><b>chrome://settings/contentExceptions#notifications</b><br><br>\u5220\u6389\u5bf9\u672c\u7f51\u7ad9\u4e2d\u901a\u77e5\u4f8b\u5916\u60c5\u51b5\u7684\u884c\u4e3a\u7981\u6b62\uff0c\u518d\u91cd\u65b0\u767b\u5f55\u7cfb\u7edf\u3002"})).show():
Console.log("permissionStatue: "+this.permissionStatue)},notificationContent:function(){var a=this;switch(this.notificationStyle){case 1:this.content=window.webkitNotifications.createNotification(this.options.url,this.options.title,this.options.body);break;case 2:this.content=window.webkitNotifications.createHTMLNotification(this.options.url);break;default:alert("Sorry, you have not defined the notificationStyle.")}this.content.replaceId=this.replaceId;this.content.onshow=function(){setTimeout(function(){a.content.cancel()},
a.displayTime)};this.content.onclick=function(){window.focus()};this.content.show()},init:function(){this.checkSupport();this.isSupport?(this.requestPermission(),this.checkPermissionStatue()):Console.log("your browser is not support notification!")}};var chatWindow;
Mixky.wasoft.lib.chatroom=function(){if(!chatWindow)if(Mixky.wasoft.lib.chatroom.init())Console.log("Info: init success");else{Console.log("Error: init failed");return}Chat.isWinShowed?chatWindow.show():(chatWindow.show(),Chat.sendRefreshOnlineListCmd(),Chat.sendRefreshOnlineListCmd())};
Mixky.wasoft.lib.chatroom.init=function(){if(!Chat.isSupportWs())return Console.log("Error: not support WebSocket"),!1;this.msgPanel=new Ext.Panel({id:"msgPanel",autoScroll:!0,region:"center"});this.sendPanel=new Ext.Panel({region:"south",layout:"fit",title:"\u4fe1\u606f\u8f93\u5165",height:160,items:[{id:"inputAllBox",xtype:"textarea",region:"center",allowBlank:!1,blankText:"\u8f93\u5165\u5185\u5bb9\u4e0d\u53ef\u4e3a\u7a7a",enableKeyEvents:!0,listeners:{keydown:function(b,c){ChatHelper.fireClickEvent(c,
b,"sendAllBtn")}}}],buttons:[{text:"\u5173 \u95ed",handler:function(){chatWindow.hide()}},{id:"sendAllBtn",xtype:"splitbutton",text:"\u53d1 \u9001",menu:new Ext.menu.Menu({items:[{id:"btn_enter",text:"\u6309Enter\u952e\u53d1\u9001\u6d88\u606f",group:"ctrl",checked:!ChatHelper.ctrlEnter},{id:"btn_ctrl_enter",text:"\u6309Ctrl+Enter\u952e\u53d1\u9001\u6d88\u606f",group:"ctrl",checked:ChatHelper.ctrlEnter,checkHandler:function(){ChatHelper.setCtrlEnter()}}]}),listeners:{click:function(){var b=Ext.getCmp("inputAllBox"),
c=b.getValue();ChatHelper.isOverMax(c)?Ext.MessageBox.alert("\u63d0 \u793a","\u53d1\u9001\u4fe1\u606f\u8fc7\u957f\uff0c\u8bf7\u5220\u9664\u90e8\u5206\u8981\u53d1\u9001\u7684\u4fe1\u606f\uff01"):Chat.sendMessage(c)&&(b.reset(),b.focus())}}}]});this.leftPanel=new Ext.Panel({region:"center",layout:"border",border:!1,items:[this.msgPanel,this.sendPanel]});var a=new Ext.data.DirectStore({autoLoad:!1,paramsAsHash:!0,directFn:DirectFunc.getUsers,reader:new Ext.data.JsonReader({totalProperty:"totals",root:"results",
fields:["display","value"]})});this.quickPanel=new Ext.Panel({id:"quickPanel",region:"north",layout:"fit",height:22,items:[{id:"quickSearchBox",xtype:"combo",region:"center",triggerAction:"all",width:120,mode:"remote",valueField:"value",displayField:"display",editable:!0,store:a,listWidth:160,pageSize:100,selectOnFocus:!0,minChars:1,applicationkey:"OA",triggerClass:"x-form-search-trigger",onTriggerClick:function(){Mixky.editor.showOrganizationWindow(function(b,c){var a=c.toString().replace("U_","");
Ext.getCmp("quickSearchBox").setValue(a);Ext.getCmp("quickSearchBox").setRawValue(b);chatWindow.openChatUser(a)},void 0,{selectMulti:!1,selectType:"user",valueSeparator:"\u3001"})},listeners:{select:function(){this.setRawValue(this.getRawValue().split(" ")[1]);chatWindow.openChatUser(this.getValue())},change:function(){var b=this.getRawValue();b.trim()!=""&&DirectFunc.chkUser(b,function(b){b&&b.success?(this.setValue(b.id),this.setRawValue(b.caption)):Ext.MessageBox.show({title:"\u63d0\u793a",msg:b.msg,
modal:!0,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING,width:250,closable:!1,fn:function(){this.setValue("");this.setRawValue("")}})})}}}]});this.onlineTreePanel=new Ext.tree.TreePanel({id:"im-tree",title:"\u5728\u7ebf\u7528\u6237",rootVisible:!1,lines:!1,autoScroll:!0,tools:[{id:"refresh",on:{click:function(){var b=Ext.getCmp("im-tree");b.body.mask("Loading","x-mask-loading");Chat.sendRefreshOnlineListCmd();b.body.unmask()}}}],root:new Ext.tree.AsyncTreeNode({text:"",children:[{id:"workgroup",text:"\u5de5\u4f5c\u7ec4",
expanded:!1,children:[]},{id:"online",text:"\u5728\u7ebf\u7528\u6237",expanded:!0,children:[]},{id:"offline",text:"\u79bb\u7ebf\u7528\u6237",hidden:!0,children:[]}]}),onlineUserMenu:new Ext.menu.Menu({items:[{id:"user-open",text:"\u53d1\u9001\u5373\u65f6\u6d88\u606f",handler:function(b){b=b.parentMenu.contextNode;b.id!=Chat.userid?winMgr.openWindow(b):winMgr.openUploadWin()}},{id:"view-history",text:"\u67e5\u770b\u5386\u53f2\u6d88\u606f",handler:function(b){b=b.parentMenu.contextNode;b.id!=Chat.userid&&
winMgr.openHistoryWindow(b)}},{id:"user-busy",text:"\u8bbe\u7f6e\u5fd9\u788c",handler:function(b){b=b.parentMenu.contextNode;if(b.id==Chat.userid)b.status=b.status==0?1:0,Console.log("send user status: "+b.status),Chat.sendUserStatusCmd(Ext.encode({userid:b.id,status:b.status})),Chat.status=b.status}}]}),workgroupMenu:new Ext.menu.Menu({items:[{id:"group-create",text:"\u521b\u5efa\u5de5\u4f5c\u7ec4",handler:function(){winMgr.openCreateGroupWin().init()}}]}),itemMenu:new Ext.menu.Menu({items:[{id:"group-open",
text:"\u6253\u5f00\u5de5\u4f5c\u7ec4"},{id:"group-open-history",text:"\u67e5\u770b\u5386\u53f2\u6d88\u606f"},{id:"group-update",text:"\u4fee\u6539\u5de5\u4f5c\u7ec4"},{id:"group-destroy",text:"\u89e3\u6563\u5de5\u4f5c\u7ec4"},{id:"group-exit",text:"\u9000\u51fa\u5de5\u4f5c\u7ec4"}],listeners:{itemclick:function(b){var c=b.parentMenu.contextNode;switch(b.id){case "group-open":c.parentNode.id=="workgroup"&&Chat.sendRefreshGroupUser(c.id);break;case "group-open-history":c.parentNode.id=="workgroup"&&
(b=winMgr.openGroupWindow(c.id),b.histroy());break;case "group-destroy":c.crtuser==Chat.userid?Ext.MessageBox.confirm("\u63d0\u793a","\u786e\u5b9a\u8981\u89e3\u6563["+c.text+"]\u5de5\u4f5c\u7ec4\u5417\uff1f",function(b){b=="yes"?(Chat.sendDestroyGroupCmd(c.id),c.parentNode&&c.remove()):Console.log("Info: cancel destroy workgroup")}):Ext.MessageBox.alert("\u8b66\u544a","\u53ea\u6709\u521b\u5efa\u8005\u624d\u80fd\u89e3\u6563\u5de5\u4f5c\u7ec4!");break;case "group-exit":c.crtuser==Chat.userid?alert("\u4f60\u662f\u8be5\u5de5\u4f5c\u7ec4\u7684\u521b\u5efa\u8005\u4e0d\u80fd\u9000\u51fa\uff01"):
Ext.MessageBox.confirm("\u63d0\u793a","\u9000\u51fa\u8be5\u5de5\u4f5c\u7ec4\uff0c\u5c06\u6536\u53d6\u4e0d\u5230\u6765\u81ea\u8be5\u5de5\u4f5c\u7ec4\u7684\u4fe1\u606f\uff0c\u4f60\u786e\u5b9a\u8981\u9000\u51fa\u5417\uff1f",function(b){b=="yes"?Chat.sendExitGroupCmd(Ext.encode({wgid:c.id,userid:Chat.userid})):Console.log("Info: cancel destroy workgroup")});break;case "group-update":var a={id:c.id,name:c.text,note:c.note};a.crtuser=c.crtuser==Chat.userid;b=winMgr.openCreateGroupWin();b.init(a);break;
case "group-auto":alert("\u6b63\u5728\u7814\u53d1\u4e2d...");break;default:Console.log("not surpport")}}}}),listeners:{dblclick:function(b){b.isLeaf()&&(b.parentNode.id=="online"?b.id==Chat.userid?winMgr.openUploadWin():winMgr.openWindow(b):b.parentNode.id=="workgroup"?Chat.sendRefreshGroupUser(b.id):Console.log("Debug: ignore this node!"))},contextmenu:function(b,a){b.select();var d;if(b.parentNode.id=="online")if(d=b.getOwnerTree().onlineUserMenu,b.id==Chat.userid){d.items.get(1).hide();d.items.get(2).show();
var e=d.items.get(2).getEl();if(e)e.dom.innerText=b.status==0?"\u8bbe\u7f6e\u5fd9\u788c":"\u53d6\u6d88\u5fd9\u788c"}else d.items.get(1).show(),d.items.get(2).hide();else if(b.id=="workgroup")d=b.getOwnerTree().workgroupMenu;else if(b.parentNode.id=="workgroup")d=b.getOwnerTree().itemMenu,b.crtuser==Chat.userid?Console.log("Debug: display all menu"):Console.log("Debug: display simple menu");else return;d.contextNode=b;d.showAt(a.getXY())}}});this.lateTreePanel=new Ext.tree.TreePanel({id:"late-tree",
title:"\u6700\u8fd1\u8054\u7cfb\u4eba",rootVisible:!1,lines:!1,autoScroll:!0,tools:[{id:"refresh",on:{click:function(){Ext.getCmp("late-tree").refreshList()}}}],root:new Ext.tree.AsyncTreeNode({text:"",children:[{id:"lateUser",text:"\u6700\u8fd1\u8054\u7cfb\u4eba",expanded:!0,children:[]}]}),refreshList:function(){chatWindow.refreshLateUserNum()},contextMenu:new Ext.menu.Menu({items:[{id:"lateUser-open",text:"\u53d1\u9001\u5373\u65f6\u6d88\u606f",handler:function(b){chatWindow.openChatUser(b.parentMenu.contextNode.id)}},
{text:"\u67e5\u770b\u5386\u53f2\u6d88\u606f",handler:function(b){winMgr.openHistoryWindow(b.parentMenu.contextNode)}}]}),contextMenu_a:new Ext.menu.Menu({items:[{id:"lateUser-clear",text:"\u6e05\u7a7a\u6700\u8fd1\u8054\u7cfb\u4eba",handler:function(){chatWindow.clearLateUsers()}}]}),listeners:{dblclick:function(b){b.isLeaf()&&(b.parentNode.id=="lateUser"?chatWindow.openChatUser(b.id):Console.log("Debug: ignore root node!"))},contextmenu:function(b,a){b.select();var d=b.isLeaf()?b.getOwnerTree().contextMenu:
b.getOwnerTree().contextMenu_a;d.contextNode=b;d.showAt(a.getXY())}}});this.orgTreePanel=new Ext.tree.TreePanel({id:"orgTree",title:"\u7ec4\u7ec7\u7ed3\u6784",autoScroll:!0,rootVisible:!1,enableDrag:!0,root:{text:"\u7ec4\u7ec7\u7ed3\u6784",iconCls:"icon-administrator-dept",type:isCRM?0:100,key:0},loader:new Ext.tree.TreeLoader({directFn:DirectFunc.getZzjgTree,paramOrder:["id","type"],baseParams:{id:0,type:0},preloadChildren:!0,listeners:{beforeload:function(b,a){Ext.apply(this.baseParams,{id:parseInt(a.attributes.key,
10)});Ext.apply(this.baseParams,{type:parseInt(a.attributes.type,10)})},load:function(){}}}),tools:[{id:"maximize",qtip:"\u5c55\u5f00\u8282\u70b9",handler:function(){Ext.getCmp("orgTree").expandAll()}},{id:"minimize",qtip:"\u6536\u5408\u8282\u70b9",handler:function(){Ext.getCmp("orgTree").collapseAll()}},{id:"refresh",qtip:"\u5237\u65b0\u9009\u4e2d\u83dc\u5355\u7684\u4e0b\u7ea7\u83dc\u5355",handler:function(){Ext.getCmp("orgTree").refresh()}}],refresh:function(b){b||(b=this.getSelectionModel().getSelectedNode());
b||(b=this.getRootNode());b.attributes.children=void 0;b.reload()},reload:function(){Ext.getCmp("orgTree").refresh()},onlineUserMenu:new Ext.menu.Menu({items:[{id:"org-user-open",text:"\u53d1\u9001\u5373\u65f6\u6d88\u606f",handler:function(b){var a=b.parentMenu.contextNode,b=a.attributes.key;if(isCRM){a=a.attributes.uid;Console.log("uid = "+a);if(a==""){Ext.MessageBox.alert("\u63d0 \u793a","\u672a\u7ed9\u6b64\u4eba\u521b\u5efa\u64cd\u4f5c\u7528\u6237");return}for(var a=a.split(","),d=0;d<a.length;d++)if(b=
a[d],chatWindow.isOnline(b))break}chatWindow.openChatUser(b)}},{text:"\u67e5\u770b\u5386\u53f2\u6d88\u606f",handler:function(b){var b=b.parentMenu.contextNode,a=b.attributes.key;if(isCRM){var d=b.attributes.uid;Console.log("uid = "+d);if(d==""){Ext.MessageBox.alert("\u63d0 \u793a","\u672a\u7ed9\u6b64\u4eba\u521b\u5efa\u64cd\u4f5c\u7528\u6237");return}for(var d=d.split(","),e=0;e<d.length;e++)if(a=d[e],chatWindow.isOnline(a))break}if(a!=Chat.userid)b.id=a,winMgr.openHistoryWindow(b)}}]}),listeners:{dblclick:function(b){if(b.isLeaf()){var a=
b.attributes.key;if(isCRM){b=b.attributes.uid;Console.log("uid = "+b);if(b==""){Ext.MessageBox.alert("\u63d0 \u793a","\u672a\u7ed9\u6b64\u4eba\u521b\u5efa\u64cd\u4f5c\u7528\u6237");return}for(var b=b.split(","),d=0;d<b.length;d++)if(a=b[d],chatWindow.isOnline(a))break}chatWindow.openChatUser(a)}else Console.log("Debug: ignore the department node!")},contextmenu:function(b,a){b.select();if(b.isLeaf()){var d=b.getOwnerTree().onlineUserMenu;d.contextNode=b;d.showAt(a.getXY())}}}});this.userPanel=new Ext.Panel({xtype:"panel",
region:"center",split:!0,collapsible:!1,layout:"accordion",border:!1,layoutConfig:{animate:!1},items:[this.onlineTreePanel,this.lateTreePanel,this.orgTreePanel]});this.rightPanel=new Ext.Panel({xtype:"panel",title:"\u5feb\u901f\u67e5\u627e",region:"east",width:210,minWidth:210,maxWidth:300,split:!0,collapsible:!0,layout:"border",items:[this.quickPanel,this.userPanel]});chatWindow=new Ext.Window({id:"MainWin",title:ChatHelper.VER,layout:"border",width:700,height:500,collwidth:225,collheight:600,closable:!0,
minimizable:!1,maximizable:!1,constrain:!0,plain:!0,closeAction:"hide",items:[this.leftPanel,this.rightPanel],_width:this.width,_height:this.height,_position:[],_normal:!0,padding:function(){this._width=this.getWidth();this._height=this.getHeight();this._position=this.getPosition();this.setWidth(this.collwidth);this.setHeight(this.collheight);this.setHeight(document.body.clientHeight-0);this.setPosition(document.body.clientWidth-this.collwidth,0)},alternate:function(){this._normal?(this.padding(),
this.collapsible=!0):(this.setWidth(this._width),this.setHeight(this._height),this.setPosition(this._position[0],this._position[1]),this.collapsible=!1);this._normal=!this._normal},collapse:function(){chatWindow.hidden?(this._normal=!this._normal,this.padding(),chatWindow.show()):(this._normal?chatWindow.show():chatWindow.hide(),this._normal=!this._normal)},listeners:{show:function(){if(!Chat.isWinShowed)this.initLateUsers(ChatHelper.lateUsers),Chat.isWinShowed=!0;Console.log("Info: show chatWindow")},
destroy:function(){Console.log("Info: chatWindow destroy,close the websocket");Chat.close()},minimize:function(){this.collapse()}},refreshOnlineUserNum:function(){var b=Ext.getCmp("im-tree").getNodeById("online"),a=0;b.eachChild(function(){a++});b.setText("\u5728\u7ebf\u7528\u6237("+a+")")},refreshWorkGroupNum:function(){var b=Ext.getCmp("im-tree").getNodeById("workgroup"),a=0;b.eachChild(function(){a++});b.setText("\u5de5\u4f5c\u7ec4("+a+")")},refreshLateUserNum:function(){var b=Ext.getCmp("late-tree").getNodeById("lateUser"),
a=0,d=0,e=this;Console.log("Debug: refresh all node ");b.eachChild(function(b){a+=e.setIconClass(b);d++});b.setText("\u6700\u8fd1\u8054\u7cfb\u4eba("+a+"/"+d+")")},setIconClass:function(b){var a=ChatHelper.getOnlineIconClass(b),d=ChatHelper.getOfflineIconClass(),e=b.getUI().getIconEl();ChatHelper.clearIconClass(e);return this.isOnline(b.id)?(Ext.Element.fly(e).addClass(a),1):(Ext.Element.fly(e).addClass(d),0)},setGroupClass:function(b,a){var d=Ext.getCmp("im-tree").getNodeById(b);d.flash=a;var e=
ChatHelper.getGroupIconClass(a),d=d.getUI().getIconEl();ChatHelper.clearGroupIconClass(d);Ext.Element.fly(d).addClass(e)},refreshGroupUserList:function(){},refreshOpenedGroup:function(){Ext.getCmp("im-tree").getNodeById("workgroup").eachChild(function(b){var a=winMgr.getGroupWin(b.id);a&&(Console.log(b.text+" is opened"),a.hidden?Console.log("this window is hidden, ignore"):Console.log("window is showed, update user info"))})},getWorkGroupName:function(b){return Ext.getCmp("im-tree").getNodeById(b).text},
getWorkGroupCreater:function(b){return Ext.getCmp("im-tree").getNodeById(b).crtuser},getOnlineUserNode:function(b){return Ext.getCmp("im-tree").getNodeById(b)},openChatUser:function(b){b==Chat.userid?Console.log("Debug: ignore myself node"):this.isOnline(b)?(b=this.getOnlineUserNode(b))&&winMgr.openWindow(b):(Console.log("Debug: "+b+" is offline!"),Chat.sendSmsGetPhoneCmd(b))},isMyGroup:function(b){for(var a=Ext.getCmp("im-tree").getNodeById("workgroup").childNodes,d=0;d<a.length;d++)if(a[d].id==
b)return!0;Console.log("Debug: "+b+" is not my group!");return!1},isOnline:function(b){var a=Ext.getCmp("im-tree").getNodeById("online");if(a)for(var a=a.childNodes,d=0;d<a.length;d++)if(a[d].id==b)return!0;return!1},getStatus:function(b){return(b=Ext.getCmp("im-tree").getNodeById(b))?b.status:0},addOnlineUser:function(b){if(this.isOnline(b.join))Console.log("user ["+b.join+"] is online.");else{var a=Ext.getCmp("im-tree").getNodeById("online");if(a)try{var d=b.title;b.from==b.join&&b.from==b.to&&
(Chat.setUserid(b.join),Chat.setNickname(d),d="<b>"+d+"</b>",Console.log("Info: "+Chat.userid+","+Chat.getNickname()));var e=new Ext.tree.TreeNode({id:b.join,text:d,iconCls:ChatHelper.getOnlineIconClass(b),leaf:!0});e.pic=b.picname;e.zw=b.zw||"\u672a\u5206\u914d\u804c\u52a1";e.mobile=b.mobile||"10086";e.bm=b.bm||"\u672a\u5206\u914d\u90e8\u95e8";e.sex=b.sex;e.status=b.status;a.appendChild(e);a.isExpanded()||a.expand();this.refreshOnlineUserNum();this.refreshLateUserNum();this.refreshOpenedGroup()}catch(f){Console.log("Error: add node failed!"+
f)}else Console.log("Error: online node is not find!")}},setUserStatus:function(b,a){var d=Ext.getCmp("im-tree").getNodeById(b);if(d)d.status=a,this.setIconClass(d);if(d=Ext.getCmp("late-tree").getNodeById(b))d.status=a,this.refreshLateUserNum()},removeOnlineUser:function(b){var a=Ext.getCmp("im-tree"),d=a.getNodeById("online");b?((b=a.getNodeById(b))?a.getNodeById("offline").appendChild(b.remove(!0)):Console.log("Error: node of removed is not find!"),this.refreshLateUserNum()):d&&d.removeAll();this.refreshOnlineUserNum();
this.refreshOpenedGroup()},addLateUser:function(b){Console.log("Debug: add user node to late: "+b.id+","+b.sex);var a=Ext.getCmp("late-tree").getNodeById(b.id);a&&(Console.log("Debug: del the oldNode:"+a.id),a.remove(!0));if(a=Ext.getCmp("late-tree").getNodeById("lateUser")){Console.log("icon class:"+ChatHelper.getOnlineIconClass(b));var d=new Ext.tree.TreeNode({id:b.id,text:b.text,iconCls:ChatHelper.getOnlineIconClass(b),leaf:!0});d.sex=b.sex;d.status=b.status;a.firstChild?(Console.log("insert the first node"),
a.insertBefore(d,a.firstChild)):(Console.log("append node"),a.appendChild(d));a.isExpanded()||a.expand();this.refreshLateUserNum();localStorage.setItem(ChatHelper.LS_ITEM_LATEUSERS,Ext.encode(this.getLateUsers()))}else Console.log("Error: lateUser node is not find!")},getLateUsers:function(){var a=[];Ext.getCmp("late-tree").getNodeById("lateUser").eachChild(function(c){a.length<ChatHelper.maxLateUsers&&a.push({id:c.id,text:c.text,sex:c.sex,status:c.status})});return a},clearLateUsers:function(){Ext.getCmp("late-tree").getNodeById("lateUser").removeAll(!0);
this.refreshLateUserNum();localStorage.setItem(ChatHelper.LS_ITEM_LATEUSERS,"")},initLateUsers:function(a){if(a.length>0){Console.log("Info: init lateUsrs of "+a.length);var c=Ext.getCmp("late-tree").getNodeById("lateUser");if(c){for(var d=0;d<a.length;d++){a[d].status=this.getStatus(a[d].id);var e=new Ext.tree.TreeNode({id:a[d].id,text:a[d].text,iconCls:ChatHelper.getOnlineIconClass(a[d]),leaf:!0});e.sex=a[d].sex;e.status=a[d].status;c.appendChild(e)}c.expand();this.refreshLateUserNum()}else Console.log("Error: init lateUser node is not find!")}else Console.log("Info: lateUsers is null")},
addGroup:function(a){var c=Ext.getCmp("im-tree").getNodeById("workgroup");if(c)try{var d=new Ext.tree.TreeNode({id:a.id,text:a.f_name,iconCls:ChatHelper.getGroupIconClass(!1),leaf:!0});d.crtuser=a.f_createUser;d.note=a.f_note;d.flash=!1;c.appendChild(d);c.isExpanded()||c.expand();this.refreshWorkGroupNum()}catch(e){Console.log("Error: add workgroup node failed!")}else Console.log("Error: workgroup node is not find!")},removeGroup:function(a){var c=Ext.getCmp("im-tree"),d=c.getNodeById("workgroup");
a?(a=c.getNodeById(a))?a.remove(!0):Console.log("Error: workgroup's node of removed is not find!"):d&&d.removeAll();this.refreshOnlineUserNum()},refreshOnlineList:function(a){this.removeOnlineUser();Ext.each(a,this.addOnlineUser,this);this.refreshOnlineUserNum()},refreshWorkGroupList:function(a){this.removeGroup();Ext.each(a,this.addGroup,this)},addGroupMsg:function(a){var c=Ext.getCmp("im-tree").getNodeById(a.from);winMgr.openGroupWindow(c).addMsg(a)},addMsg:function(a){ChatHelper.addMsgToPanel("msgPanel",
a)},addUserMsg:function(a){var c=Ext.getCmp("im-tree").getNodeById(a.from);c||(c={id:a.from});winMgr.openWindow(c).addMsg(a)},addUserSelfMsg:function(a){var c=Ext.getCmp("im-tree").getNodeById(a.from);c||(c={id:a.from});winMgr.openWindow(c).addSelfMsg(a)},enableInput:function(a){a?(Ext.getCmp("inputAllBox").enable(),Ext.getCmp("sendAllBtn").enable()):(Ext.getCmp("inputAllBox").disable(),Ext.getCmp("sendAllBtn").disable())}});return Chat.initialize()};
crtGroupWindow=Ext.extend(Ext.Window,{constructor:function(){var a=this;crtGroupWindow.superclass.constructor.call(this,{title:"\u521b\u5efa\u5de5\u4f5c\u7ec4",width:500,height:300,closable:!0,closeAction:"hide",layout:"fit",plain:!0,bodyStyle:"padding:5px;",buttonAlign:"center",constrain:!0,items:[{baseCls:"x-plain",labelWidth:70,xtype:"form",defaultType:"textfield",items:[{id:"crt-wg-id",hidden:!0,value:"0"},{fieldLabel:"\u5de5\u4f5c\u7ec4\u540d\u79f0",id:"crt-wg-name",anchor:"100%"},{fieldLabel:"\u5de5\u4f5c\u7ec4\u516c\u544a",
xtype:"textarea",id:"crt-wg-note",anchor:"100% -10"}]}],buttons:[{id:"crt-group-win-save",text:"\u786e \u5b9a",handler:function(){var a={id:Ext.getCmp("crt-wg-id").getValue(),f_name:Ext.getCmp("crt-wg-name").getValue(),f_note:Ext.getCmp("crt-wg-note").getValue()};a.f_name!=""&&a.f_note!=""?Chat.sendCreateGroupCmd(Ext.encode(a)):Ext.MessageBox.alert("\u63d0\u793a","\u5de5\u4f5c\u7ec4\u540d\u79f0\u548c\u516c\u544a\u4e0d\u80fd\u4e3a\u7a7a\uff01")}},{text:"\u53d6 \u6d88",handler:function(){Ext.getCmp("crt-group-win-save").enable();
a.hide()}}],reset:function(){Ext.getCmp("crt-wg-id").setValue("0");Ext.getCmp("crt-wg-name").setValue("");Ext.getCmp("crt-wg-note").setValue("");Ext.getCmp("crt-group-win-save").enable()},init:function(a){a?(Ext.getCmp("crt-wg-id").setValue(a.id),Ext.getCmp("crt-wg-name").setValue(a.name),Ext.getCmp("crt-wg-note").setValue(a.note),a.crtuser||Ext.getCmp("crt-group-win-save").disable()):this.reset()}})}});
GroupWindow=Ext.extend(Ext.Window,{constructor:function(a){var b=this;GroupWindow.superclass.constructor.call(this,{id:"gw_"+a,title:"\u5de5\u4f5c\u7ec4",width:600,height:450,closable:!0,closeAction:"hide",maximizable:!0,layout:"border",plain:!0,constrain:!0,items:[{xtype:"panel",layout:"border",border:!1,region:"center",items:[{id:"msg_grp_"+a,autoScroll:!0,region:"center"},{xtype:"panel",region:"south",height:150,layout:"fit",tbar:["->",{xtype:"tbbutton",id:"grp-clear-btn-"+a,text:"\u6e05\u5c4f",
icon:ChatHelper.picsUrl.clear,listeners:{click:function(){ChatHelper.clearPanel("msg_grp_"+a)}}},{xtype:"tbbutton",id:"grp-history-btn-"+a,text:"\u6d88\u606f\u8bb0\u5f55",icon:ChatHelper.picsUrl.recorder,listeners:{click:function(){Ext.getCmp("grp-clear-btn-"+a).fireEvent("click");webSql.queryMsg("msg_grp_"+a,!0,a)}}}],items:[{id:"inputbox_grp_"+a,xtype:"textarea",region:"center",allowBlank:!1,blankText:"\u8f93\u5165\u5185\u5bb9\u4e0d\u53ef\u4e3a\u7a7a",enableKeyEvents:!0,listeners:{keydown:function(b,
d){ChatHelper.fireClickEvent(d,b,"sendUserBtn_grp_"+a)},render:function(){Ext.fly(this.el).on("dragenter",function(){MsgTip.msg("\u5c0f\u63d0\u793a","\u628a\u56fe\u7247\u653e\u5728\u8fd9\u91cc\u5c31\u80fd\u53d1\u9001\u51fa\u53bb\uff01",!0)}).on("drop",function(b){ChatHelper.dropImage(b,Chat.TYPE.get("GROUP"),a)})}}}],buttons:[{text:"\u5173 \u95ed",handler:function(){b.hide()}},{text:"\u53d1 \u9001",id:"sendUserBtn_grp_"+a,listeners:{click:function(){var b=Ext.getCmp("inputbox_grp_"+a);b.getValue()!=
""&&Chat.sendMessage(b.getValue(),Chat.TYPE.get("GROUP"),a)&&(b.reset(),b.focus())}}}]}]},{region:"east",width:180,split:!0,layout:"accordion",items:[{id:"im-grouptree_"+a,title:"\u5de5\u4f5c\u7ec4\u6210\u5458",xtype:"treepanel",enableDrop:!0,lines:!1,autoScroll:!0,tools:[{id:"refresh",on:{click:function(){Chat.sendRefreshGroupUser(a)}}}],root:new Ext.tree.AsyncTreeNode({id:"wg-"+a,text:"\u5de5\u4f5c\u7ec4",expanded:!0,children:[]}),UserMenu:new Ext.menu.Menu({items:[{id:"grp-open-user-"+a,text:"\u53d1\u9001\u5373\u65f6\u6d88\u606f"},
{id:"grp-open-user-history-"+a,text:"\u67e5\u770b\u5386\u53f2\u6d88\u606f"},{id:"grp-del-user-"+a,text:"\u5220\u9664\u8be5\u7528\u6237"}],listeners:{itemclick:function(b){var d=b.parentMenu.contextNode;switch(b.id){case "grp-del-user-"+a:chatWindow.getWorkGroupCreater(a)==Chat.userid?chatWindow.getWorkGroupCreater(a)==d.id?alert("\u4e0d\u80fd\u5220\u9664\u521b\u5efa\u8005\uff01"):Chat.sendDelGroupUserCmd(Ext.encode({wgid:a,userid:d.id})):alert("\u53ea\u6709\u672c\u5de5\u4f5c\u7ec4\u7684\u521b\u5efa\u8005\u80fd\u5220\u9664\u7528\u6237\uff01");
break;case "grp-open-user-"+a:chatWindow.openChatUser(d.id);break;case "grp-open-user-history-"+a:winMgr.openHistoryWindow(d);break;default:Console.log("not surpport")}}}}),listeners:{beforenodedrop:function(){if(chatWindow.getWorkGroupCreater(a)!=Chat.userid)return alert("\u53ea\u6709\u8be5\u5de5\u4f5c\u7ec4\u7684\u521b\u5efa\u8005\u624d\u80fd\u589e\u52a0\u7528\u6237\uff01"),!1},nodedrop:function(b){Chat.sendAddGroupUserCmd(Ext.encode({wgid:a,userid:b.dropNode.attributes.key}))},contextmenu:function(a,
b){a.select();if(a.isLeaf()){var e=a.getOwnerTree().UserMenu;e.contextNode=a;e.showAt(b.getXY())}else Console.log("Debug: is not user")},dblclick:function(a){a.isLeaf()&&chatWindow.openChatUser(a.id)}}}]}],addUser:function(b){var d=Ext.getCmp("im-grouptree_"+a).getNodeById("wg-"+a);if(d)try{var e=b.nickname;b.userid==chatWindow.getWorkGroupCreater(a)&&(e="<b>"+e+"</b>");var f=new Ext.tree.TreeNode({id:b.userid,text:e,iconCls:ChatHelper.getIconClass(b),leaf:!0});f.online=b.online;f.sex=b.sex;f.status=
b.status;d.appendChild(f);d.isExpanded()||d.expand();this.refreshOnlineUserNum()}catch(h){Console.log("Error: add node failed!"+h)}else Console.log("Error: root node is not find!")},setGroupTitle:function(){var b=chatWindow.getWorkGroupName(a);Ext.getCmp("gw_"+a).setTitle(b);var d=Ext.getCmp("im-grouptree_"+a).getNodeById("wg-"+a);d&&d.setText(b)},removeUser:function(b){var d=Ext.getCmp("im-grouptree_"+a),e=d.getNodeById("wg-"+a);b?(b=d.getNodeById(b))?b.remove(!0):Console.log("Error: workgroup's user node of removed is not find!"):
e&&e.removeAll();this.refreshOnlineUserNum()},histroy:function(){Ext.getCmp("grp-history-btn-"+a).fireEvent("click")},refreshUserList:function(a){this.removeUser();Ext.each(a,this.addUser,this);this.refreshOnlineUserNum()},refreshOnlineUserNum:function(){var b=Ext.getCmp("im-grouptree_"+a).getNodeById("wg-"+a),d=chatWindow.getWorkGroupName(a),e=0,f=0;b.eachChild(function(a){a.online&&e++;f++});b.setText(d+"("+e+"/"+f+")")},addMsg:function(a){this.addSelfMsg(a);ChatHelper.sendNotify(a);Chat.play("group")},
addSelfMsg:function(b){ChatHelper.addMsgToPanel("msg_grp_"+a,b)}})}});
UserWindow=Ext.extend(Ext.Window,{constructor:function(a){var b=this;UserWindow.superclass.constructor.call(this,{id:"uw_"+a.id,title:a.text,width:600,height:500,closable:!0,closeAction:"hide",maximizable:!0,layout:"border",plain:!0,constrain:!0,items:[{id:"msg_"+a.id,autoScroll:!0,region:"center"},{xtype:"panel",region:"south",height:150,layout:"fit",tbar:["->",{id:"dsknf_"+a.id,xtype:"tbbutton",text:"\u684c\u9762\u6d88\u606f",handler:function(){(new DesktopNotification(1,{url:ChatHelper.picsUrl.tip,
title:"\u63d0 \u9192",body:"\u4f60\u5df2\u542f\u7528\u684c\u9762\u6d88\u606f\uff01"},ChatHelper.notifyDelay)).init()}},{xtype:"tbbutton",id:"clear-btn-"+a.id,text:"\u6e05\u5c4f",icon:ChatHelper.picsUrl.clear,listeners:{click:function(){ChatHelper.clearPanel("msg_"+a.id)}}},{xtype:"tbbutton",id:"history-btn-"+a.id,text:"\u6d88\u606f\u8bb0\u5f55",icon:ChatHelper.picsUrl.recorder,listeners:{click:function(){Ext.getCmp("clear-btn-"+a.id).fireEvent("click");webSql.queryMsg("msg_"+a.id,!1,a.id)}}}],items:[{id:"inputbox_"+
a.id,xtype:"textarea",region:"center",allowBlank:!1,blankText:"\u8f93\u5165\u5185\u5bb9\u4e0d\u53ef\u4e3a\u7a7a",enableKeyEvents:!0,listeners:{keydown:function(b,c){ChatHelper.fireClickEvent(c,b,"sendUserBtn_"+a.id)},render:function(){Ext.fly(this.el).on("dragenter",function(){MsgTip.msg("\u5c0f\u63d0\u793a","\u628a\u56fe\u7247\u653e\u5728\u8fd9\u91cc\u5c31\u80fd\u53d1\u9001\u51fa\u53bb\uff01",!0)}).on("drop",function(b){ChatHelper.dropImage(b,Chat.TYPE.get("TALK"),a.id)})}}}],buttons:[{text:"\u5173 \u95ed",
handler:function(){b.hide()}},{text:"\u53d1 \u9001",id:"sendUserBtn_"+a.id,listeners:{click:function(){var b=Ext.getCmp("inputbox_"+a.id);b.getValue()!=""&&Chat.sendMessage(b.getValue(),Chat.TYPE.get("TALK"),a.id)&&(b.reset(),b.focus())}}}]},{id:"info_"+a.id,xtype:"form",region:"east",width:180,split:!0,collapsible:!0,layout:"accordion",defaultType:"textfield",layout:"form",labelWidth:40,frame:!0,items:[{xtype:"box",id:"user-pic-"+a.id,width:180,height:200,autoEl:{tag:"img",src:ChatHelper.getPicurl(a)}},
{id:"user-bm-"+a.id,fieldLabel:"\u90e8\u95e8",width:120,disabled:!0,value:a.bm},{id:"user-zw-"+a.id,fieldLabel:"\u804c\u52a1",width:120,disabled:!0,value:a.zw},{id:"user-mobile-"+a.id,fieldLabel:"\u624b\u673a",width:120,disabled:!0,value:a.mobile}]}],history:function(){Ext.getCmp("history-btn-"+a.id).fireEvent("click")},addMsg:function(a){this.addSelfMsg(a);ChatHelper.sendNotify(a);Chat.play("msg")},addSelfMsg:function(b){ChatHelper.addMsgToPanel("msg_"+a.id,b)},refreshInfo:function(b){var c=ChatHelper.getPicurl(b);
Ext.getCmp("user-pic-"+a.id).el.dom.src=c;Ext.getCmp("user-bm-"+a.id).setValue(b.bm);Ext.getCmp("user-zw-"+a.id).setValue(b.zw);Ext.getCmp("user-mobile-"+a.id).setValue(b.mobile)}});var c=new DesktopNotification;c.checkSupport()?c.checkPermission()==0&&(c=Ext.getCmp("dsknf_"+a.id),c.hide()):(c=Ext.getCmp("dsknf_"+a.id),c.hide())}});
SmsWindow=Ext.extend(Ext.Window,{constructor:function(){var a=this;SmsWindow.superclass.constructor.call(this,{title:"\u53d1\u9001\u77ed\u4fe1",width:400,height:220,closable:!0,closeAction:"hide",layout:"fit",plain:!0,bodyStyle:"padding:5px;",buttonAlign:"center",constrain:!0,items:[{baseCls:"x-plain",labelWidth:70,xtype:"form",defaultType:"textfield",items:[{id:"sms-userid",hidden:!0,value:"0"},{id:"sms-username",fieldLabel:"\u59d3\u540d",readOnly:!0,anchor:"100%"},{fieldLabel:"\u624b\u673a",id:"sms-phone",
readOnly:!0,anchor:"100%"},{fieldLabel:"\u5185\u5bb9",xtype:"textarea",id:"sms-note",anchor:"100% -10"}]}],buttons:[{id:"sms-send",text:"\u53d1 \u9001",handler:function(){var a=Chat.getNickname(),c=Ext.getCmp("sms-note").getValue(),a={userid:Ext.getCmp("sms-userid").getValue(),phone:Ext.getCmp("sms-phone").getValue(),msg:a+": "+c};a.phone!=""&&c!=""?ChatHelper.getStrLength(a.msg)>120?alert("\u53d1\u9001\u4fe1\u606f\u8fc7\u957f\uff0c\u8bf7\u5220\u9664\u90e8\u5206\u8981\u53d1\u9001\u7684\u4fe1\u606f\uff01"):
(Ext.getCmp("sms-send").disable(),Chat.sendSmsCmd(Ext.encode(a))&&Ext.getCmp("sms-note").setValue("")):alert("\u7535\u8bdd\u53f7\u7801\u548c\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a\uff01")}},{text:"\u53d6 \u6d88",handler:function(){a.hide()}}],reset:function(){Ext.getCmp("sms-userid").setValue("");Ext.getCmp("sms-username").setValue("");Ext.getCmp("sms-phone").setValue("");Ext.getCmp("sms-note").setValue("");Ext.getCmp("sms-send").enable()},init:function(a){a?(Ext.getCmp("sms-phone").setValue(a.phone),
Ext.getCmp("sms-userid").setValue(a.userid),Ext.getCmp("sms-username").setValue(a.name),Ext.getCmp("sms-note").setValue(""),Ext.getCmp("sms-send").enable()):this.reset()},close:function(){a.hide()}})}});
UploadWindow=Ext.extend(Ext.Window,{constructor:function(){var a=this;SmsWindow.superclass.constructor.call(this,{title:"\u4e0a\u4f20\u56fe\u7247",width:280,height:360,closable:!0,closeAction:"hide",plain:!0,bodyStyle:"padding:5px;",items:[{baseCls:"x-plain",xtype:"form",labelWidth:1,items:[{xtype:"displayfield",value:"\u5c06\u56fe\u7247\u62c9\u5230\u4ee5\u4e0b\u65b9\u6846\u4e2d\uff0c\u70b9\u51fb\u201c\u5b58\u76d8\u201d\u66f4\u6539\u5934\u50cf",labelSeparator:""},{xtype:"box",id:"user-photo",width:180,
height:200,style:"align: center;float:left;width:180px;height:200px;margin:10px 0 0 0;border:1px solid #015EAC;color:#666;",autoEl:{tag:"img"},listeners:{render:function(){Ext.fly(this.el).on("dragover",function(a){a.stopPropagation();a.preventDefault()},!1).on("drop",function(a){a.stopPropagation();a.preventDefault();for(var c=a.browserEvent.dataTransfer.files,d=0;a=c[d];d++)if((a.type?a.type:"n/a").indexOf("image")>=0){c=new FileReader;c.onload=function(a){if(a.size<=ChatHelper.maxImage*1024)return function(a){Ext.getDom("user-photo").src=
a.target.result};else alert("\u4e0a\u4f20\u6587\u4ef6\u8bf7\u63a7\u5236\u5728"+ChatHelper.maxImage+"k\u5185")}(a);c.readAsDataURL(a);break}else alert("\u53ea\u80fd\u653e\u7f6e\u56fe\u7247\u6587\u4ef6")},!1)}}}]}],buttons:[{id:"photo-save",text:"\u5b58  \u76d8",handler:function(){Chat.sendMessage(Ext.getDom("user-photo").src,Chat.TYPE.get("CMD"),Chat.userid,"img")}},{text:"\u5173  \u95ed",handler:function(){a.hide()}}],close:function(){a.hide()}})}});
var winMgr={userWindows:new Ext.util.MixedCollection,groupWindows:new Ext.util.MixedCollection,createGroupWindow:null,smsWindow:null,uploadWindow:null,openHistoryWindow:function(a){this.openWindow(a).history()},openUploadWin:function(){if(!this.uploadWindow)Console.log("Debug: open the uploadWindow."),this.uploadWindow=new UploadWindow;return this.uploadWindow.show()},openSmsWin:function(){if(!this.smsWindow)Console.log("Debug: open the smsWindow."),this.smsWindow=new SmsWindow;return this.smsWindow.show()},
openCreateGroupWin:function(){if(!this.createGroupWindow)Console.log("Debug: open the createGroupwin."),this.createGroupWindow=new crtGroupWindow;return this.createGroupWindow.show()},closeCreateGroupWin:function(){this.createGroupWindow&&(this.createGroupWindow.reset(),this.createGroupWindow.hide())},openWindow:function(a){var b=this.userWindows.get(a.id);b?chatWindow.isOnline(a.id)&&b.refreshInfo(a):(b=new UserWindow(a),this.userWindows.add(a.id,b));chatWindow.addLateUser(a);return b.show()},openGroupWindow:function(a){var b=
this.getGroupWindow(a);b.hidden&&(b.show(),Console.log("Debug: window is hidden, send refresh group user command."),Chat.sendRefreshGroupUser(a));return b},getGroupWindow:function(a){var b=this.groupWindows.get(a);b||(b=new GroupWindow(a),b.setGroupTitle(),b.show(),b.hide(),this.groupWindows.add(a,b));return b},getGroupWin:function(a){return this.groupWindows.get(a)}},Chat={TYPE:new Ext.util.MixedCollection,CMD:new Ext.util.MixedCollection,SCRIPT:[],isWinShowed:!1,userid:0,nickname:"",status:0,audioMgr:{msg:document.createElement("audio"),
group:document.createElement("audio"),init:function(){var a=document.createElement("source");a.type="audio/ogg";a.src=ChatHelper.audiosUrl.msg;this.msg.appendChild(a);a=document.createElement("source");a.type="audio/ogg";a.src=ChatHelper.audiosUrl.group;this.group.appendChild(a)},play:function(a){a=="msg"?(Console.log("play msg"),this.msg.play()):(Console.log("play group"),this.group.play())}},init:function(){this.TYPE.add("TALK",0);this.TYPE.add("CMD",1);this.TYPE.add("GROUP",2);this.CMD.add("REFRESH_USER_LIST",
"0");this.CMD.add("CREATE_WORKGROUP","1");this.CMD.add("DESTROY_WORKGROUP","2");this.CMD.add("ADD_WORKGROUP_USER","3");this.CMD.add("DEL_WORKGROUP_USER","4");this.CMD.add("REFRESH_GROUP_USER","5");this.CMD.add("SYSTEM_USER_LOGIN","6");this.CMD.add("SYSTEM_USER_LOGOUT","7");this.CMD.add("EXIT_WORKGROUP","8");this.CMD.add("SMS_GET_PHONE","9");this.CMD.add("SMS_SEND_MSG","10");this.CMD.add("OPEN_USER_WIN","11");this.CMD.add("SYSTEM_PUSH","12");this.CMD.add("SYSTEM_USER_STATUS","13");Console.log("Info: init static params");
this.audioMgr.init();if(Ext.isChrome)a=new Ext.util.DelayedTask(function(){var a=new DesktopNotification;a.checkSupport()&&a.checkPermission()!=0?(win=new Ext.Window({layout:"fit",width:320,height:140,plain:!0,html:"\u60a8\u662f\u5426\u5f00\u542f\u5728\u7ebf\u4ea4\u6d41\u7684\u684c\u9762\u63d0\u9192\uff1f<br><br>\u684c\u9762\u63d0\u9192\u53ef\u4ee5\u5728\u60a8\u505a\u5176\u4ed6\u5de5\u4f5c\u65f6\uff0c\u4ecd\u80fd\u83b7\u77e5\u6d88\u606f\u5230\u8fbe\u3002<br>\u70b9\u51fb\u5f00\u542f\u540e\uff0c\u518d\u70b9\u51fb\u9875\u9762\u9876\u90e8\u7684\u5141\u8bb8\u3002",
buttons:[{text:"\u5f00 \u542f",handler:function(){a.init();win.close()}}]}),win.show()):Console.log("Info: desktop notification is enabled.")}),a.delay(ChatHelper.delay);else{Console.log("not chrome");var a=new Ext.util.DelayedTask(function(){Ext.MessageBox.show({title:"\u63d0 \u793a",msg:"\u4e3a\u4e86\u63d0\u9ad8\u7528\u6237\u4f53\u9a8c\uff0c\u672c\u7cfb\u7edf\u4e0d\u518d\u652f\u6301\u975echrome\u6d4f\u89c8\u5668\uff0c\u8bf7\u5927\u5bb6\u901f\u5ea6\u4e0b\u8f7d\u5b89\u88c5\u3002",buttons:Ext.MessageBox.OK,
fn:function(){window.open("http://www.google.com/chrome","_blank")},icon:Ext.MessageBox.WARNING})})}window.onbeforeunload=function(){Console.log("Debug: refresh the window.");Chat.close()};window.onunload=function(){Console.log("Debug: close the window.");Chat.close()}},socket:null,connect:function(a){Console.log("Info: connect server: "+a);if("WebSocket"in window)this.socket=new WebSocket(a);else if("MozWebSocket"in window)this.socket=new MozWebSocket(a);else{Console.log("Error: WebSocket is not supported by this browser.");
return}this.socket.onopen=function(){Console.log("Info: WebSocket connection opened.");chatWindow&&chatWindow.enableInput(!0)};this.socket.onclose=function(){Console.log("Info: WebSocket closed.");chatWindow&&(Console.log("\u8fde\u63a5\u4e2d\u65ad\uff0c30\u79d2\u540e\u91cd\u8fde"),(new Ext.util.DelayedTask(function(){Chat.initialize()})).delay(3E4))};this.socket.onmessage=function(a){var c=Ext.decode(a.data);if(c.type&&c.type==Chat.TYPE.get("CMD"))if(c.cmd==Chat.CMD.get("SYSTEM_USER_LOGIN"))Console.log("login seccess"),
c.userid&&(Chat.setUserid(c.userid),Console.log("Info: set userid: "+Chat.userid));else if(c.cmd==Chat.CMD.get("SYSTEM_USER_LOGOUT"))chatWindow.removeOnlineUser(c.userid),Chat.isWinShowed&&(a=chatWindow.getOnlineUserNode(c.userid),chatWindow.addMsg({from:0,to:Chat.userid,title:"\u7cfb\u7edf\u6d88\u606f",content:c.lt+"&nbsp;"+a.text+"&nbsp;\u79bb\u5f00"}));else if(c.cmd==Chat.CMD.get("REFRESH_USER_LIST"))chatWindow.refreshWorkGroupList(c.groups),a=new Ext.util.DelayedTask(function(){Console.log(c.onlineusers);
chatWindow.refreshOnlineList(c.onlineusers)}),a.delay(300);else if(c.cmd==Chat.CMD.get("REFRESH_GROUP_USER"))a=winMgr.openGroupWindow(c.wgid),a.refreshUserList(c.users);else if(c.cmd==Chat.CMD.get("CREATE_WORKGROUP"))c.result=="ok"?(winMgr.closeCreateGroupWin(),Chat.sendRefreshOnlineListCmd(),alert("\u5de5\u4f5c\u7ec4\u521b\u5efa\u6210\u529f\uff0c\u53cc\u51fb\u6253\u5f00\u8be5\u5de5\u4f5c\u7ec4\uff0c\u4ece\u7ec4\u7ec7\u7ed3\u6784\u91cc\u9009\u62e9\u6210\u5458\uff0c\u62c9\u5230\u5de5\u4f5c\u7ec4\u91cc")):
alert(c.result);else if(c.cmd==Chat.CMD.get("DESTROY_WORKGROUP"))alert(c.result);else if(c.cmd==Chat.CMD.get("SMS_GET_PHONE"))a=winMgr.openSmsWin(),a.init(c.result);else if(c.cmd==Chat.CMD.get("SMS_SEND_MSG"))alert(c.result),a=winMgr.openSmsWin(),a.reset(),a.close();else if(c.cmd==Chat.CMD.get("OPEN_USER_WIN"))chatWindow.openChatUser(c.result);else if(c.cmd==Chat.CMD.get("SYSTEM_PUSH")){var a=c.result,d=c.param;Console.log("DEBUG: System push command: "+a);if(Chat.SCRIPT[a])Console.log("call register method: "+
a),Chat.SCRIPT[a](d);else if(a=="{HACK}"){Console.log("call {"+d+"}");try{eval(d)}catch(e){Console.log("!HACK ERROR!"+e.name+":"+e.message)}}else Console.log("\u65b9\u6cd5\u540d["+a+"]\u672a\u6ce8\u518c")}else c.cmd==Chat.CMD.get("SYSTEM_USER_STATUS")?chatWindow.setUserStatus(c.userid,c.status):Console.log("ERROR: cmd not surpport:"+c.cmd);else c.type&&c.type==Chat.TYPE.get("GROUP")?(Console.log("get group message"),Chat.isWinShowed?(Console.log("mainwin have opened, open groupwin."),chatWindow.isMyGroup(c.to)?
(Chat.status==0?a=winMgr.openGroupWindow(c.to):(a=winMgr.getGroupWindow(c.to),a.hidden&&chatWindow.setGroupClass(c.to,!0)),a.addMsg(c)):Console.log("is not my group: "+c.to)):(Console.log("force open window"),chatWindow.show(),Chat.sendRefreshOnlineListCmd(),Chat.sendRefreshOnlineListCmd(),a=new Ext.util.DelayedTask(function(){if(chatWindow.isMyGroup(c.to)){var a=winMgr.openGroupWindow(c.to);Chat.sendRefreshGroupUser(c.to);a.addMsg(c)}else Console.log("is not my group: "+c.to)}),a.delay(ChatHelper.delay))):
c.join!=0?(chatWindow.addOnlineUser(c),Chat.isWinShowed&&chatWindow.addMsg({from:0,to:Chat.userid,title:"\u7cfb\u7edf\u6d88\u606f",content:c.lt+"&nbsp;"+c.title+c.addr+"&nbsp;\u767b\u5f55"})):c.out!=0?chatWindow.removeOnlineUser(c.out):c.to==0?chatWindow.addMsg(c):c.to==Chat.userid&&(Chat.isWinShowed?(Console.log("mainwin have opened, open userwin."),c.title.indexOf(Chat.getNickname())==0?chatWindow.addUserSelfMsg(c):chatWindow.addUserMsg(c)):(Console.log("force open window"),chatWindow.show(),Chat.sendRefreshOnlineListCmd(),
Chat.sendRefreshOnlineListCmd(),a=new Ext.util.DelayedTask(function(){chatWindow.addUserMsg(c)}),a.delay(ChatHelper.delay)))};this.socket.onerror=function(){Console.log("Error: WebSocket error.")}},initialize:function(){var a=window.location.protocol=="http:"?"ws":"wss";a+="://"+window.location.host+"/portal/websocket/chat";try{return this.connect(a),!0}catch(b){return alert("!ERROR!"+b.name+": "+b.message),!1}},sendMessage:function(a,b,c,d){Console.log("sendMsg--\>  msg:"+a+", type:"+b+",to:"+c+
",title:"+d);if(!this.isConnected()&&this.initialize())return alert("\u8fde\u63a5\u670d\u52a1\u5668\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\uff01"),!1;if(a!=""){if(d!="img"&&(b==this.TYPE.get("TALK")||b==this.TYPE.get("GROUP")))a=escape(a);a={content:a,type:b||this.TYPE.get("TALK"),to:c||0,title:d||""};this.socket.send(Ext.encode(a));return!0}},close:function(){this.socket&&!this.isConnected&&this.socket.close()},isConnected:function(){return this.socket.readyState==1},isSupportWs:function(){return"WebSocket"in
window||"MozWebSocket"in window},sendRefreshOnlineListCmd:function(){this.sendMessage(this.CMD.get("REFRESH_USER_LIST"),this.TYPE.get("CMD"))},sendRefreshGroupUser:function(a){this.sendMessage(this.CMD.get("REFRESH_GROUP_USER"),this.TYPE.get("CMD"),0,a);chatWindow.setGroupClass(a,!1)},sendCreateGroupCmd:function(a){this.sendMessage(this.CMD.get("CREATE_WORKGROUP"),this.TYPE.get("CMD"),0,a)},sendDestroyGroupCmd:function(a){this.sendMessage(this.CMD.get("DESTROY_WORKGROUP"),this.TYPE.get("CMD"),0,a)},
sendAddGroupUserCmd:function(a){this.sendMessage(this.CMD.get("ADD_WORKGROUP_USER"),this.TYPE.get("CMD"),0,a)},sendExitGroupCmd:function(a){this.sendMessage(this.CMD.get("EXIT_WORKGROUP"),this.TYPE.get("CMD"),0,a)},sendDelGroupUserCmd:function(a){this.sendMessage(this.CMD.get("DEL_WORKGROUP_USER"),this.TYPE.get("CMD"),0,a)},sendSmsGetPhoneCmd:function(a){this.sendMessage(this.CMD.get("SMS_GET_PHONE"),this.TYPE.get("CMD"),0,a)},sendSmsCmd:function(a){this.sendMessage(this.CMD.get("SMS_SEND_MSG"),this.TYPE.get("CMD"),
0,a)},sendUserStatusCmd:function(a){this.sendMessage(this.CMD.get("SYSTEM_USER_STATUS"),this.TYPE.get("CMD"),0,a)},setUserid:function(a){this.userid=a},setNickname:function(a){this.nickname=a},getNickname:function(){return this.nickname},play:function(a){this.audioMgr.play(a)}};Chat.init();Mixky.wasoft.lib.chatroom.init();
IM=function(){return{openMainWin:function(){chatWindow?chatWindow.collapse():Console.log("Error: not support")},openUser:function(a){chatWindow?chatWindow.openChatUser(a):Console.log("Error: not support")},regMethod:function(a,b){if(Chat.SCRIPT[a])alert("\u65b9\u6cd5\u540d["+a+"]\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u66f4\u6539\u65b9\u6cd5\u540d\uff01");else try{Chat.SCRIPT[a]=eval(b),Console.log("\u6ce8\u518c\u65b9\u6cd5["+a+"]\u6210\u529f")}catch(c){Console.log("\u6ce8\u518c\u65b9\u6cd5["+a+"]\u5931\u8d25\uff1a"+
c)}},checkMethod:function(){var a=0,b;for(b in Chat.SCRIPT)Console.log(++a+": "+b)},notify:function(a,b){ChatHelper.isNotify()?(new DesktopNotification(1,{url:ChatHelper.picsUrl.notify,title:a,body:b},ChatHelper.notifyDelay)).init():MsgTip.msg_corner(a,b,!0,ChatHelper.notifyDelay/1E3);Chat.play("msg")}}}();var t=new Ext.util.DelayedTask(function(){Mixky.wasoft.lib.chatroom();chatWindow&&chatWindow.alternate()});t.delay(ChatHelper.delay);
IM.regMethod("Portal.Notify",function(a){IM.notify("\u63d0 \u793a",a.msg)});
var ExitFun=function(){Ext.MessageBox.show({title:"\u9000\u51fa\u8b66\u544a",msg:"\u60a8\u7684\u5e10\u53f7\u5728\u53e6\u4e00\u5730\u70b9\u767b\u5f55\uff0c\u60a8\u88ab\u8feb\u4e0b\u7ebf\u3002<br><br>\u5982\u679c\u8fd9\u4e0d\u662f\u60a8\u672c\u4eba\u7684\u64cd\u4f5c\uff0c\u90a3\u4e48\u60a8\u7684\u5bc6\u7801\u5f88\u53ef\u80fd\u5df2\u7ecf\u6cc4\u9732\u3002\u5efa\u8bae\u60a8\u4fee\u6539\u5bc6\u7801\u3002",buttons:Ext.MessageBox.OK,icon:Ext.MessageBox.WARNING,fn:function(){window.location="login.do"}})};
IM.regMethod("Portal.Exit",ExitFun);

//=================================================================
//	�ļ�����atwasoft.app.onlineusers.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.onlineusers = function(){

	var store = new Ext.data.DirectStore({
		directFn : OrganizationDirect.onlineusers,
		paramOrder : ['params'],
		baseParams : {params:{}},
		remoteSort : false,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		fields : ["id","uname","ip"]
	});
	store.load();
	var btnExituser =  new Ext.Action({"text":"强制退出用户","handler":function(){
           var records = grid.getSelectedRecords();
		   if(records.length > 0){
		      var uname = records[0].get('uname');
		      Ext.MessageBox.confirm('操作提示', '您确定要强制退出'+uname+'用户吗？', function(btn){
                if(btn == 'yes'){
			         OrganizationDirect.delonlineusers(uname.toString(),function(result,e){
				   	       if (result&&result.success) {
				    	       Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
				               icon:Ext.Msg.INFO,width:250,closable:false});
				               store.reload();
				           }
				           else{
				               Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
				               icon:Ext.Msg.ERROR,width:250,closable:false});
				           }
				     });
                }
               }); 
		   }
		   else{
		       Ext.MessageBox.show({title:'提示',msg:"请选择需要操作的用户记录！",
		       modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.INFO,width:250,closable:false});
		   }
    }});
	
    var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
	var buttons = ['->','-',btnExituser,'-'];
	var contextmenus = [btnExituser];
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : false,
		lineBreak : false,
		cellSelect : true,
		autoExpandColumn : 'ip',
		sm : sm,
		columns: [new Ext.PagingRowNumberer(),									
				{"id":"uname","dataIndex":"uname","header":"用户名",width:120,"sortable":true},
			    {"id":"ip","dataIndex":"ip","header":"ip地址"}],
		store : store,
		//tbar : buttons,
		ddGroup : 'grid2tree',
		maskDisabled:true,
		loadMask: {msg:'正在装载数据...'},
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		 bbar: new Ext.PagingToolbar({
        	displayMsg : '在线用户共有{2} 人',
        	emptyMsg : '没有符合条件的数据',
        	pageSize: 2000000,
        	store: store,
            displayInfo: true
        }),
        viewConfig:{
			getRowClass: function(record, index) {
				    return 'wasoft-grid-cell-inner';
		    }
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
    win = new Ext.Window({
        title : '在线用户',
        width :minwidth,
        height :midheight,
        modal : true,
        maximizable : false,
		minimizable : false,
		resizable : false,
		constrain : true,
        manager : MixkyApp.desktop.getManager(),
		layout : 'fit',
        items : grid
    });
    win.show();
};
//=================================================================
//	�ļ�����atwasoft.app.sysstate.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.sysstate = function(){
	var state = {"name":"state","xtype":"hidden"};
	var onoffsj = {"xtype":"displayfield","anchor":"100%","name":"onoffsj","fieldLabel":"系统以已于[",labelSeparator:""};
	var sysfield = {"xtype":"displayfield","anchor":"100%","name":"sysfield","value":"] 开启"};
	var msg = {"xtype":"displayfield","anchor":"95%","name":"msg","value":"系统关闭后，所有在线用户将被强行退出，直到管理员用户重新开启系统方能登录！超级管理员能在系统关闭时登录系统，并能重新开启系统。"};
	
	var onlineuser =  new Ext.Button({"text":"在线用户","handler":Mixky.wasoft.lib.onlineusers});
	
    var btnoffsys =  new Ext.Button({"text":"关闭系统","handler":function(){
    	    Ext.MessageBox.show({title:'提示',wait:true,msg:"正在强退用户并关闭系统,请稍候...",
	        modal:true,icon:Ext.Msg.WARNING,width:300,closable:false});
    	    var item = {};
    	    item.state = form.getForm().findField('state').getValue();
    	    DesktopDirect.setOnOffSys(item,function(result,e){
				   if (result&&result.success) {
				    	Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
	                    icon:Ext.Msg.INFO,width:250,closable:false});
				    	
				    	form.getForm().load({
				    		success : function(f, a){
				    			var field = f.findField('state');
				    			if(field){
				    				var statevalue = field.getValue();
				    				if(statevalue == 0){
				    					btnoffsys.setText('关闭系统');
				    				}else{
				    					btnoffsys.setText('打开系统');
				    				}
				    			}
				    		}
				    	});
			       }
			       else{
			            Ext.MessageBox.show({title:'提示',msg:result.msg,modal:true,buttons:Ext.Msg.OK,
		                icon:Ext.Msg.ERROR,width:250,closable:false});
			       }
		    });
    }});
	    
    var form = new Ext.form.FormPanel({
        autoScroll : true,
		layout:'form',
		border : false,
		fileUpload : true,
		trackResetOnLoad : true,
		bodyStyle : "padding:10px;padding-top:50px;padding-left:20px;padding-right:15px;overflow-x:hidden",
		api : {
			load :DesktopDirect.getSysState,
		},
		items : [{"xtype":"fieldset","title":"系统状态",style:"padding-top:25px;",
			     "items":[{"layout":"column","border":false,
			    	 "items": [{"layout":"form","border":false,height:30,labelWidth : 70,"style":"padding-left:0px","items":onoffsj},
			    	           {"layout":"form","border":false,height:30,"columnWidth":0.2,labelWidth : 1,"style":"padding-left:0px","items":sysfield},
			    	           {"layout":"form","border":false,height:30,"style":"padding-left:10px","items":onlineuser},
			    	           {"layout":"form","border":false,height:30,"style":"padding-left:10px","items":btnoffsys},state]},
			              {border: false, height:80, html:'<p>&nbsp;</p><p>&nbsp;</p><a>系统关闭后，所有在线用户将被强行退出，直到管理员用户重新开启系统方能登录！管理员用户能在系统关闭时登录系统，并能重新开启系统。</a>'}
                 ]}]
	});
    
    win = new Ext.Window({
        title : '系统状态管理',
        width :minwidth,
        height :minheight,
        modal : true,
        maximizable : false,
		minimizable : false,
		resizable : false,
		constrain : true,
        manager : MixkyApp.desktop.getManager(),
		layout : 'fit',
        items : form
    });
    win.show();
    form.getForm().load({
		success : function(f, a){
			var field = f.findField('state');
			if(field){
				var statevalue = field.getValue();
				if(statevalue == 0){
					btnoffsys.setText('关闭系统');
				}else{
					btnoffsys.setText('打开系统');
				}
			}
		}
	});
    
};
//=================================================================
//	�ļ�����mixky.app.preferences.background.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.PreferencesBackground = function(){
	var store = new Ext.data.DirectStore({
		directFn : DesktopDirect.getWallpapers,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'path',
		fields:[
		    {name:'id', mapping:'id'},
		    {name:'thumbnail', mapping:'thumbnail'},
		    {name:'path', mapping:'path'},
		    {name:'delflag', mapping:'delflag'}
		]
	});
	var tpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
				'<div class="pref-view-thumb"><img src="{thumbnail}" title="{id}" /></div>',
			'<span>{shortName}</span></div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	);
	
	var view = new Ext.DataView({
		autoHeight:true,
    	anchor : '-20',
		emptyText : '没有可供选择的墙纸',
		itemSelector :'div.pref-view-thumb-wrap',
		loadingText : 'loading...',
		singleSelect : true,
		overClass : 'x-view-over',
		prepareData : function(data){
			data.shortName = Ext.util.Format.ellipsis(data.id, 17);
			return data;
		},
		store : store,
		tpl : tpl,
		contextMenu: new Ext.menu.Menu({items:[{
			text: '删除',
			iconCls : 'icon-common-delete',
			handler: function() {
				var record = view.getSelectedRecords()[0];
				DesktopDirect.deleteWallPaper(record.get('path'), record.get('thumbnail'), function(result, e) {
					if(result && result.success) {
						store.reload();
					} else {
						Ext.Msg.alert('信息提示', '删除失败！');
					}
				});
			}
		}]}),
		listeners:{
			contextmenu:function(view, index, node, e){
				var record = view.store.getAt(index);
				if (record.get('delflag') == true) {
					view.select(node);
					this.contextMenu.showAt(e.getXY());
				}
			}
		}
	});
	view.on('dblclick', function(v, index, node, e){
		var record = v.store.getAt(index);
		if(record && record.get('path')){
			MixkyApp.setWallpaper(record.get('path'));
		}
	});
	store.on('load', function(s, records){
		if(records){
			var t = MixkyApp.userConfig.wallpaper;
			if(t){
				view.select(t);
			}
		}
	}, this);

	var wpTile = new Ext.form.Radio({
		checked : MixkyApp.userConfig.wallpaperposition == 'tile',
		name : 'wallpaperposition',
		boxLabel : '平铺方式',
		x : 15,
		y : 90
	});
	wpTile.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.wallpaperposition = 'tile';
		}
	});
	var wpCenter = new Ext.form.Radio({
		checked : MixkyApp.userConfig.wallpaperposition == 'center',
		name : 'wallpaperposition',
		boxLabel : '居中显示',
		x: 110,
		y: 90
	});
	wpCenter.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.wallpaperposition = 'center';
		}
	});
	
	var transparencySlider = new Ext.Slider({
		minValue : 0, 
		maxValue : 100, 
		width : 100, 
		value : MixkyApp.userConfig.transparency,
		x : 200, 
		y : 40
	});

	var transparencyField =  new Ext.form.NumberField({
		cls : 'x-field-percent', 
		enableKeyEvents : true, 
		maxValue : 100, 
		minValue : 0, 
		width : 45, 
		value : MixkyApp.userConfig.transparency,
		x : 200, 
		y : 70
	});

	var transparencyUpdateHandler = new Ext.util.DelayedTask(MixkyApp.setTransparency, MixkyApp);
	
	function transparencyHandler(){
		var v = transparencySlider.getValue();
		transparencyField.setValue(v);
		transparencyUpdateHandler.delay(100, null, null, [v]); // delayed task prevents IE bog
	}
	
	transparencySlider.on({
		'change': transparencyHandler, 
		'drag': transparencyHandler
	});
	
	transparencyField.on({
		'keyup': {
			fn: function(field){
				var v = field.getValue();
				if(v !== '' && !isNaN(v) && v >= field.minValue && v <= field.maxValue){
					transparencySlider.setValue(v);
				}
			}, 
			buffer: 350
		}
	});
	

    function onChangeBackgroundColor(){
    	var dialog = new Ext.ux.ColorDialog({
			border: false, 
			closeAction: 'close', 
			listeners: {
				'select': { fn: onBackgroundColorSelect, scope: this, buffer: 350 }
			}, 
			resizable: false, 
			title: 'Color Picker'
		});
		dialog.show(MixkyApp.userConfig.backgroundcolor);
    }
    
    function onBackgroundColorSelect(p, hex){
    	MixkyApp.setBackgroundColor(hex);
	}
	
	function onChangeFrontColor(){
    	var dialog = new Ext.ux.ColorDialog({
			border: false, 
			closeAction: 'close', 
			listeners: {
				'select': { fn: onFrontColorSelect, scope: this, buffer: 350 }
			}, 
			resizable: false, 
			title: 'Color Picker'
		});
		dialog.show(MixkyApp.userConfig.frontcolor);
    }
	
	function onFrontColorSelect(p, hex){
		MixkyApp.setFrontColor(hex);
	}
	
	var formPanel = new Ext.FormPanel({
		border : false,
		height : 140,
		layout : 'absolute',
		items : [{
			border: false,
			items: {border: false, html:'选择墙纸显示方式：'},
			x: 15,
			y: 15
		},{
			border: false,
			items: {border: false, html: '<img border=0 src="resources/images/portal/wallpaper-tile.png" width="64" height="44" border="0" alt="" />'},
			x: 15,
			y: 40
		}, wpTile,{
			border: false,
			items: {border: false, html: '<img border=0 src="resources/images/portal/wallpaper-center.png" width="64" height="44" border="0" alt="" />'},
			x: 110,
			y: 40
		}, wpCenter/*, {
			border: false,
			items: {border: false, html:'设置任务栏透明度：'},
			x: 200,
			y: 15
		}, transparencySlider, transparencyField*/, {
			border: false,
			items: {border: false, html:'设置颜色：'},
			x: 260,
			y: 15
		}, new Ext.Button({
			handler : onChangeFrontColor,
			text : '设置前景色',
			x : 260,
			width : 100,
			y : 50
		}), new Ext.Button({
			handler: onChangeBackgroundColor,
			text : '设置背景色',
			width : 100,
			x : 260,
			y : 80
		}), new Ext.Button({
			handler: function() {
				var dialog = new Ext.ux.UploadDialog.Dialog({
					url: 'servlet/wallpaper.img.upload',
					modal : true,
					reset_on_hide : false,
					allow_close_on_upload : true,
					upload_autostart : true,
					post_var_name : 'upload'
				});
				dialog.on('uploadsuccess', function(){
					store.reload();					
				});
				dialog.show();					
			},
			text : '上传背景图片',
			width : 100,
			x : 330,
			y : 110
		})]
	});

	var panel = new Ext.Panel({
		title : '背景设置',
        iconCls : 'icon-sys-background',
        padding : '5px',
        items : [{
        	xtype : 'panel',
			autoScroll: true,
        	height : 250,
        	layout : 'anchor',
			bodyStyle : 'padding:10px',
			border : true,
        	items : view
        }, formPanel]
	});
	
	store.load();
	return panel;
};
//=================================================================
//	�ļ�����mixky.app.preferences.desktop.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.PreferencesDesktop = function(){
	
	var uiWindow = new Ext.form.Radio({
		boxLabel : 'Window模式',
		anchor : '60%',
		checked : MixkyApp.userConfig.uimode == 'window',
		name : 'uimodel'
	});
	uiWindow.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.uimode = 'window';
		}
	});
	var uiWebPage = new Ext.form.Radio({
		boxLabel : '桌面操作模式',
		anchor : '40%',
		checked : MixkyApp.userConfig.uimode == 'webpage',
		name : 'uimodel'
	});
	uiWebPage.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.uimode = 'webpage';
		}
	});
	var desktopColumns2 = new Ext.form.Radio({
		boxLabel : '2栏',
		checked : MixkyApp.userConfig.columns == 2,
		name : 'columns'
	});
	desktopColumns2.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 2;
		}
	});
	var desktopColumns3 = new Ext.form.Radio({
		boxLabel : '3栏',
		checked : MixkyApp.userConfig.columns != 2 && MixkyApp.userConfig.columns != 4,
		name : 'columns'
	});
	desktopColumns3.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 3;
		}
	});
	var desktopColumns4 = new Ext.form.Radio({
		boxLabel : '4栏',
		checked : MixkyApp.userConfig.columns == 4,
		name : 'columns'
	});
	desktopColumns4.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 4;
		}
	});
	
	var store = new Ext.data.DirectStore({
		directFn : DesktopDirect.getDesktopStyles,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'path',
		fields:[
		    {name:'id', mapping:'id'},
		    {name:'thumbnail', mapping:'thumbnail'},
		    {name:'path', mapping:'path'}
		]
	});
	var tpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
				'<div class="pref-view-thumb"><img src="{thumbnail}" title="{id}" /></div>',
			'<span>{shortName}</span></div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	);
	var view = new Ext.DataView({
		autoHeight:true,
    	anchor : '-20',
		emptyText : '没有可供选择的样式',
		itemSelector :'div.pref-view-thumb-wrap',
		loadingText : 'loading...',
		singleSelect : true,
		overClass : 'x-view-over',
		prepareData : function(data){
			data.shortName = Ext.util.Format.ellipsis(data.id, 17);
			return data;
		},
		store : store,
		tpl : tpl
	});
	view.on('selectionchange', function(v, sel){
		if(sel.length > 0){
			var record = v.getRecord(sel[0]);
			if(record && record.get('path')){
				MixkyApp.setTheme(record.get('path'));
			}
		}
	});
	store.on('load', function(s, records){
		if(records){
			var t = MixkyApp.userConfig.theme;
			if(t){
				view.select(t);
			}
		}				
	}, this);
	var panel = new Ext.Panel({
		title : '界面设置',
        iconCls : 'icon-sys-desktopui',
        padding : '5px',
        items : [{
        	xtype : 'fieldset',
        	title : '设置桌面栏目最大列数（需刷新门户页面）',
        	items : [{
        		layout:'column',
        		border : false,
        		items : [{
        			columnWidth:.5,
            		border : false,
        			layout: 'form',
        			items : {
                		hideLabel : true,
                		xtype : 'radiogroup',
                        items : [desktopColumns2, desktopColumns3, desktopColumns4]
                	}
        		}]
        	}]
        }, {
        	xtype : 'panel',
			autoScroll : true,
        	height : 280,
        	layout : 'anchor',
			bodyStyle : 'padding:10px',
			border : true,
        	items : view
        }]
	});
	store.load();
	return panel;
};
//=================================================================
//	�ļ�����mixky.app.preferences.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.Preferences = function(){
	var desktop = Mixky.wasoft.lib.PreferencesDesktop();
	var background = Mixky.wasoft.lib.PreferencesBackground();
	var shortcuts = Mixky.wasoft.lib.PreferencesShortcuts();
	var quickstarts = Mixky.wasoft.lib.PreferencesQuickStarts();
	var subjects = Mixky.wasoft.lib.PreferencesSubjects();
    win = new Ext.Window({
        title : '应用参数定制',
        width :500,
        height :500,
        iconCls : 'icon-portal-preference',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        constrain : true,
        modal : true,
		layout : 'fit',
        items : [{
        	xtype : 'tabpanel',
            activeTab : 0,
            border :false,
            defaults: {
        		autoScroll:true
        	},
            items : [
                desktop,
                background,
              //  shortcuts,
               // quickstarts,
                subjects
            ]
        }],
        buttons : [{
        	text : '保存设置',
            iconCls : 'icon-common-save',
            handler : function(){
        		Mixky.wasoft.lib.actions.SavePreferences.execute();
    		}
        },{
        	text : '关闭',
            iconCls : 'icon-common-cancel',
            handler : function(){
    			win.close();
    		}
        }]
    });
    win.show();
};
//=================================================================
//	�ļ�����mixky.app.preferences.quickstarts.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.PreferencesQuickStarts = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopDirect.getQuickStarts,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasQuickStart(child.attributes.btntype, child.attributes.applicationkey, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				},
				'beforeload' : function(loader, node){
					var key = node.attributes.key;
					if(Ext.isDefined(key)){
						try{
							var app = Mixky.wasoft.cache.Applications[key];
							var fn = eval(app.keyPrefix + 'AppDirect.getQuickStarts');
							if(typeof(fn) != 'function'){
								return false;
								alert(app.keyPrefix + 'AppDirect.getQuickStarts is not a function');
							}
							loader.directFn = fn;
						}catch(e){
							alert('no found ' + key + 'AppDirect.getQuickStarts function');
							return false;
						}
					}else{
						loader.directFn = DesktopDirect.getQuickStarts;
					}
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasQuickStart(node.attributes.btntype, node.attributes.applicationkey, node.attributes.key)){
							MixkyApp.addQuickStart({
								text : node.attributes.text, 
								iconCls : node.attributes.iconCls, 
								btntype : node.attributes.btntype, 
								applicationkey : node.attributes.applicationkey,
								key : node.attributes.key
							});
						}
		    		}else{
		    			MixkyApp.removeQuickStart(node.attributes.btntype, node.attributes.applicationkey, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '快捷菜单'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择快捷菜单'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '快捷菜单',
        padding : '5px',
		border : false,
        iconCls : 'icon-portal-quickstart',
		items : [tree, note]
	});
	
	return panel;
};
//=================================================================
//	�ļ�����mixky.app.preferences.shortcuts.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.PreferencesShortcuts = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopDirect.getShortcuts,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasShortcut(child.attributes.btntype, child.attributes.applicationkey, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				},
				'beforeload' : function(loader, node){
					var key = node.attributes.key;
					if(Ext.isDefined(key)){
						try{
							var app = Mixky.wasoft.cache.Applications[key];
							var fn = eval(app.keyPrefix + 'AppDirect.getQuickStarts');
							if(typeof(fn) != 'function'){
								return false;
								alert(app.keyPrefix + 'AppDirect.getQuickStarts is not a function');
							}
							loader.directFn = fn;
						}catch(e){
							alert('no found ' + key + 'AppDirect.getQuickStarts function');
							return false;
						}
					}else{
						loader.directFn = DesktopDirect.getQuickStarts;
					}
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasShortcut(node.attributes.btntype, node.attributes.applicationkey, node.attributes.key)){
							MixkyApp.addShortcut({
								text : node.attributes.text, 
								iconCls : node.attributes.iconCls, 
								btntype : node.attributes.btntype, 
								applicationkey : node.attributes.applicationkey,
								key : node.attributes.key
							});
						}
		    		}else{
		    			MixkyApp.removeShortcut(node.attributes.btntype, node.attributes.applicationkey, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面按钮'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面按钮'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面按钮',
        padding : '5px',
		border : false,
        iconCls : 'icon-portal-shortcut',
		items : [tree, note]
	})
	
	return panel;
}
//=================================================================
//	�ļ�����mixky.app.preferences.subjects.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.PreferencesSubjects = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopDirect.getSubjects,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasSubject(child.attributes.applicationkey, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				},
				'beforeload' : function(loader, node){
					var key = node.attributes.key;
					if(Ext.isDefined(key)){
						try{
							var app = Mixky.wasoft.cache.Applications[key];
							var fn = eval(app.keyPrefix + 'AppDirect.getSubjects');
							if(typeof(fn) != 'function'){
								return false;
								alert(app.keyPrefix + 'AppDirect.getSubjects is not a function');
							}
							loader.directFn = fn;
						}catch(e){
							alert('no found ' + key + 'AppDirect.getSubjects function');
							return false;
						}
					}else{
						loader.directFn = DesktopDirect.getSubjects;
					}
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasSubject(node.attributes.applicationkey, node.attributes.key)){
							MixkyApp.addSubject({
								applicationkey : node.attributes.applicationkey,
								key : node.attributes.key,
								text : node.attributes.text,
								iconCls : node.attributes.iconCls,
								width : 300,
								height : 300,
								webheight :300,
								left : 100,
								top : 50
							});
						}
		    		}else{
		    			MixkyApp.removeSubject(node.attributes.applicationkey, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面栏目'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面栏目'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面栏目',
        padding : '5px',
		border : false,
        iconCls : 'icon-portal-subject',
		items : [tree, note]
	})
	
	return panel;
}
//=================================================================
//	�ļ�����mixky.js.loader.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.LoadJsFile = function(id, url){
    var js = document.getElementById(id);
    if(!js){
        js = document.createElement('script');
        js.id = id;
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        document.getElementsByTagName("head")[0].appendChild(js);
    }
};
//=================================================================
//	�ļ�����mixky.validate.js
//=================================================================
Ext.form.ComboBox.prototype.validateValue = function(value){
    if(Ext.isFunction(this.validator)){
        var msg = this.validator(value);
        if(msg !== true){
            this.markInvalid(msg);
            return false;
        }
    }
    if(value.length < 1 || value === this.emptyText){ // if it's blank
         if(this.allowBlank){
             this.clearInvalid();
             return true;
         }else{
             this.markInvalid(this.blankText);
             return false;
         }
    }
    return true;
}

Cls.form.DateTimeField.prototype.validateValue = function(value){
    if(Ext.isFunction(this.validator)){
        var msg = this.validator(value);
        if(msg !== true){
            this.markInvalid(msg);
            return false;
        }
    }
    if(value.length < 1 || value === this.emptyText){ // if it's blank
         if(this.allowBlank){
             this.clearInvalid();
             return true;
         }else{
             this.markInvalid(this.blankText);
             return false;
         }
    }
    return true;
}
//=================================================================
//	�ļ�����mixky.wasoft.lib.changepassword.js
//=================================================================

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.ChangePassword = function(){
    var formPanel = new Ext.form.FormPanel({
		labelWidth: 100,
		frame:true,
		defaultType: 'textfield',
		bodyStyle : "padding:10px;padding-left:15px;padding-right:15px;padding-top:40px;overflow-x:hidden",
		items: [{
			xtype : 'textfield',
			fieldLabel: '原密码',
			name: 'srcpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false,
			labelStyle:"color:red",
			height:40
		},{
			xtype : 'textfield',
			fieldLabel: '新密码(必须是8至20位且包含字符和数字)',
			name: 'newpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false,
			labelStyle:"color:red",
			minLength : 8,
			minLengthText : '必须是8至20位且包含字符和数字',
			maxLength : 20,
			maskRe : new RegExp('[0-9 | A-Z | a-z]'),
			height:40
		},{
			xtype : 'textfield',
			fieldLabel: '新密码确认',
			name: 'newpassword2',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false,
			labelStyle:"color:red",
			height:40
		}]
	});
    
    win = new Ext.Window({
        title : '修改密码',
        width :480,
        height :320,
        iconCls : 'icon-portal-password',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        constrain : true,
        modal : true,
		layout : 'fit',
		manager : MixkyApp.desktop.getManager(),
        items : [
            formPanel
        ],
		buttons: [{
			text: '确认',
			handler: function(){
				var form = formPanel.getForm();
				if(form.isValid()){
					var srcpassword = form.findField('srcpassword').getValue();
					var newpassword = form.findField('newpassword').getValue();
					var newpassword2 = form.findField('newpassword2').getValue();
					
					if (/[0-9]+/.test(newpassword) && (/[a-z]+/.test(newpassword) || /[A-Z]+/.test(newpassword))) {
						if(newpassword == newpassword2){
							var notifyWin = MixkyApp.showWaitMessage("正在修改用户密码...");
							OrganizationDirect.changePassword(srcpassword, newpassword, function(result, e){
								if(result && result.success){
			        				notifyWin.setIconClass('x-icon-done');
			        				notifyWin.setTitle('完成');
			        				notifyWin.setMessage('用户密码修改完毕.');
									win.close();
								}else{
			        				notifyWin.setIconClass('x-icon-done');
			        				notifyWin.setTitle('错误');
			        				notifyWin.setMessage('用户密码修改失败.');
								}
								MixkyApp.hideNotification(notifyWin);
							});
						}else{
							MixkyApp.showErrorMessage("两次输入密码不一致");
						}
					}
     	     		else{
     	     			MixkyApp.showErrorMessage('输入的密码必须是8至20位且包含字符和数字！');;
     	     		}
				}
        	}
		},{
			text: '取消',
			handler: function(){
				win.close();
        	}
		}]
    });
    win.show();
    
    var npass = formPanel.getForm().findField('newpassword');
    
    if(Ext.isDefined(npass)){
    	npass.on('change', function(f,n,o){
 	     	var params = npass.getValue();
 	     	if(params.toString().trim() != ''){
     		   if (/[0-9]+/.test(params.toString().trim()) && 
     			   (/[a-z]+/.test(params.toString().trim()) || 
     			   /[A-Z]+/.test(params.toString().trim()))) {
 	   		   }
     		   else{
				   Ext.MessageBox.show({title:'提示',msg:"'输入的密码必须含字符和数字，请重新输入！",modal:true,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING,
				   width:350,closable:false,fn:function(){npass.setValue('');npass.focus(false,10);}});
     		   }	
 	        }
 	   }); 
 	}
}
//=================================================================
//	�ļ�����mixky.wasoft.lib.organization.window.js
//=================================================================
/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.wasoft.lib");

Mixky.wasoft.lib.getOrganizationWindow = function(config, value, fn){
	
	config = Ext.apply({
	    selectMulti : true,
	    selectType : 'mix',
	    valueField : 'expression',
	    displayField : 'f_caption',
	    valueSeparator : ';'
	}, config);
	
	if(!Mixky.wasoft.lib.OrganizationWindow){
		var tree = new Ext.tree.TreePanel({
			region : 'center',
	    	autoScroll:true,
	    	rootVisible :false,
	    	root: {
				nodeType: 'async',
	            text: '人员选择',
	            id : 'root-organization'
	        },
	        loader: new Ext.tree.TreeLoader({
	            directFn: OrganizationDirect.getOrganizationTree1,
	            paramOrder : ['type'],
	        	baseParams : {type:'mix'},
	        	preloadChildren : true
	        }),
	        tools:[{
	        	id : 'maximize',
	        	qtip : '展开节点',
	        	handler : function(){
	        		tree.expandAll();
		        }
	        },{
	        	id : 'minimize',
	        	qtip : '收合节点',
	        	handler : function(){
		        	tree.collapseAll();
		        }
	        },{
	        	id:'refresh',
	        	handler:function(){
		        	tree.refresh();
		        }
	        }],
			refresh:function(){
	        	this.getRootNode().reload();
	        }
		});
		// 用户列表框
		var grid = new Ext.grid.GridPanel({
			region : 'east',
	        width: 350,
	        minSize: 200,
	        maxSize: 400,
	        split:true,
			autoExpandColumn:'f_note',
			enableHdMenu:false,
			enableColumnMove:false,
			store : new Ext.data.DirectStore({
				directFn : OrganizationDirect.getUserList1,
				paramOrder:['expression'],
				baseParams : {
					key : 'expression'
				},
				root : 'results',
				totalProperty : 'totals',
				idProperty : 'id',
				fields:[
				    {name:'id',mapping:'id'},
				    {name:'f_name',mapping:'f_name'},
				    {name:'f_caption',mapping:'f_caption'},
				    {name:'f_note',mapping:'f_note'},
				    {name:'expression',mapping:'expression'}
				]
			}),
			columns : [new Ext.grid.RowNumberer(),{
				id:'f_caption',
				dataIndex:'f_caption',
				width:80,
				header:'用户名'
			},{
				id:'f_name',
				dataIndex:'f_name',
				width:100,
				header:'登录名'
			},{
				id:'f_note',
				dataIndex:'f_note',
				header:'备注'
			}],
			// 装载用户列表
			loadExpression:function(expression){
				this.getStore().baseParams.expression = expression;
				this.getStore().reload();
			}
		});
		// 已选择组织结构对象框
		var selectedbox = new Ext.DataView({
			region : 'south',
	        split :true,
	        height : 80,
	        minSize : 50,
	        maxSize : 250,
	        style : 'background-color:white',
	        tpl:new Ext.XTemplate(
	        	'<tpl for=".">',
	                '<div class="user-expression-item icon-common-{type}" id="{expression}">{f_caption}</div>',
	            '</tpl>',
	            '<div class="x-clear"></div>'
	        ),
	        selectedClass:'x-user-expression-view-selected',
	        overClass:'x-user-expression-view-over',
	        itemSelector:'div.user-expression-item',
	        multiSelect: true,
	        plugins: [
	            new Ext.DataView.DragSelector()
	        ],
	        store : new Ext.data.JsonStore({
	        	idProperty: 'expression', 
	        	fields: ['expression', 'type', 'id', 'f_name', 'f_caption', 'f_note']
	        })
		});
		// 定义窗口
		var win = new Ext.Window({
			manager : MixkyApp.desktop.getManager(),
			title : '人员选择',
			iconCls : 'icon-common-organization',
	        modal: true,
			layout:'border',
			border : false,
	        buttonAlign:'center',
			height : 540,
			width : 660,
			maximizable : false,
			minimizable : false,
			constrain : true,
			closeAction : 'hide',
			defaults : {border:false},
			items:[tree, grid, selectedbox],
	        buttons: [{
	            text: '确定',
	            iconCls:'icon-common-confirm',
	            handler: function() {
					var records = selectedbox.getStore().getRange();
					var values = '', display = '';
					if(win.selectMulti && win.valueSeparator == ''){
						values = [];
					}
					var display = '';
					for(var i=0;i<records.length;i++){
						display = display + records[i].get(win.displayField) + ';';
						if(win.selectMulti && win.valueSeparator == ''){
							values.push(records[i].get(win.valueField));
						}else{
							values = values + records[i].get(win.valueField) + win.valueSeparator;
						}
					}
					win.onSelectedFn(display, values, records);
		    		win.hide();
	        	}
	        },{
	            text: '取消',
	            iconCls:'icon-common-cancel',
	            handler: function() {
	        		win.hide();
	        	}
	        }]
		});
		// 已选择框右键菜单
		selectedbox.contextMenu = new Ext.menu.Menu({items:[{
			text:'移除选择',
			iconCls:'icon-common-delete',
			handler:function(){
				selectedbox.removeSelected();
			}
		}]});
        // 选中表达式
		selectedbox.selectExpression = function(expression){
			// 判断多选
			if(!win.selectMulti && selectedbox.getStore().getCount() > 0){
				return;
			}
			// 服务器端解析表达式
			OrganizationDirect.getExpressionData(expression, win.selectType, function(result,e){
				// 添加
				for(var i=0;i<result.results.length;i++){
					var exp = result.results[i];
					var record = selectedbox.getStore().getById(exp.expression);
					if(!record){
						selectedbox.getStore().loadData([result.results[i]], true);
					}
				}
			});
		};
		// 初始化已经选中的值
		selectedbox.loadSelectedExpressions = function(usersexpression){
			selectedbox.clearSelected();
			if(Ext.isDefined(usersexpression) && usersexpression != ''){
				var values = '';
				if(typeof usersexpression == 'string'){
					usersexpression = usersexpression.split(win.valueSeparator);
				}
				for(var i=0;i<usersexpression.length;i++){
					if(!usersexpression[i]){
						continue;
					}
					values = values + usersexpression[i] + ';';
				}
				if(values && values != ''){
					OrganizationDirect.loadSelectedExpressions(win.valueField, values, function(result, e){
						if(result){
							selectedbox.getStore().loadData(result.results, true);
						}
					});
				}
			}
		};
		// 清空选中的用户
		selectedbox.clearSelected = function(){
			selectedbox.getStore().removeAll();
		};
		// 删除选中的用户
		selectedbox.removeSelected = function(){
			var records = selectedbox.getSelectedRecords();
			for(var i=0;i<records.length;i++){
				selectedbox.getStore().remove(records[i]);
			}
		};
		// 选中组织结构树
		tree.getSelectionModel().on('selectionchange', function(sm, node){
			if(!node){
				return;
			}
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			grid.loadExpression(expression);
		});
		// 双击组织结构树
		tree.on('dblclick', function(node, e){
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			if(!this.selectMulti && this.selectType == 'user'){
				return;
			}else{
				selectedbox.selectExpression(expression);
			}
		});
		// 双击用户列表
		grid.on('rowdblclick', function(g, index, e){
			var u = g.getSelectionModel().getSelected();
			selectedbox.selectExpression(u.get('expression'));
		});
		// 双击用户列表
		selectedbox.on('dblclick', function(dv, index, e){
			selectedbox.removeSelected();
		});
		// 双击用户列表
		selectedbox.on('contextmenu', function(dv, index, node, e){
			dv.contextMenu.showAt(e.getXY());
		});
		win.initConfigration = function(config, value, fn){
			// 装载树结构
    		if(config.selectType != tree.getLoader().baseParams.type){
				tree.getLoader().baseParams.type = config.selectType;
				tree.refresh();
    		}
    		// 应用参数
		    Ext.apply(this, config);
			// 设置显示模式
			switch(this.selectType){
			case 'user':
			case 'mix':
				grid.setVisible(true);
				break;
			case 'department':
			case 'role':
				grid.setVisible(false);
				break;
			}
			win.onSelectedFn = fn;
			// 装载初始值
			selectedbox.loadSelectedExpressions(value);
			
		};
		Mixky.wasoft.lib.OrganizationWindow = win;
	}
	Mixky.wasoft.lib.OrganizationWindow.initConfigration(config, value, fn);
	return Mixky.wasoft.lib.OrganizationWindow;
};