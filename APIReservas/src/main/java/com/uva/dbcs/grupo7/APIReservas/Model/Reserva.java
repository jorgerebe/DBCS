package com.uva.dbcs.grupo7.APIReservas.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "Reserva")
@EntityListeners(AuditingEntityListener.class)
public class Reserva {

    @Id
    @GeneratedValue
    private Integer id;


    @Size(max = 25)
    @Basic(optional = false)
    private String guestName;




    @Basic(optional = false)
    private String guestID;



    @Basic(optional = true)
    private Float price;



    
    @Basic(optional = false)
    private Integer units;



    
    @Max(3)
    @Basic(optional = false)
    private Integer numGuest;




    @Column(nullable = false)
    private Status status;



    @Column(nullable = false)
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dateIn;


    @Column(nullable = false)
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dateOut;



    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    Reserva() {

    }

    public Reserva(String guestName, String guestID, Float price, Integer units, Integer password, Integer numGuest, Status status, LocalDate dateIn, LocalDate dateOut) {
        this.guestName = guestName;
        this.guestID = guestID;
        this.price = price;
        this.units = units;
        this.numGuest = numGuest;
        this.status = status;
        this.dateIn = dateIn;
        this.dateOut = dateOut;
    }

    
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getGuestName() {
		return this.guestName;
	}

	public void setGuestName(String guestName) {
		this.guestName = guestName;
	}
	public String getGuestID() {
		return this.guestID;
	}

	public void setGuestID(String guestID) {
		this.guestID = guestID;
	}


	public Float getPrice() {
		return this.price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}
	public Integer getUnits() {
		return this.units;
	}

	public void setUnits(Integer units) {
		this.units = units;
	}
	public Integer getNumGuest() {
		return this.numGuest;
	}

	public void setNumGuest(Integer numGuest) {
		this.numGuest = numGuest;
	}
	public Status getStatus() {
		return this.status;
	}

	public void setStatus(Status status) {
		this.status = status;
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

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}


	public LocalDateTime getUpdatedAt() {
		return this.updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}


}
