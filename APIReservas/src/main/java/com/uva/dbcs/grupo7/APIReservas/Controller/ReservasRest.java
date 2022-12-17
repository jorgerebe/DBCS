package com.uva.dbcs.grupo7.APIReservas.Controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RestController;

import com.uva.dbcs.grupo7.APIReservas.Exception.ReservaException;
import com.uva.dbcs.grupo7.APIReservas.Model.DateRange;
import com.uva.dbcs.grupo7.APIReservas.Model.Reserva;
import com.uva.dbcs.grupo7.APIReservas.Repository.ReservaRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
@CrossOrigin("*")

public class ReservasRest {

    private final ReservaRepository repository;
    // Pasar a variables de entorno cuando acabemos
    /* @Value("${Price}") */
    private Float precio = 40f;
   /*  @Value("${Rooms}") */
    private Integer rooms = 10;
    ReservasRest(ReservaRepository repository) {
        this.repository = repository;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public String newReserva(@RequestBody Reserva newReserva, HttpServletResponse response) {
        response.setHeader("Content-type", "application/json");
        if(rooms - repository.findAllByDateInGreaterThanEqualAndDateOutLessThanEqual(newReserva.getDateIn(),newReserva.getDateOut()).size() < newReserva.getUnits()){
            throw new ReservaException("No quedan habitaciones suficientes para realizar esta reserva.");
        }

        


            repository.save(newReserva);
            return "Nuevo registro creado";

    }
    @GetMapping
    public List<Reserva> getReservas() {

        List<Reserva> ReservaList = repository.findAll();
        return ReservaList;
    }

    @GetMapping(value = "/availability")
    public List<Reserva> getAvailability(@RequestBody DateRange dates) {
        if(dates.getDateIn().isAfter(dates.getDateOut())){
            throw new ReservaException("La fecha inicial tiene que ser anterior a la final.");
        }
        List<Reserva> ReservaList = repository.findAllByDateInGreaterThanEqualAndDateOutLessThanEqual(dates.getDateIn(), dates.getDateOut());
        return ReservaList;
    }

    @GetMapping(value = { "/{id}" })
    public Reserva getReservaPorId(@PathVariable Integer id) {
        Reserva reserva = repository.findById(id)
                .orElseThrow(() -> new ReservaException("No se ha encontrado la reserva con id: " + id + "."));
        return reserva;
    }

    @PutMapping("/{id}")
    public String updateUser(@PathVariable Integer id, @RequestBody Reserva res) {
        Reserva existente = repository.findById(id)
                .orElseThrow(() -> new ReservaException("No se ha encontrado la reserva con id: " + id + "."));



        existente.setGuestName(res.getGuestName());
        existente.setDateIn(res.getDateIn());
        existente.setDateOut(res.getDateOut());
        existente.setNumGuest(res.getNumGuest());
        existente.setPrice(res.getPrice());
        existente.setUnits(res.getUnits());
        existente.setStatus(res.getStatus());


        try {
            repository.save(existente);
        } catch (Exception e) {
            throw new ReservaException("Error al actualizar los datos de la reserva especificada");
        }

        return "Cambios realizados.";
    }
}
