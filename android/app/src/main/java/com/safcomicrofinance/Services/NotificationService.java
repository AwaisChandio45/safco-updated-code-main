package com.safcomicrofinance.Services;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

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
import java.util.Timer;
import java.util.TimerTask;

public class NotificationService extends Service {
    private FusedLocationProviderClient fusedLocationProviderClient;
    private static Location mLastLocation;
    private LocationCallback mlocationCallback;
    DBHandler dbHandler;
    @Override
    public void onCreate() {
        super.onCreate();
        dbHandler=new DBHandler(NotificationService.this);
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(NotificationService.this);

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O)
            startMyOwnForeground();
        else
            startForeground(1, new Notification());
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void startMyOwnForeground()
    {
        String NOTIFICATION_CHANNEL_ID = "com.safcomicrofinance";
        String channelName = "Location Service";
        NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_NONE);
        chan.setLightColor(Color.BLUE);
        chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        assert manager != null;
        manager.createNotificationChannel(chan);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);
        Notification notification = notificationBuilder.setOngoing(true)
                .setContentTitle("App is running in background")
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .build();
        startForeground(2, notification);
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        startTimer();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stoptimertask();

        Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("RestartService");
        broadcastIntent.setClass(this,  RestartService.class);
        this.sendBroadcast(broadcastIntent);
    }

    private Timer timer;
    private TimerTask timerTask;
    public void startTimer() {
        timer = new Timer();
        timerTask = new TimerTask() {
            public void run() {
                getDeviceLocation(NotificationService.this);
            }
        };
        timer.schedule(timerTask, 1000, 600000); //
    }

    public void stoptimertask() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

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
                                SharedPreferences prefs = getSharedPreferences(String.valueOf(R.string.MY_PREFS_NAME), MODE_PRIVATE);
                                String name = prefs.getString("userId", "No name defined");
                                Log.i("Lats", "=========  "+ (mLastLocation.getLatitude()));
                                Log.i("long", "== =======  "+ (mLastLocation.getLongitude()));
                                String lat= String.valueOf(mLastLocation.getLatitude());
                                String lon= String.valueOf(mLastLocation.getLongitude());
                                Calendar c = Calendar.getInstance();
                                SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss a");
                                String formattedDate = df.format(c.getTime());
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
                                cursor.close();

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
}