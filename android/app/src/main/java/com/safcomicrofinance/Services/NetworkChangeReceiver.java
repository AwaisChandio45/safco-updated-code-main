package com.safcomicrofinance.Services;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.safcomicrofinance.SqlDatabase.DBHandler;

import java.net.URL;
import java.net.URLConnection;

public class NetworkChangeReceiver extends BroadcastReceiver {
    DBHandler dbHandler;
    @Override
    public void onReceive(final Context context, final Intent intent) {
        dbHandler=new DBHandler(context);
        final String action = intent.getAction();
        if (intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
            checkConnectivity(context);
        }
    }

    private void checkConnectivity(final Context context) {
        if (!isNetworkInterfaceAvailable(context)) {
            Toast.makeText(context, "You are OFFLINE!", Toast.LENGTH_SHORT).show();
            return;
        }

        final Handler handler = new Handler();
        new Thread(new Runnable() {
            @Override
            public void run() {
                final boolean isConnected = isAbleToConnect("http://www.google.com", 1000);
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        if (isConnected) {
//                            Toast.makeText(context, "You are ONLINE!", Toast.LENGTH_SHORT).show();
//                            getLocation();
                        }
                        else {
//                            Toast.makeText(context, "You are OFFLINE!", Toast.LENGTH_SHORT).show();
                        }
                    }
                });

            }
        }).start();

    }

    //This only checks if the network interface is available, doesn't guarantee a particular network service is available, for example, there could be low signal or server downtime
    private boolean isNetworkInterfaceAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }

    //This makes a real connection to an url and checks if you can connect to this url, this needs to be wrapped in a background thread
    private boolean isAbleToConnect(String url, int timeout) {
        try {
            URL myUrl = new URL(url);
            URLConnection connection = myUrl.openConnection();
            connection.setConnectTimeout(timeout);
            connection.connect();
            return true;
        } catch (Exception e) {
            Log.i("exception", "" + e.getMessage());
            return false;
        }
    }

    public void getLocation() {
        Cursor cursor = (dbHandler.getLocationsCount());
        if (cursor.getCount() == 0) {
            Log.d("---?","No record founded");
        } else {
           Log.d("---?",cursor.toString());
        }
    }
}