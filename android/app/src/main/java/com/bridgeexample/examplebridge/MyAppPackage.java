package com.bridgeexample.examplebridge;

import androidx.annotation.NonNull;

import com.bridgeexample.examplebridge.CalendarModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class MyAppPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new CalendarModule(reactApplicationContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        List<ViewManager> views = new ArrayList<>();

        return views;
    }
}
