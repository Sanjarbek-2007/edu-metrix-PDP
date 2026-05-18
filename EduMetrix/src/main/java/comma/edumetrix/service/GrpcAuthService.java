package comma.edumetrix.service;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PreDestroy;
import java.util.Optional;

@Service
public class GrpcAuthService {

    private final ManagedChannel channel;
    // Mocking the blocking stub name. Replace with your actual proto-generated stub.
    private final Object blockingStub;

    public GrpcAuthService(
            @Value("${grpc.foreign-auth.host:localhost}") String host,
            @Value("${grpc.foreign-auth.port:9090}") int port) {

        // Connect to the exact foreign address
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext() // Use .useTransportSecurity() if TLS/SSL is required
                .build();

        // Initialize your actual stub here:
        // this.blockingStub = AuthServiceGrpc.newBlockingStub(channel);
        this.blockingStub = new Object();
    }

    public Optional<Object> validateTokenAndFetchUser(String token) {
        try {
            /* // 1. Build the gRPC Request
            ValidationRequest request = ValidationRequest.newBuilder().setToken(token).build();

            // 2. Call the remote server
            ValidationResponse response = blockingStub.validate(request);

            // 3. Return user entity if valid
            if (response.isValid()) {
                return Optional.of(response.getUserEntity());
            }
            */

            // Mocking a successful validation for structural clarity
            return Optional.of(new Object());

        } catch (Exception e) {
            // Log gRPC status exceptions appropriately here
            return Optional.empty();
        }
    }

    @PreDestroy
    public void shutdown() {
        if (channel != null && !channel.isShutdown()) {
            channel.shutdown();
        }
    }
}
