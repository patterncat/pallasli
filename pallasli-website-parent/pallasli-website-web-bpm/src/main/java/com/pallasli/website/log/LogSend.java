package com.pallasli.website.log;

import javax.annotation.Resource;

import org.springframework.jms.core.JmsTemplate;

import com.pallasli.website.logger.entity.LogInfo;

public class LogSend implements Runnable {
	@Resource(name = "jmsTemplate")
	private JmsTemplate jmsTemplate;
	private LogInfo log;

	public JmsTemplate getJmsTemplate() {
		return jmsTemplate;
	}

	public void setJmsTemplate(JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public LogInfo getLog() {
		return log;
	}

	public void setLog(LogInfo log) {
		this.log = log;
	}

	public void sendLog() {
		// 初始化log对象
		jmsTemplate.convertAndSend(log);
	}

	@Override
	public void run() {
		sendLog();

	}
}
