package com.uva.dbcs.grupo7.APIPractica.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uva.dbcs.grupo7.APIPractica.Model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(Integer id);

    boolean existsUserByEmail(String email);

    boolean existsUserById(Integer id);

    List<User> findByEnabled(Boolean enabled);


    List<User> findByIdIn(List<Integer> id);
}