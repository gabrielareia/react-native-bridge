package com.gabrielareia.bridgephotoeditor.reactcustomview;

import android.util.JsonReader;

import androidx.annotation.Nullable;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

public class Filter {
    public int sum;
    public double multiply;
    public String color;
    public ColorMode colorMode;

    public Filter(int sum, double multiply, String color, @Nullable ColorMode colorMode) {
        this.sum = sum;
        this.multiply = multiply;
        this.color = color;
        this.colorMode = colorMode;
    }

    public static List<Filter> getFiltersFromJson(String jsonString) throws IOException, NoSuchFieldException {
        Reader reader = new StringReader(jsonString);
        JsonReader json = new JsonReader(reader);
        try {
            return getFilterArray(json);
        } finally {
            reader.close();
        }
    }

    private static List<Filter> getFilterArray(JsonReader json) throws IOException, NoSuchFieldException {
        List<Filter> messages = new ArrayList<Filter>();

        json.beginArray();
        while (json.hasNext()) {
            messages.add(getFilter(json));
        }
        json.endArray();
        return messages;
    }

    private static Filter getFilter(JsonReader json) throws IOException, NoSuchFieldException {
        int sum = 0;
        double multiply = 0;
        String color = null;
        @Nullable ColorMode colorMode = null;

        json.beginObject();
        while (json.hasNext()) {
            String name = json.nextName();
            if (name.equals("sum")) {
                sum = (int)json.nextDouble();
            } else if (name.equals("multiply")) {
                multiply = json.nextDouble();
            } else if (name.equals("color")) {
                color = json.nextString();
            } else if (name.equals("colorMode")) {
                colorMode = getColorMode(json.nextString());
            } else {
                json.skipValue();
            }
        }
        json.endObject();
        return new Filter(sum, multiply, color, colorMode);
    }

    private static ColorMode getColorMode(String colorMode) throws NoSuchFieldException {
        if(colorMode.equals("multiply")) {
            return ColorMode.Multiply;
        } else if(colorMode.equals("add")) {
            return ColorMode.Add;
        } else if(colorMode.equals("screen")) {
            return ColorMode.Screen;
        } else if(colorMode.equals("soft-light")) {
            return ColorMode.SoftLight;
        } else {
            throw new NoSuchFieldException();
        }
    }

}
