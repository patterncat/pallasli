package com.pallasli.bpm.service.impl;

import java.util.Map;

import javax.jws.WebMethod;
import javax.jws.WebParam;

import com.pallasli.bpm.entity.InstanceInfo;
import com.pallasli.bpm.service.query.InstanceService;

public class InstanceServiceImpl implements InstanceService {
	/**
	 * 发起流程，得到流程信息
	 * 
	 * @param user
	 *            用户名
	 * @param processKey
	 *            流程定义唯一标识
	 * @param businessKey
	 *            业务主键
	 * @param variables
	 *            流程和业务变量
	 * @return
	 */
	@Override
	@WebMethod
	public InstanceInfo startProcessInstance(@WebParam(name = "user") String user,
			@WebParam(name = "processDefinitionKey") String processDefinitionKey,
			@WebParam(name = "businessKey") String businessKey,
			@WebParam(name = "variables") Map<String, Object> variables) {
		return null;

	}

	/**
	 * 查询流程实例信息
	 * 
	 * @param user
	 *            用户名
	 * @param processKey
	 *            流程定义唯一标识
	 * @param instanceId
	 *            流程实例唯一标识
	 * @return
	 */
	@Override
	@WebMethod
	public InstanceInfo openProcessInstance(@WebParam(name = "user") String user,
			@WebParam(name = "processKey") String processKey, @WebParam(name = "instanceId") String instanceId) {
		return null;
	}

	@Override
	public InstanceInfo suspendProcessInstance(String user, String processDefinitionKey, String businessKey,
			Map<String, Object> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public InstanceInfo activeProcessInstance(String user, String processDefinitionKey, String businessKey,
			Map<String, Object> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public InstanceInfo cancelProcessInstance(String user, String processDefinitionKey, String businessKey,
			Map<String, Object> variables) {
		// TODO Auto-generated method stub
		return null;
	}
}
