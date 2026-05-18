package comma.edumetrix.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ForeignTokenAuthFilter foreignTokenAuthFilter;

    public SecurityConfig(ForeignTokenAuthFilter foreignTokenAuthFilter) {
        this.foreignTokenAuthFilter = foreignTokenAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we are a stateless API
                .csrf(AbstractHttpConfigurer::disable)

                // Configure endpoint authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/public/**").permitAll() // Allow public endpoints
                        .anyRequest().authenticated()                  // Guard everything else
                )

                // Force stateless session management (No cookies/JSESSIONID)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Inject your custom gRPC interceptor filter
                .addFilterBefore(foreignTokenAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}