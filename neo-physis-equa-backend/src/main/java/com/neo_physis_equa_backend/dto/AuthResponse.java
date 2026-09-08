package com.neo_physis_equa_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

    private String token;
    private Long id;
    private String nombre;
    private String email;
    private String mensaje;

    public AuthResponse(String token, Long id, String nombre, String email, String mensaje) {
        this.token = token;
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.mensaje = mensaje;
    }

    public AuthResponse(Long id, String nombre, String email, String mensaje) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.mensaje = mensaje;
    }

    public AuthResponse(String mensaje) {
        this.mensaje = mensaje;
    }
}