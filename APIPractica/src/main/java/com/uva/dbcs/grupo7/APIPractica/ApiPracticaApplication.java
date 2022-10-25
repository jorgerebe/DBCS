package com.uva.dbcs.grupo7.APIPractica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ApiPracticaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiPracticaApplication.class, args);
	}

}
