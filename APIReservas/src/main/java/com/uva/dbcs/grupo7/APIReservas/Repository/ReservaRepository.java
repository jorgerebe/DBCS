package com.uva.dbcs.grupo7.APIReservas.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uva.dbcs.grupo7.APIReservas.Model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    Optional<Reserva> findById(Integer id);

    List<Reserva> findAllByDateInGreaterThanEqualAndDateOutLessThanEqual(LocalDate to, LocalDate from);

    List<Reserva> findByIdIn(List<Integer> id);

}
