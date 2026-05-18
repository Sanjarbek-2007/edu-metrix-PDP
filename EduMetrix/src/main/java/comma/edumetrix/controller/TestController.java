package comma.edumetrix.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/public/test")
    public String test() {
        return "test worked";
    }
}
