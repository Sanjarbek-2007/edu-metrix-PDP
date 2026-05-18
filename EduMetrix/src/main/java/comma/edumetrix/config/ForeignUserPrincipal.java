package comma.edumetrix.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class ForeignUserPrincipal implements UserDetails {

    // Replace with your actual User Entity class/DTO
    private final Object userEntity;
    private final String token;

    public ForeignUserPrincipal(Object userEntity, String token) {
        this.userEntity = userEntity;
        this.token = token;
    }

    public Object getUserEntity() {
        return userEntity;
    }

    public String getToken() {
        return token;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Defaulting to a standard role; map your gRPC roles here if applicable
        return Collections.emptyList();
    }

    @Override public String getPassword() { return null; }
    @Override public String getUsername() { return "foreign_user"; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}