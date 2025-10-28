package com.safcomicrofinance.MyPackages;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.permissions.PermissionsModule;
import com.facebook.react.uimanager.ViewManager;
import com.safcomicrofinance.MyModules.FingerModule;
import com.safcomicrofinance.MyModules.LocationModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MyPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
    
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new FingerModule(reactContext),
                new LocationModule(reactContext)

        );
    }
}