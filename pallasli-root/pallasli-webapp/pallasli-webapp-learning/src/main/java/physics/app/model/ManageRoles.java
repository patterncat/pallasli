package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class ManageRoles extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_ROLES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	private Long id;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_ROLES.ROLE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	private String roleName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_ROLES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	private String chineseName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_ROLES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	private String description;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_ROLES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	private String used;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_ROLES.ID
	 * 
	 * @return the value of MANAGE_ROLES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_ROLES.ID
	 * 
	 * @param id
	 *            the value for MANAGE_ROLES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_ROLES.ROLE_NAME
	 * 
	 * @return the value of MANAGE_ROLES.ROLE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public String getRoleName() {
		return roleName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_ROLES.ROLE_NAME
	 * 
	 * @param roleName
	 *            the value for MANAGE_ROLES.ROLE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_ROLES.CHINESE_NAME
	 * 
	 * @return the value of MANAGE_ROLES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public String getChineseName() {
		return chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_ROLES.CHINESE_NAME
	 * 
	 * @param chineseName
	 *            the value for MANAGE_ROLES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_ROLES.DESCRIPTION
	 * 
	 * @return the value of MANAGE_ROLES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_ROLES.DESCRIPTION
	 * 
	 * @param description
	 *            the value for MANAGE_ROLES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_ROLES.USED
	 * 
	 * @return the value of MANAGE_ROLES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public String getUsed() {
		return used;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_ROLES.USED
	 * 
	 * @param used
	 *            the value for MANAGE_ROLES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	public void setUsed(String used) {
		this.used = used;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table MANAGE_ROLES
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof ManageRoles)) {
			return false;
		}
		ManageRoles other = (ManageRoles) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()))
				&& (this.getRoleName() == null ? other.getRoleName() == null
						: this.getRoleName().equals(other.getRoleName()))
				&& (this.getChineseName() == null ? other.getChineseName() == null
						: this.getChineseName().equals(other.getChineseName()))
				&& (this.getDescription() == null ? other.getDescription() == null
						: this.getDescription().equals(other.getDescription()))
				&& (this.getUsed() == null ? other.getUsed() == null : this
						.getUsed().equals(other.getUsed()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table MANAGE_ROLES
	 * 
	 * @ibatorgenerated Tue Jul 27 21:50:53 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		if (getRoleName() != null) {
			hash *= getRoleName().hashCode();
		}
		if (getChineseName() != null) {
			hash *= getChineseName().hashCode();
		}
		if (getDescription() != null) {
			hash *= getDescription().hashCode();
		}
		if (getUsed() != null) {
			hash *= getUsed().hashCode();
		}
		return hash;
	}
}