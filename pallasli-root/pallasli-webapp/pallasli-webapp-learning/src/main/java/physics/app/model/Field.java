package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class Field extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:41:07 CST 2010
	 */
	private Long id;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column FIELD.ID
	 * 
	 * @return the value of FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:41:07 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column FIELD.ID
	 * 
	 * @param id
	 *            the value for FIELD.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:41:07 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table FIELD
	 * 
	 * @ibatorgenerated Wed Jul 21 13:41:07 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof Field)) {
			return false;
		}
		Field other = (Field) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table FIELD
	 * 
	 * @ibatorgenerated Wed Jul 21 13:41:07 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		return hash;
	}
}