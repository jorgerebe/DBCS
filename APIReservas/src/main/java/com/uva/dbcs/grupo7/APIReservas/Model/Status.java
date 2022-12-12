package com.uva.dbcs.grupo7.APIReservas.Model;

public enum Status {
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    CANCELLED("Cancelled");

    private String code;

    private Status(String code){
        this.code = code;
    }

    public String getCode(){
        return code;
    }

}
