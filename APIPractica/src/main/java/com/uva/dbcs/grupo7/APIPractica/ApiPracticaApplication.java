package com.uva.dbcs.grupo7.APIPractica;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uva.dbcs.grupo7.APIPractica.Model.Role;
import com.uva.dbcs.grupo7.APIPractica.Model.User;
import com.uva.dbcs.grupo7.APIPractica.Repository.UserRepository;

@SpringBootApplication
@EnableJpaAuditing
public class ApiPracticaApplication implements CommandLineRunner{

	@Autowired UserRepository repository;
	public static void main(String[] args) {
		SpringApplication.run(ApiPracticaApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		PasswordEncoder passEncoder = new BCryptPasswordEncoder();
		String passwordEncriptada = passEncoder.encode("admin");
		User user = new User("admin", "admin", "admin",
							"admin@admin.es", passwordEncriptada, Role.HOST);

		if(!repository.existsUserByName(user.getName()) && !repository.existsUserByEmail(user.getEmail())){
			repository.save(user);
		}
	}

}
