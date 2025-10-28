package com.safcomicrofinance.Services;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import java.util.List;

public class GpsLocationReceiver extends BroadcastReceiver {
    Intent mServiceIntent;
    private NotificationService mYourService;

    private boolean isMyServiceRunning(Class serviceClass,Context context) {
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                Log.i ("Service status", "Running");
                return true;
            }
        }
        Log.i ("Service status", "Not running");
        return false;
    }

    @Override
    public void onReceive(
            Context context, Intent intent) {
        if (intent.getAction().matches("android.location.PROVIDERS_CHANGED")) {
          try{
              LocationManager mLocationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
              // Checking GPS is enabled
              String  mGPS = String.valueOf(mLocationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));

//working but comment for disable this location functionality
//              if(mGPS=="true"){
//                  mYourService = new NotificationService();
//                  mServiceIntent = new Intent(context, mYourService.getClass());
//                  if (!isMyServiceRunning(mYourService.getClass(),context)) {
//                      context.startService(mServiceIntent);
//                  }
//              }else{
//                  context.stopService(mServiceIntent);
//              }

          }catch (Exception e){
              Log.d("---error=>",e.toString());
          }


        }

    }

}