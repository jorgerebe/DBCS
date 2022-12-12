package com.uva.dbcs.grupo7.APIReservas.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)

public class ReservaException extends RuntimeException {
    public ReservaException(String mensaje) {
        super(mensaje);
    }
}