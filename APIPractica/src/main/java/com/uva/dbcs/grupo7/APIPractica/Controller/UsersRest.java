package com.uva.dbcs.grupo7.APIPractica.Controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RestController;
import com.uva.dbcs.grupo7.APIPractica.Model.User;
import com.uva.dbcs.grupo7.APIPractica.Exception.UserException;
import com.uva.dbcs.grupo7.APIPractica.Repository.UserRepository;

import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UsersRest {

    private final UserRepository repository;

    UsersRest(UserRepository repository) {
        this.repository = repository;
    }

    /**
     * Guarda un usuario en la base de datos a partir de un Json con los datos que
     * se recibe como argumento.
     * 
     * @param newUser  El cuerpo de la petición, en la que se espera que vaya un
     *                 Json con los datos del usuario.
     * @param response Objeto respuesta Http utilizado para agregar la cabecera
     *                 Json.
     * @return Mensaje de confirmacion o error.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public String newVino(@RequestBody User newUser, HttpServletResponse response) {
        response.setHeader("Content-type", "application/json");
        try {
            repository.save(newUser);
            return "Nuevo registro creado";
        } catch (Exception e) {
            throw new UserException("Error al crear el nuevo registro.");
        }
    }

    /**
     * Devuelve una lista con todos los usuarios del sistema
     * 
     * @return Lista de usuarios
     */
    @GetMapping()
    public List<User> getUsers() {
        List<User> listaV = repository.findAll();
        return listaV;
    }

    /**
     * Devuelve un usuario dado un Identificador
     * 
     * @param id Identificador del usuario que se quiere recuperar
     * @return El usuaio con la id especificada
     */
    @GetMapping(value = { "/{id}" })
    public User getUserPorId(@PathVariable Integer id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserException("No se ha encontrado el usuario con id: " + id + "."));
        return user;
    }

    /**
     * Modifica los datos del usuario a partir del Identificador proporcionado.
     * 
     * @param id          Id del usuario a modificar.
     * @param newUserData Json con los datos a modificar.
     * @return Mensaje de exito/error.
     */
    @PutMapping("/{id}")
    public String updateUser(@PathVariable Integer id, @RequestBody String newUserData) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserException("No se ha encontrado el usuario con id: " + id + "."));
        try {
            JSONObject jsonObject = new JSONObject(newUserData);
            if (jsonObject.has("email")) {
                String mail = jsonObject.getString("email");
                if (!repository.existsUserByEmail(mail)) {
                    user.setEmail(mail);
                } else if (repository.existsUserByEmail(mail)) {
                    throw new UserException("Ya existe un usuario asociado al email.");
                }
            }
            if (jsonObject.has("firstName")) {
                user.setFirstName(jsonObject.getString("firstName"));
            }
            if (jsonObject.has("lastName")) {
                user.setFirstName(jsonObject.getString("lastName"));
            }
            if (jsonObject.has("password")) {
                user.setFirstName(jsonObject.getString("password"));
            }
            repository.save(user);
        } catch (JSONException e) {
            e.printStackTrace();
            return "Error en los datos";
        }
        return "Cambios realizados.";
    }
}
