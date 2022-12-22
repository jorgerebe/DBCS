package com.uva.dbcs.grupo7.APIReservas.Model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class DateRange {
    @JsonFormat( pattern = "dd/MM/yyyy")
    private LocalDate dateIn;
    @JsonFormat( pattern = "dd/MM/yyyy")
    private LocalDate dateOut;

	public DateRange(LocalDate dateIn, LocalDate dateOut){
		this.dateIn = dateIn;
		this.dateOut = dateOut;
	}

	public LocalDate getDateIn() {
		return this.dateIn;
	}

	public void setDateIn(LocalDate dateIn) {
		this.dateIn = dateIn;
	}
    
	public LocalDate getDateOut() {
		return this.dateOut;
	}
	public void setDateOut(LocalDate dateOut) {
		this.dateOut = dateOut;
	}


    
}
