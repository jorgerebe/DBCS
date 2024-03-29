package com.uva.dbcs.grupo7.APIReservas.Controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RestController;

import com.uva.dbcs.grupo7.APIReservas.Exception.ReservaException;
import com.uva.dbcs.grupo7.APIReservas.Model.DateRange;
import com.uva.dbcs.grupo7.APIReservas.Model.Reserva;
import com.uva.dbcs.grupo7.APIReservas.Model.Token;
import com.uva.dbcs.grupo7.APIReservas.Repository.ReservaRepository;

import org.springframework.web.bind.annotation.RequestMapping;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
@CrossOrigin("*")

public class ReservasRest {

    private final ReservaRepository repository;

    @Value("${Price}")
    private Float precio;
    @Value("${Rooms}")
    private Integer rooms;
    ReservasRest(ReservaRepository repository) {
        this.repository = repository;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public String newReserva(@RequestHeader ("authorization") String tokenHeader, @RequestBody Reserva newReserva, HttpServletResponse response) {

        response.setHeader("Content-type", "application/json");

        Token token = getToken(tokenHeader);
        if(!token.isGuest()){
            throw new ReservaException("No autorizado");
        }

        long ndays = ChronoUnit.DAYS.between(newReserva.getDateIn(), newReserva.getDateOut());
        newReserva.setPrice(ndays*precio);

        List<Reserva> reservas = repository.findAllByDateInGreaterThanEqualAndDateOutLessThanEqual(newReserva.getDateIn(),newReserva.getDateOut());

        int nHabitaciones = 0;

        for(Reserva reserva : reservas){
            nHabitaciones += reserva.getUnits();
        }

        if(rooms - nHabitaciones < newReserva.getUnits()){
            throw new ReservaException("No quedan habitaciones suficientes para realizar esta reserva.");
        }

        repository.save(newReserva);
        response.setStatus(200);
        return "Nuevo registro creado";

    }
    @GetMapping
    public List<Reserva> getReservas(@RequestHeader ("authorization") String tokenHeader) {

        List<Reserva> ReservaList;

        Token token = getToken(tokenHeader);
        if(token.isGuest()){
            ReservaList = repository.findByGuestID(token.getId());
        }
        else if(token.isHost()){
            ReservaList = repository.findAll(Sort.by(Sort.Direction.ASC, "createdAt"));
        }
        else{
            throw new ReservaException("No autorizado");
        }

        return ReservaList;
    }

    @GetMapping(value="/price")
    public Float getPrecio() {

        return this.precio;
    }

    @GetMapping(value = "/availability")
    public int[] getAvailability(@RequestHeader ("authorization") String tokenHeader, @RequestHeader ("rango") String jsonDates) {

        System.out.println(jsonDates);

        DateRange dates;

        JSONObject jsonObject = new JSONObject(jsonDates);
        JSONArray dateInJson = jsonObject.getJSONArray("dateIn");
        JSONArray dateOutJson = jsonObject.getJSONArray("dateOut");

        LocalDate dateIn = LocalDate.of(dateInJson.getInt(0), dateInJson.getInt(1), dateInJson.getInt(2));
        LocalDate dateOut = LocalDate.of(dateOutJson.getInt(0), dateOutJson.getInt(1), dateOutJson.getInt(2));

        dates = new DateRange(dateIn, dateOut);

        if(dates.getDateIn().isAfter(dates.getDateOut())){
            throw new ReservaException("La fecha inicial tiene que ser anterior a la final.");
        }
        List<Reserva> ReservaList = repository.findAllByDateInGreaterThanEqualAndDateOutLessThanEqual(dates.getDateIn(), dates.getDateOut());

        long ndias = dates.getDateIn().datesUntil(dates.getDateOut()).count();

        LocalDate dateIni = dates.getDateIn();

        int[] dias = new int[(int)ndias];

        for(int i = 0; i < ndias; i++){
            dias[i] += 10;
        }

        for(int i = 0; i < ndias; i++){
            for(Reserva reserva : ReservaList){
                if(reserva.getDateIn().isEqual(dateIni) || reserva.getDateOut().isEqual(dateIni)
                || ((reserva.getDateIn().isBefore(dateIni) && reserva.getDateOut().isAfter(dateIni)))){
                    dias[i] -= reserva.getUnits();
                }
            }
            dateIni = dateIni.plusDays(1);
        }


        return dias;
    }

    @GetMapping(value = { "/{id}" })
    public Reserva getReservaPorId(@RequestHeader ("authorization") String tokenHeader, @PathVariable Integer id) {

        Token token = getToken(tokenHeader);
        if(!token.isHost()){
            throw new ReservaException("No autorizado");
        }

        Reserva reserva = repository.findById(id)
                .orElseThrow(() -> new ReservaException("No se ha encontrado la reserva con id: " + id + "."));
        return reserva;
    }

    @PutMapping("/{id}")
    public String updateBook(@RequestHeader ("authorization") String tokenHeader, @PathVariable Integer id, @RequestBody Reserva res) {

        Token token = getToken(tokenHeader);
        if(!token.isHost()){
            throw new ReservaException("No autorizado");
        }

        Reserva existente = repository.findById(id)
                .orElseThrow(() -> new ReservaException("No se ha encontrado la reserva con id: " + id + "."));


        existente.setGuestName(res.getGuestName());
        existente.setNumGuest(res.getNumGuest());
        existente.setStatus(res.getStatus());


        try {
            repository.save(existente);
        } catch (Exception e) {
            throw new ReservaException("Error al actualizar los datos de la reserva especificada");
        }

        return "Cambios realizados.";
    }

    private Token getToken(String tokenPre){

        String token = tokenPre.substring(7);

        System.out.println(token);
        Base64.Decoder decoder = Base64.getUrlDecoder();


        String[] chunks = token.split("\\.");
        String payload = new String(decoder.decode(chunks[1]));

        JSONObject json = new JSONObject(payload);
        String role = json.getString("role");
        String name = json.getString("name");
        int id = json.getInt("id");

        Token tokenConstruido = new Token(name, id, role);

        return tokenConstruido;
    }
    
}
