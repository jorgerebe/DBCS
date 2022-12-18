package com.uva.dbcs.grupo7.APIReservas.Model;

public class Token {
    private String name;
    private int id;
    private String role;

    public Token(){

    }

    public Token(String name, int id, String role){
        setName(name);
        setId(id);
        setRole(role);
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getRole() {
        return role;
    }

    public boolean isGuest(){
        return role.equals("GUEST");
    }

    public boolean isHost(){
        return role.equals("HOST");
    }

    public void setRole(String role) {
        this.role = role;
    }
}
