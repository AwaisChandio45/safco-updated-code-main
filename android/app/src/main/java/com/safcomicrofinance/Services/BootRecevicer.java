package com.safcomicrofinance.Services;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

public class BootRecevicer extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent arg1) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(arg1.getAction())) {
//            Toast.makeText(context, "Service restarted", Toast.LENGTH_SHORT).show();
//working but comment for disable this location functionality
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                context.startForegroundService(new Intent(context, NotificationService.class));
//            } else {
//                context.startService(new Intent(context, NotificationService.class));
//            }
        }
    }
}