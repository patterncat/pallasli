package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class CelestialBodiesType extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column CELESTIAL_BODIES_TYPE.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	private Long id;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column CELESTIAL_BODIES_TYPE.TYPE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	private String typeName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column CELESTIAL_BODIES_TYPE.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	private String chineseName;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column CELESTIAL_BODIES_TYPE.ID
	 * 
	 * @return the value of CELESTIAL_BODIES_TYPE.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column CELESTIAL_BODIES_TYPE.ID
	 * 
	 * @param id
	 *            the value for CELESTIAL_BODIES_TYPE.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column CELESTIAL_BODIES_TYPE.TYPE_NAME
	 * 
	 * @return the value of CELESTIAL_BODIES_TYPE.TYPE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public String getTypeName() {
		return typeName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column CELESTIAL_BODIES_TYPE.TYPE_NAME
	 * 
	 * @param typeName
	 *            the value for CELESTIAL_BODIES_TYPE.TYPE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column CELESTIAL_BODIES_TYPE.CHINESE_NAME
	 * 
	 * @return the value of CELESTIAL_BODIES_TYPE.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public String getChineseName() {
		return chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column CELESTIAL_BODIES_TYPE.CHINESE_NAME
	 * 
	 * @param chineseName
	 *            the value for CELESTIAL_BODIES_TYPE.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table CELESTIAL_BODIES_TYPE
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof CelestialBodiesType)) {
			return false;
		}
		CelestialBodiesType other = (CelestialBodiesType) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()))
				&& (this.getTypeName() == null ? other.getTypeName() == null
						: this.getTypeName().equals(other.getTypeName()))
				&& (this.getChineseName() == null ? other.getChineseName() == null
						: this.getChineseName().equals(other.getChineseName()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table CELESTIAL_BODIES_TYPE
	 * 
	 * @ibatorgenerated Wed Jul 21 13:22:19 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		if (getTypeName() != null) {
			hash *= getTypeName().hashCode();
		}
		if (getChineseName() != null) {
			hash *= getChineseName().hashCode();
		}
		return hash;
	}
}