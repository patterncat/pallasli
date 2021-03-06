package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class RefUnitField extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column REF_UNIT_FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	private Long id;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column REF_UNIT_FIELD.UNIT_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	private Long unitId;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column REF_UNIT_FIELD.FIELD_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	private Long fieldId;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column REF_UNIT_FIELD.ID
	 * 
	 * @return the value of REF_UNIT_FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column REF_UNIT_FIELD.ID
	 * 
	 * @param id
	 *            the value for REF_UNIT_FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column REF_UNIT_FIELD.UNIT_ID
	 * 
	 * @return the value of REF_UNIT_FIELD.UNIT_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public Long getUnitId() {
		return unitId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column REF_UNIT_FIELD.UNIT_ID
	 * 
	 * @param unitId
	 *            the value for REF_UNIT_FIELD.UNIT_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public void setUnitId(Long unitId) {
		this.unitId = unitId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column REF_UNIT_FIELD.FIELD_ID
	 * 
	 * @return the value of REF_UNIT_FIELD.FIELD_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public Long getFieldId() {
		return fieldId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column REF_UNIT_FIELD.FIELD_ID
	 * 
	 * @param fieldId
	 *            the value for REF_UNIT_FIELD.FIELD_ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	public void setFieldId(Long fieldId) {
		this.fieldId = fieldId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table REF_UNIT_FIELD
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof RefUnitField)) {
			return false;
		}
		RefUnitField other = (RefUnitField) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()))
				&& (this.getUnitId() == null ? other.getUnitId() == null : this
						.getUnitId().equals(other.getUnitId()))
				&& (this.getFieldId() == null ? other.getFieldId() == null
						: this.getFieldId().equals(other.getFieldId()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table REF_UNIT_FIELD
	 * 
	 * @ibatorgenerated Wed Jul 21 13:40:23 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		if (getUnitId() != null) {
			hash *= getUnitId().hashCode();
		}
		if (getFieldId() != null) {
			hash *= getFieldId().hashCode();
		}
		return hash;
	}
}