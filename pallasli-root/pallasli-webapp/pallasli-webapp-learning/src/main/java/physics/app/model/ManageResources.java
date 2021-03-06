package physics.app.model;

import com.lyt.pallas.jdbc.model.Entity;

public class ManageResources extends Entity {
	private static final long serialVersionUID = 1L;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private Long id;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.ENGLISH_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private String englishName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private String chineseName;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private String description;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.PARENT_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private Long parentId;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.ENABLED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private String enabled;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.TYPE_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private Long typeId;

	/**
	 * This field was generated by Apache iBATIS Ibator. This field corresponds
	 * to the database column MANAGE_RESOURCES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	private String used;

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.ID
	 * 
	 * @return the value of MANAGE_RESOURCES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public Long getId() {
		return id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.ID
	 * 
	 * @param id
	 *            the value for MANAGE_RESOURCES.ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.ENGLISH_NAME
	 * 
	 * @return the value of MANAGE_RESOURCES.ENGLISH_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public String getEnglishName() {
		return englishName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.ENGLISH_NAME
	 * 
	 * @param englishName
	 *            the value for MANAGE_RESOURCES.ENGLISH_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setEnglishName(String englishName) {
		this.englishName = englishName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.CHINESE_NAME
	 * 
	 * @return the value of MANAGE_RESOURCES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public String getChineseName() {
		return chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.CHINESE_NAME
	 * 
	 * @param chineseName
	 *            the value for MANAGE_RESOURCES.CHINESE_NAME
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setChineseName(String chineseName) {
		this.chineseName = chineseName;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.DESCRIPTION
	 * 
	 * @return the value of MANAGE_RESOURCES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.DESCRIPTION
	 * 
	 * @param description
	 *            the value for MANAGE_RESOURCES.DESCRIPTION
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.PARENT_ID
	 * 
	 * @return the value of MANAGE_RESOURCES.PARENT_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public Long getParentId() {
		return parentId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.PARENT_ID
	 * 
	 * @param parentId
	 *            the value for MANAGE_RESOURCES.PARENT_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.ENABLED
	 * 
	 * @return the value of MANAGE_RESOURCES.ENABLED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public String getEnabled() {
		return enabled;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.ENABLED
	 * 
	 * @param enabled
	 *            the value for MANAGE_RESOURCES.ENABLED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setEnabled(String enabled) {
		this.enabled = enabled;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.TYPE_ID
	 * 
	 * @return the value of MANAGE_RESOURCES.TYPE_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public Long getTypeId() {
		return typeId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.TYPE_ID
	 * 
	 * @param typeId
	 *            the value for MANAGE_RESOURCES.TYPE_ID
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method returns
	 * the value of the database column MANAGE_RESOURCES.USED
	 * 
	 * @return the value of MANAGE_RESOURCES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public String getUsed() {
		return used;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method sets the
	 * value of the database column MANAGE_RESOURCES.USED
	 * 
	 * @param used
	 *            the value for MANAGE_RESOURCES.USED
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	public void setUsed(String used) {
		this.used = used;
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table MANAGE_RESOURCES
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	
	public boolean equals(Object that) {
		if (this == that) {
			return true;
		}
		if (!(that instanceof ManageResources)) {
			return false;
		}
		ManageResources other = (ManageResources) that;
		return (this.getId() == null ? other.getId() == null : this.getId()
				.equals(other.getId()))
				&& (this.getEnglishName() == null ? other.getEnglishName() == null
						: this.getEnglishName().equals(other.getEnglishName()))
				&& (this.getChineseName() == null ? other.getChineseName() == null
						: this.getChineseName().equals(other.getChineseName()))
				&& (this.getDescription() == null ? other.getDescription() == null
						: this.getDescription().equals(other.getDescription()))
				&& (this.getParentId() == null ? other.getParentId() == null
						: this.getParentId().equals(other.getParentId()))
				&& (this.getEnabled() == null ? other.getEnabled() == null
						: this.getEnabled().equals(other.getEnabled()))
				&& (this.getTypeId() == null ? other.getTypeId() == null : this
						.getTypeId().equals(other.getTypeId()))
				&& (this.getUsed() == null ? other.getUsed() == null : this
						.getUsed().equals(other.getUsed()));
	}

	/**
	 * This method was generated by Apache iBATIS Ibator. This method
	 * corresponds to the database table MANAGE_RESOURCES
	 * 
	 * @ibatorgenerated Tue Jul 27 21:45:42 CST 2010
	 */
	
	public int hashCode() {
		int hash = 23;
		if (getId() != null) {
			hash *= getId().hashCode();
		}
		if (getEnglishName() != null) {
			hash *= getEnglishName().hashCode();
		}
		if (getChineseName() != null) {
			hash *= getChineseName().hashCode();
		}
		if (getDescription() != null) {
			hash *= getDescription().hashCode();
		}
		if (getParentId() != null) {
			hash *= getParentId().hashCode();
		}
		if (getEnabled() != null) {
			hash *= getEnabled().hashCode();
		}
		if (getTypeId() != null) {
			hash *= getTypeId().hashCode();
		}
		if (getUsed() != null) {
			hash *= getUsed().hashCode();
		}
		return hash;
	}
}