package co.delos.api.service;

import java.security.SecureRandom;

public final class IdGenerator {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private IdGenerator() {}

    public static String generate(String prefix) {
        StringBuilder sb = new StringBuilder(prefix).append("-");
        for (int i = 0; i < 5; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
