package com.uva.dbcs.grupo7.APIPractica.Model;

import java.util.stream.Stream;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply=true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role){
        if(role == null){
            return null;
        }
        return role.getCode();
    }

    @Override
    public Role convertToEntityAttribute(String code){
        if(code == null){
            return null;
        }

        return Stream.of(Role.values())
            .filter(c -> c.getCode().equals(code))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }

}
