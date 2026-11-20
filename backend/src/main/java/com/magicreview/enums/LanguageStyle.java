package com.magicreview.enums;

/**
 * Exactly three supported language styles.
 * ALL output must be in Latin/Roman script.
 * Native scripts (Telugu/Devanagari Unicode) are strictly forbidden.
 */
public enum LanguageStyle {
    ENGLISH,
    TELUGU_ENGLISH_MIX,
    HINGLISH;

    public static LanguageStyle fromString(String style) {
        if (style == null) {
            throw new IllegalArgumentException("Language style must not be null");
        }
        try {
            return LanguageStyle.valueOf(style.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                "Unsupported language style: " + style +
                ". Supported values: ENGLISH, TELUGU_ENGLISH_MIX, HINGLISH"
            );
        }
    }

    public String displayName() {
        switch (this) {
            case ENGLISH: return "English";
            case TELUGU_ENGLISH_MIX: return "Telugu + English";
            case HINGLISH: return "Hindi + English (Hinglish)";
            default: return name();
        }
    }
}