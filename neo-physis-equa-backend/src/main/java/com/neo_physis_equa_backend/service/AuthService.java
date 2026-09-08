package com.neo_physis_equa_backend.service;

import com.neo_physis_equa_backend.dto.AuthResponse;
import com.neo_physis_equa_backend.dto.LoginRequest;
import com.neo_physis_equa_backend.dto.RegistroRequest;
import com.neo_physis_equa_backend.entity.Usuario;
import com.neo_physis_equa_backend.exception.EmailAlreadyExistsException;
import com.neo_physis_equa_backend.exception.InvalidCredentialsException;
import com.neo_physis_equa_backend.repository.UsuarioRepository;
import com.neo_physis_equa_backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registro(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), "Registro exitoso");
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), "Login exitoso");
    }

    public AuthResponse obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return new AuthResponse(null, usuario.getId(), usuario.getNombre(), usuario.getEmail(), "Usuario autenticado");
    }
}