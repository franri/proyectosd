package com.sd20.backend.endpoints;

import com.sd20.backend.repositories.UserRepo;
import com.sd20.backend.utils.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.beans.Encoder;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("users")
public class SignController {

    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    @Autowired
    public SignController(UserRepo ur, PasswordEncoder encoder) {
        this.userRepo = ur;
        this.encoder = encoder;
    }

    @PostMapping("/new")
    public ResponseEntity<User> signup(@RequestBody User newUser) {
        System.out.println(newUser);
        System.out.println("registrando");
        if (userRepo.findUserByUser(newUser.getUser()) != null)
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        newUser.setPassword(encoder.encode(newUser.getPassword()));
        System.out.println(newUser);
        User savedUser = userRepo.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<User> signin(@RequestBody User userIn) {
        User user = userRepo.findUserByUser(userIn.getUser());
        if (user == null || !encoder.matches(userIn.getPassword(), user.getPassword()))
            return ResponseEntity.notFound().build();
        String token = getJWTToken(userIn.getUser());
        user.setToken(token);
        return ResponseEntity.ok(user);
    }

    private String getJWTToken(String username) {
        String secretKey = "mySecretKey";
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                .commaSeparatedStringToAuthorityList("ROLE_USER");

        String token = Jwts
                .builder()
                .setId("softtekJWT")
                .setSubject(username)
                .claim("authorities",
                        grantedAuthorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 600000))
                .signWith(SignatureAlgorithm.HS512,
                        secretKey.getBytes()).compact();

        return "Bearer " + token;
    }
}
