package com.uva.dbcs.grupo7.APIReservas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ApiReservasApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiReservasApplication.class, args);
	}

}
