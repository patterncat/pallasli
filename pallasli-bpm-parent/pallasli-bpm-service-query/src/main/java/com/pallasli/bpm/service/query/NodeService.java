package com.pallasli.bpm.service.query;

import java.util.List;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import com.pallasli.bpm.entity.NodeInfo;

@WebService
public interface NodeService {

	/**
	 * 查询当前可执行的下一环节列表
	 * 
	 * @param user
	 *            用户名
	 * @param processKey
	 *            流程定义唯一标识
	 * @param instanceId
	 *            流程实例唯一标识
	 * @return
	 */
	@WebMethod
	public List<NodeInfo> getNextNodeList(@WebParam(name = "user") String user,
			@WebParam(name = "processKey") String processKey, @WebParam(name = "instanceId") String instanceId);

	/**
	 * 查询当前可回退的下一环节列表
	 * 
	 * @param user
	 *            用户名
	 * @param processKey
	 *            流程定义唯一标识
	 * @param instanceId
	 *            流程实例唯一标识
	 * @return
	 */
	@WebMethod
	public List<NodeInfo> getBackNodeList(@WebParam(name = "user") String user,
			@WebParam(name = "processKey") String processKey, @WebParam(name = "instanceId") String instanceId);
}
