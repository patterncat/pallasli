package com.pallasli.bpm.service.query;

import java.util.List;

import org.activiti.engine.history.HistoricTaskInstance;

public interface HistoryTaskQueryService {

	List<HistoricTaskInstance> listTaskByCandidateUser(String user);

	List<HistoricTaskInstance> listTaskByAuditUser(String user);

}
