package com.gabrielareia.bridgephotoeditor.examplebridge;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CalendarModule extends ReactContextBaseJavaModule {
    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location, Callback callback) {
        String msg = "Create event called with name: " + name
                + " and location: " + location;

       callback.invoke(msg);
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }
}
