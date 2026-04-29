package co.delos.api.bootstrap;

import co.delos.api.service.AdminUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminUserBootstrap implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminUserBootstrap.class);
    private final AdminUserService adminUserService;
    private final String defaultUsername;
    private final String defaultPassword;

    public AdminUserBootstrap(
        AdminUserService adminUserService,
        @Value("${delos.admin.username}") String defaultUsername,
        @Value("${delos.admin.password}") String defaultPassword
    ) {
        this.adminUserService = adminUserService;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminUserService.findByUsername(defaultUsername).isEmpty()) {
            adminUserService.createUser(defaultUsername, defaultPassword);
            log.info("Default admin user '{}' created.", defaultUsername);
        } else {
            log.info("Admin user '{}' already exists.", defaultUsername);
        }
    }
}
