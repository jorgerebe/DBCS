package com.uva.dbcs.grupo7.APIPractica.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uva.dbcs.grupo7.APIPractica.Model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findById(Integer id);

    boolean existsUserByName(String name);
    boolean existsUserByEmail(String email);
    boolean existsUserById(Integer id);

    List<User> findByEnabled(Boolean enabled);

    boolean existsUserByEmailAndIdNot(String email, Integer id);

    List<User> findByIdIn(List<Integer> id);
}
