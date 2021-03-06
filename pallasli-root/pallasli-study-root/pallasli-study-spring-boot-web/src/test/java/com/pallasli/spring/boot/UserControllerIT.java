package com.pallasli.spring.boot;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;

import java.net.URL;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.pallasli.bean.demo.User;

//@RunWith(SpringJUnit4ClassRunner.class)
//@SpringApplicationConfiguration(classes = Application.class)
//@WebAppConfiguration
//@IntegrationTest({ "server.port=9000" })
public class UserControllerIT {
	@Value("${local.server.port}")
	private int port;

	private URL base;
	private RestTemplate template;

	@Before
	public void setUp() throws Exception {
		this.base = new URL("http://localhost:" + port + "/springboot/user/1");
		template = new TestRestTemplate();
	}

	@Test
	@Ignore
	public void getHello() throws Exception {
		ResponseEntity<User> response = template.getForEntity(base.toString(), User.class);
		assertThat(response.getBody().getName(), equalTo("zhang"));
	}
}
