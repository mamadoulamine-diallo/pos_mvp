package com.projectpos.shared.utils;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public final class FormatUtils {

    private FormatUtils() {
    }

    public static String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0 F";
        }

        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.FRANCE);
        formatter.setMaximumFractionDigits(0);

        return formatter.format(amount) + " F";
    }

    public static String formatCurrency(Long amount) {
        if (amount == null) {
            return "0 F";
        }

        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.FRANCE);

        return formatter.format(amount) + " F";
    }
}