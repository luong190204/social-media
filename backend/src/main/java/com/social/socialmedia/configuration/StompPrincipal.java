package com.social.socialmedia.configuration;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@AllArgsConstructor
@Getter
public class StompPrincipal implements Principal {
    private final String name;

    @Override
    public String getName() {
        return name;
    }
}
