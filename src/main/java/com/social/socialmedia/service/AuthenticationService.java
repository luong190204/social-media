package com.social.socialmedia.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.social.socialmedia.dto.request.AuthenticationRequest;
import com.social.socialmedia.dto.request.IntrospectRequest;
import com.social.socialmedia.dto.request.LogoutRequest;
import com.social.socialmedia.dto.request.RefreshRequest;
import com.social.socialmedia.dto.response.AuthenticationResponse;
import com.social.socialmedia.dto.response.IntrospectResponse;
import com.social.socialmedia.entity.RevokedToken;
import com.social.socialmedia.entity.User;
import com.social.socialmedia.exception.AppException;
import com.social.socialmedia.exception.ErrorCode;
import com.social.socialmedia.repository.RevokedTokenRepository;
import com.social.socialmedia.repository.UserRepository;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
public class AuthenticationService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RevokedTokenRepository revokedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected Long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected Long REFRESHABLE_DURATION;

    public AuthenticationResponse authentication(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    // Check token
    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        Boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    // Logout
    public void logout(LogoutRequest request)
            throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken(), true);

        String jti = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        RevokedToken revokedToken = RevokedToken.builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build();

        revokedTokenRepository.save(revokedToken);
    }

    // Verify token. kiểm tra token hợp lệ
    private SignedJWT verifyToken(String token, boolean isRefresh)
            throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        // Nếu refresh thì lấy REFRESHABLE_DURATION còn introspect thì lấy ExpirationTime
        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                    .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        // Kiểm tra token đã logout chưa
        if (revokedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    // Refresh token
    public AuthenticationResponse refreshToken(RefreshRequest request)
            throws ParseException, JOSEException {
        // Kiểm tra token còn hiệu lực không
        var signJWT = verifyToken(request.getToken(), true);

        var jti = signJWT.getJWTClaimsSet().getJWTID();

        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

        // cho vào table black list token
        RevokedToken revokedToken = RevokedToken.builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build();

        revokedTokenRepository.save(revokedToken);

        // Lấy ra username từ jwt được verify
        var userName = signJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findByUsername(userName).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHENTICATED)
        );

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    // Tạo token
    private String generateToken(User user) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("social.com") // Xác định issuer từ ai
                .issueTime(new Date()) // thời điểm hiện tại
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                )) // Thời hạn của token là sau 1h
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("id", user.getId())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        // Ký token
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(stringJoiner::add
            );
        }

        return stringJoiner.toString();
    }
}
