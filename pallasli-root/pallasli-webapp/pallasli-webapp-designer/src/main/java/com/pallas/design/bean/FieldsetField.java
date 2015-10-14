package com.pallas.design.bean;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;

/** @author Hibernate CodeGenerator */
public class FieldsetField implements Serializable {

	/** identifier field */
	private Long id;

	/** persistent field */
	private String projectName;

	/** persistent field */
	private String fieldsetName;

	/** persistent field */
	private String fieldName;

	/** nullable persistent field */
	private String fieldCaption;

	/** persistent field */
	private String compName;

	/** persistent field */
	private String dataTypeName;

	/** nullable persistent field */
	private Integer fieldLength;

	/** nullable persistent field */
	private Integer fieldPrecision;

	/** nullable persistent field */
	private Integer fieldAllowblank;

	/** nullable persistent field */
	private String fieldDefault;

	/** nullable persistent field */
	private Integer fieldOrder;

	/** nullable persistent field */
	private String fieldConfigs;

	/** persistent field */
	private int version;

	/** full constructor */
	public FieldsetField(Long id, String projectName, String fieldsetName,
			String fieldName, String fieldCaption, String compName,
			String dataTypeName, Integer fieldLength, Integer fieldPrecision,
			Integer fieldAllowblank, String fieldDefault, Integer fieldOrder,
			String fieldConfigs, int version) {
		this.id = id;
		this.projectName = projectName;
		this.fieldsetName = fieldsetName;
		this.fieldName = fieldName;
		this.fieldCaption = fieldCaption;
		this.compName = compName;
		this.dataTypeName = dataTypeName;
		this.fieldLength = fieldLength;
		this.fieldPrecision = fieldPrecision;
		this.fieldAllowblank = fieldAllowblank;
		this.fieldDefault = fieldDefault;
		this.fieldOrder = fieldOrder;
		this.fieldConfigs = fieldConfigs;
		this.version = version;
	}

	/** default constructor */
	public FieldsetField() {
	}

	/** minimal constructor */
	public FieldsetField(Long id, String projectName, String fieldsetName,
			String fieldName, String compName, String dataTypeName, int version) {
		this.id = id;
		this.projectName = projectName;
		this.fieldsetName = fieldsetName;
		this.fieldName = fieldName;
		this.compName = compName;
		this.dataTypeName = dataTypeName;
		this.version = version;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProjectName() {
		return this.projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getFieldsetName() {
		return this.fieldsetName;
	}

	public void setFieldsetName(String fieldsetName) {
		this.fieldsetName = fieldsetName;
	}

	public String getFieldName() {
		return this.fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getFieldCaption() {
		return this.fieldCaption;
	}

	public void setFieldCaption(String fieldCaption) {
		this.fieldCaption = fieldCaption;
	}

	public String getCompName() {
		return this.compName;
	}

	public void setCompName(String compName) {
		this.compName = compName;
	}

	public String getDataTypeName() {
		return this.dataTypeName;
	}

	public void setDataTypeName(String dataTypeName) {
		this.dataTypeName = dataTypeName;
	}

	public Integer getFieldLength() {
		return this.fieldLength;
	}

	public void setFieldLength(Integer fieldLength) {
		this.fieldLength = fieldLength;
	}

	public Integer getFieldPrecision() {
		return this.fieldPrecision;
	}

	public void setFieldPrecision(Integer fieldPrecision) {
		this.fieldPrecision = fieldPrecision;
	}

	public Integer getFieldAllowblank() {
		return this.fieldAllowblank;
	}

	public void setFieldAllowblank(Integer fieldAllowblank) {
		this.fieldAllowblank = fieldAllowblank;
	}

	public String getFieldDefault() {
		return this.fieldDefault;
	}

	public void setFieldDefault(String fieldDefault) {
		this.fieldDefault = fieldDefault;
	}

	public Integer getFieldOrder() {
		return this.fieldOrder;
	}

	public void setFieldOrder(Integer fieldOrder) {
		this.fieldOrder = fieldOrder;
	}

	public String getFieldConfigs() {
		return this.fieldConfigs;
	}

	public void setFieldConfigs(String fieldConfigs) {
		this.fieldConfigs = fieldConfigs;
	}

	public int getVersion() {
		return this.version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return new ToStringBuilder(this).append("id", getId()).toString();
	}

}
