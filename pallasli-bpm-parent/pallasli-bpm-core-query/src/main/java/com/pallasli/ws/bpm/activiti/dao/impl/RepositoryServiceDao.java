package com.pallasli.ws.bpm.activiti.dao.impl;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.impl.TaskServiceImpl;
import org.activiti.engine.repository.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pallasli.bpm.entity.ModelInfo;
import com.pallasli.bpm.exeption.BpmExecption;

@Transactional
public class RepositoryServiceDao {

	private static final Logger log = LoggerFactory.getLogger(RepositoryServiceDao.class);
	@Autowired
	private TaskServiceImpl taskService;
	@Autowired
	private RepositoryService repositoryService;

	// private static final String MODEL_ID = "modelId";
	private static final String MODEL_NAME = "name";
	private static final String MODEL_REVISION = "revision";
	private static final String MODEL_DESCRIPTION = "description";

	public String createProcessDefinition(String key, String name, String category, String description) {

		Model modelData = repositoryService.newModel();
		modelData.setName(name);
		modelData.setKey(key);
		modelData.setCategory(category);
		ObjectMapper objectMapper = new ObjectMapper();
		ObjectNode modelObjectNode = objectMapper.createObjectNode();
		modelObjectNode.put(MODEL_NAME, name);
		modelObjectNode.put(MODEL_REVISION, 1);
		if (description == null) {
			description = "";
		}
		modelObjectNode.put(MODEL_DESCRIPTION, description);
		modelData.setMetaInfo(modelObjectNode.toString());
		repositoryService.saveModel(modelData);
		return modelData.getId();
	}

	public String saveProcessDefinition(String modelId, String key, String name, String category, String description,
			JsonNode editorNode) {
		String errorMessage = "";

		try {

			Model modelData = repositoryService.getModel(modelId);
			modelData.setName(name);
			modelData.setKey(key);
			modelData.setCategory(category);
			ObjectMapper objectMapper = new ObjectMapper();
			ObjectNode modelObjectNode = objectMapper.createObjectNode();
			modelObjectNode.put(MODEL_NAME, name);
			modelObjectNode.put(MODEL_REVISION, 1);
			if (description == null) {
				description = "";
			}
			modelObjectNode.put(MODEL_DESCRIPTION, description);
			modelData.setMetaInfo(modelObjectNode.toString());

			repositoryService.saveModel(modelData);
			repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("utf-8"));

			String id = modelData.getId();

			return id;
		} catch (Exception e) {
			errorMessage = "流程新建出错";
			log.error(errorMessage, e);
			throw new BpmExecption(errorMessage);
		}
	}

	public boolean deleteProcessModel(String modelId) {
		return false;
	}

	public String copyProcessModel(String name, String description, String modelId) {
		return null;
	}

	public boolean importProcessModelInfo(ModelInfo modelXMLInfo, boolean isOverride) {
		return false;
	}

	public ModelInfo exportProcessModelInfo(String modelId) {
		return null;
	}

	public boolean unDeployProcessModel(String modelId) {
		return false;
	}

	public Model getProcessDefinition(String modelId) {
		return repositoryService.getModel(modelId);
	}

	public byte[] getEditorSource(String modelId) {
		return repositoryService.getModelEditorSource(modelId);
	}
}
