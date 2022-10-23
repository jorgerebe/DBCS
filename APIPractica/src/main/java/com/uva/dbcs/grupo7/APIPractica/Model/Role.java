package com.uva.dbcs.grupo7.APIPractica.Model;

public enum Role {
    HOST("Host"),
    GUEST("Guest");

    private String code;

    private Role(String code){
        this.code = code;
    }

    public String getCode(){
        return code;
    }

}
