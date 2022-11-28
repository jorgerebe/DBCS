package com.uva.dbcs.grupo7.APIPractica.Security;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Collections;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.io.FileInputStream;
import java.io.IOException;

public class TokenUtil {
    
    private final static String SECRET = "mySecretKey";


    public static UsernamePasswordAuthenticationToken getAuth(String tokenJWT) {
        //TODO controlar excepciones
         try { 

            Claims claims = Jwts.parser().setSigningKey(privateKey()).parseClaimsJws(tokenJWT).getBody();

        return new UsernamePasswordAuthenticationToken(claims.getSubject(), null, Collections.emptyList());    
         } catch (JwtException e) {
            return null;
        } 
        
    }

    private static PrivateKey privateKey() {
        PrivateKey privateKey = null;
        try {
            String fileContent = "";

            try
            {
                byte[] bytes = Files.readAllBytes(Paths.get("./APIPractica/src/main/java/com/uva/dbcs/grupo7/APIPractica/Security/private.key"));
                fileContent = new String (bytes);
            } 
            catch (IOException e) 
            {
                e.printStackTrace();
            }
            System.out.println(fileContent);
            byte[] bytearray = Base64.getDecoder().decode(fileContent);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(bytearray);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            privateKey = keyFactory.generatePrivate(keySpec);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to generate private key..." + ex.getMessage());
        }
        return privateKey;
    }
}
