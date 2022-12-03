package com.uva.dbcs.grupo7.APIPractica.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.uva.dbcs.grupo7.APIPractica.Exception.UserException;
import com.uva.dbcs.grupo7.APIPractica.Model.User;
import com.uva.dbcs.grupo7.APIPractica.Repository.UserRepository;

@Service
public class UserDetailsServiceImplementation implements UserDetailsService{


    @Autowired
    private UserRepository repo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email).orElseThrow(() -> new UserException("No se ha encontrado el usuario con Email: " + email + "."));

        return new UserDetailsImplementation(user);
    }
    
}
