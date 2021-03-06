package com.pallasli.bpm.service.query;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration("classpath:activitiContext.xml")
public class BpmServiceTest {

	@Autowired
	private ModelService modelService;
	@Autowired
	private ProcessDefinitionService defineService;

	@Test
	public void createProcessDefinition() {
		// String id = bpmService.createProcessDefinition("key", "name",
		// "category", "description");
		// Assert.assertEquals("1062501", id);
	}

	@SuppressWarnings("deprecation")
	@Test
	@Ignore
	public void saveProcessDefinition() {
		String source0 = modelService.getEditorSource("1062501");
		System.out.println(source0);
		Assert.assertTrue(source0.trim().endsWith("{}"));

		ObjectMapper objectMapper = new ObjectMapper();
		ObjectNode editorNode = objectMapper.createObjectNode();
		editorNode.put("id", "canvas");
		editorNode.put("resourceId", "canvas");

		ObjectNode stencilSetNode = objectMapper.createObjectNode();
		stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
		editorNode.put("stencilset", stencilSetNode);
		String id = defineService.saveProcessDefinition("1062501", "key", "new_name", "category", "description",
				editorNode);

		String source = modelService.getEditorSource("1062501");
		System.out.println(source);
		Assert.assertTrue(source.length() > 10);
		Assert.assertEquals("", id);

	}

	@Test
	public void deleteProcessDefinition() {

	}

	@Test
	public void deployProcess() {

	}

	@Test
	public void importProcess() {

	}

	@Test
	public void exportProcess() {

	}

	@Test
	public void unDeployProcess() {

	}

	@Test
	public void startProcessInstance() {

	}

	@Test
	public void stopEngine() {

	}

	@Test
	public void completeTask() {

	}

	@Test
	public void findTaskInfos() {

	}

}
