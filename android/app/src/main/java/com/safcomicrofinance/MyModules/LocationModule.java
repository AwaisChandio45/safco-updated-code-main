package com.safcomicrofinance.MyModules;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.safcomicrofinance.Services.NotificationService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;

public class LocationModule extends ReactContextBaseJavaModule {
    Intent mServiceIntent;
    private NotificationService mYourService;
    Context context;
    public LocationModule(ReactApplicationContext reactContext) {
         context=reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }
    @ReactMethod
    public void startServies(){
        mYourService = new NotificationService();
        mServiceIntent = new Intent(getReactApplicationContext(), mYourService.getClass());
        //working but comment for disable this location functionality
//        if (!isMyServiceRunning(mYourService.getClass())) {
//            getReactApplicationContext().startService(mServiceIntent);
//        }
    }

    private boolean isMyServiceRunning(Class serviceClass) {
        ActivityManager manager = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                Log.i ("Service status", "Running");
                return true;
            }
        }
        Log.i ("Service status", "Not running");
        return false;
    }


    @ReactMethod
    public void insertLocation(final Promise promise) throws JSONException {
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("lattitide","");
        jsonObject.put("longitude","");
        promise.resolve(jsonObject.toString());

    }
}
