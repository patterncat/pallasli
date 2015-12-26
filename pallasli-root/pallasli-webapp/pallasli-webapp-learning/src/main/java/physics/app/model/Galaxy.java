package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class Galaxy extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column GALAXY.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	private Long id;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column GALAXY.GALAXY_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	private String galaxyName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column GALAXY.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	private String chineseName;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column GALAXY.ID
	 * 
	 * @return the value of GALAXY.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column GALAXY.ID
	 * 
	 * @param id
	 *            the value for GALAXY.ID
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column GALAXY.GALAXY_NAME
	 * 
	 * @return the value of GALAXY.GALAXY_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public String getGalaxyName() {
		return galaxyName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column GALAXY.GALAXY_NAME
	 * 
	 * @param galaxyName
	 *            the value for GALAXY.GALAXY_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public void setGalaxyName(String galaxyName) {
		this.galaxyName = galaxyName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column GALAXY.CHINESE_NAME
	 * 
	 * @return the value of GALAXY.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public String getChineseName() {
		return chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column GALAXY.CHINESE_NAME
	 * 
	 * @param chineseName
	 *            the value for GALAXY.CHINESE_NAME
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table GALAXY
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof Galaxy)) {
			return false;
		}
		Galaxy other = (Galaxy) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()))
				&& (this.getGalaxyName() == null ? other.getGalaxyName() == null
						: this.getGalaxyName().equals(other.getGalaxyName()))
				&& (this.getChineseName() == null ? other.getChineseName() == null
						: this.getChineseName().equals(other.getChineseName()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table GALAXY
	 * 
	 * @ibatorgenerated Wed Jul 21 13:25:48 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		if (getGalaxyName() != null) {
			hash *= getGalaxyName().hashCode();
		}
		if (getChineseName() != null) {
			hash *= getChineseName().hashCode();
		}
		return hash;
	}
}