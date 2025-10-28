package com.safcomicrofinance.Services;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.location.Location;
import android.os.PowerManager;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.safcomicrofinance.R;
import com.safcomicrofinance.SqlDatabase.DBHandler;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class AlarmClass extends BroadcastReceiver
{
    private FusedLocationProviderClient fusedLocationProviderClient;
    private static Location mLastLocation;
    private LocationCallback mlocationCallback;
    DBHandler dbHandler;

    private void getDeviceLocation(Context context) {

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        fusedLocationProviderClient.getLastLocation()
                .addOnCompleteListener(new OnCompleteListener<Location>() {

                    @Override
                    public void onComplete(@NonNull Task<Location> task) {
                        if (task.isSuccessful()) {
                            mLastLocation = task.getResult();
                            if (mLastLocation != null) {
                                Calendar c = Calendar.getInstance();
                                SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss a");
                                String formattedDate = df.format(c.getTime());
                                System.out.println("Format dateTime => " + formattedDate);
                                SharedPreferences prefs = context.getSharedPreferences(String.valueOf(R.string.MY_PREFS_NAME), Context.MODE_PRIVATE);
                                String name = prefs.getString("userId", "No name defined");
                                Log.i("Lats", "=========  "+ (mLastLocation.getLatitude()));
                                Log.i("long", "== =======  "+ (mLastLocation.getLongitude()));
                                String lat= String.valueOf(mLastLocation.getLatitude());
                                String lon= String.valueOf(mLastLocation.getLongitude());
                                Cursor cursor=(dbHandler.getLocationsCount());
                                if (cursor.getCount() == 0) {
                                    dbHandler.insertNewLocation(name,lat,lon,formattedDate);
                                }else{
                                    while (cursor.moveToNext()) {
                                        Log.d("---->0",cursor.getString(0));
                                        Log.d("---->1",cursor.getString(1));
                                        Log.d("---->lats",lat);
                                        Log.d("---->longs",lon);
                                        if(cursor.getString(0).equals(lat) && cursor.getString(1).equals(lon)){
                                            Log.d("--->","Already inserted,Skip");
                                        }else{
                                            dbHandler.insertNewLocation(name,lat,lon,formattedDate);
                                        }

//                                        if(cursor.getString(0).equals())
//                                        listItem.add(cursor.getString(1)); // Adding data received to a Listview
                                    }
                                }


                            } else {
                                final LocationRequest locationRequest = LocationRequest.create();
                                locationRequest.setInterval(2000);
                                locationRequest.setFastestInterval(1000);
                                locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
                                mlocationCallback = new LocationCallback() {
                                    @Override
                                    public void onLocationResult(LocationResult locationResult) {
                                        super.onLocationResult(locationResult);
                                        if (locationResult == null) {
                                            return;
                                        }
                                        mLastLocation = locationResult.getLastLocation();
                                        fusedLocationProviderClient.removeLocationUpdates(mlocationCallback);
                                    }
                                };
                                if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) !=
                                        PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                                    // TODO: Consider calling
                                    //    ActivityCompat#requestPermissions
                                    // here to request the missing permissions, and then overriding
                                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                                    //                                          int[] grantResults)
                                    // to handle the case where the user grants the permission. See the documentation
                                    // for ActivityCompat#requestPermissions for more details.
                                    return;
                                }
                                fusedLocationProviderClient.requestLocationUpdates(locationRequest, mlocationCallback, null);

                            }
                        } else {
                            Toast.makeText(context, "unable to get last location", Toast.LENGTH_SHORT).show();
                        }

                        if (mLastLocation == null) {
                            return;
                        }


                        //finish

                    }
                });
    }

    @Override
    public void onReceive(Context context, Intent intent) 
    {
        dbHandler=new DBHandler(context);
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(context);

        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        @SuppressLint("InvalidWakeLockTag") PowerManager.WakeLock wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "");
        wl.acquire();
        getDeviceLocation(context);

        wl.release();
    }

    public void setAlarm(Context context)
    {
        AlarmManager am =( AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        Intent i = new Intent(context, AlarmClass.class);
        PendingIntent pi = PendingIntent.getBroadcast(context, 0, i, 0);
        am.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), 1000 * 1 * 10, pi); // Millisec * Second * Minute
        Toast.makeText(context, "Aby working", Toast.LENGTH_SHORT).show();
    }

    public void cancelAlarm(Context context)
    {
        Intent intent = new Intent(context, AlarmClass.class);
        PendingIntent sender = PendingIntent.getBroadcast(context, 0, intent, 0);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(sender);
    }
}