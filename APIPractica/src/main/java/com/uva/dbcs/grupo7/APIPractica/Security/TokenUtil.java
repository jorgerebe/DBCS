package com.uva.dbcs.grupo7.APIPractica.Security;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.io.InputStream;

public class TokenUtil {

    public static UsernamePasswordAuthenticationToken getAuth(String tokenJWT) {
        //TODO controlar excepciones
         try { 

            Claims claims = Jwts.parser().setSigningKey(privateKey()).parseClaimsJws(tokenJWT).getBody();
            if(claims.getExpiration().before(new Date())){return null;};
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
                InputStream iptStr= TokenUtil.class.getResourceAsStream("./private.key");
                byte[] bytes = iptStr.readAllBytes();
                fileContent = new String (bytes);
            } 
            catch (IOException e) 
            {
                e.printStackTrace();
            }

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
