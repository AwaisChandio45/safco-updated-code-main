package com.safcomicrofinance;

import android.content.Context;
import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.ReactActivity;

import java.lang.reflect.Method;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  public static void showDebugDBAddressLogToast(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        Class<?> debugDB = Class.forName("com.amitshekhar.DebugDB");
        Method getAddressLog = debugDB.getMethod("getAddressLog");
        Object value = getAddressLog.invoke(null);
        Toast.makeText(context, (String) value, Toast.LENGTH_LONG).show();
      } catch (Exception ignore) {

      }
    }
  }
  @Override
  protected String getMainComponentName() {
    return "SafcoMicrofinance";
  }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
