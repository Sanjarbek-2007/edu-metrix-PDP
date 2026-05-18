package comma.edumetrix.entities;

import java.util.List;

public record User(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        List<String> roles,
        Device device
) {}
record Device(
        String deviceName,
        String deviceType,
        String location,
        String browser,
        String ipAddress
) {}