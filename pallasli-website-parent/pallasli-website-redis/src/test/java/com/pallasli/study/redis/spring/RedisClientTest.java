package com.pallasli.study.redis.spring;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.pallasli.study.cache.redis.spring.User;
import com.pallasli.study.cache.redis.spring.UserDAO;

public class RedisClientTest {

	@Test
	public void test() {

		ApplicationContext ac = new ClassPathXmlApplicationContext("classpath:/redis/springContext.xml");
		UserDAO userDAO = (UserDAO) ac.getBean("userDAO");
		User user1 = new User();
		user1.setId(1);
		user1.setName("obama");
		userDAO.saveUser(user1);
		User user2 = userDAO.getUser(1);
		System.out.println(user2.getName());

	}

}
