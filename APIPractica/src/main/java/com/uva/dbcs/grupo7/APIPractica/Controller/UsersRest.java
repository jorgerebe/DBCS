package com.uva.dbcs.grupo7.APIPractica.Controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RestController;
import com.uva.dbcs.grupo7.APIPractica.Model.User;
import com.uva.dbcs.grupo7.APIPractica.Exception.UserException;
import com.uva.dbcs.grupo7.APIPractica.Repository.UserRepository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
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
    public String updateUser(@PathVariable Integer id, @RequestBody User user) {
        User existente = repository.findById(id)
                .orElseThrow(() -> new UserException("No se ha encontrado el usuario con id: " + id + "."));

        existente.setFirstName(user.getFirstName());
        existente.setLastName(user.getLastName());
        existente.setEmail(user.getEmail());
        existente.setPassword(user.getPassword());

        try {
            repository.save(existente);
        } catch (Exception e) {
            throw new UserException("Error al actualizar los datos del usuario especificado");
        }

        return "Cambios realizados.";
    }

    /**
     * Modifica los datos del usuario a partir del Identificador proporcionado.
     * 
     * @param id Id del usuario a eliminar
     * @return Mensaje de exito/error.
     * @throws
     */

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Integer id) {
        try {
            repository.deleteById(id);
            return "Usuario borrado correctamente.";
        } catch (EmptyResultDataAccessException e) {
            System.out.println(e);
            return "El usuario con id " + id + " no existe.";
        }
    }

    /**
     * Consulta los usuarios que están habilitados o deshabilitados, según
     * {@code param}
     * 
     * @param enabled si es {@code true} se devolverán los usuarios habilitados, los
     *                inhabilitados si es {@code false}
     * @return los usuarios habilitados o inhabilitados
     */

    @GetMapping(params = "enabled")
    public List<User> getUsersByEnabled(@RequestParam Boolean enabled) {
        List<User> userslist = repository.findByEnabled(enabled);
        return userslist;
    }

    /**
     * Activa a los usuarios existentes cuyo id se encuentra en la lista de ids
     * {@code user_id}
     * 
     * @param user_id Lista de usuarios a habilitar
     * @return Mensaje de exito/error.
     */

    @PutMapping(value = "/enable", params = "user_id")
    public String setUsersEnabled(@RequestParam(required = true) List<Integer> user_id) {

        List<User> users = repository.findByIdIn(user_id);

        for (User user : users) {
            user.setEnabled(true);
        }

        try {
            repository.saveAll(users);
        } catch (Exception e) {
            throw new UserException("Error al habilitar los usuarios especificados");
        }

        return "Usuarios modificados.";
    }

    /**
     * Desactiva a los usuarios existentes cuyo id se encuentra en la lista de ids
     * {@code user_id}
     * 
     * @param user_id Lista de usuarios a inhabilitar
     * @return Mensaje de exito/error.
     */

    @PutMapping(value = "/disable", params = "user_id")
    public String setUsersDisabled(@RequestParam List<Integer> user_id) {

        List<User> users = repository.findByIdIn(user_id);

        for (User user : users) {
            user.setEnabled(false);
        }

        try {
            repository.saveAll(users);
        } catch (Exception e) {
            throw new UserException("Error al inhabilitar los usuarios especificados");
        }

        return "Usuarios modificados.";
    }
}
