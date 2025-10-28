package com.safcomicrofinance;

import android.app.Application;
import android.content.Context;
import android.database.CursorWindow;
import android.os.Build;
import android.system.Os;
import android.widget.Toast;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;
import com.safcomicrofinance.MyPackages.MyPackage;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }
          @Override
          protected String getJSBundleFile() {
              return CodePush.getJSBundleFile();
          }
        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
//            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                packages.add(new MyPackage());
//            }
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
//    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
      showDebugDBAddressLogToast();
      try {
    Field field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
    field.setAccessible(true);
    field.set(null, 100 * 1024 * 1024); //the 100MB is the new size
    } catch (Exception e) {
       e.printStackTrace();
    }
  }
    public static void showDebugDBAddressLogToast() {
        if (BuildConfig.DEBUG) {
            try {
                Class<?> debugDB = Class.forName("com.amitshekhar.DebugDB");
                Method getAddressLog = debugDB.getMethod("getAddressLog");
                Object value = getAddressLog.invoke(null);
//                Toast.makeText(context, (String) value, Toast.LENGTH_LONG).show();
            } catch (Exception ignore) {

            }
        }
    }
//  /**
//   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
//   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
//   *
//   * @param context
//   * @param reactInstanceManager
//   */
//  private static void initializeFlipper(
//      Context context, ReactInstanceManager reactInstanceManager) {
//    if (BuildConfig.DEBUG) {
//      try {
//        /*
//         We use reflection here to pick up the class that initializes Flipper,
//        since Flipper library is not available in release mode
//        */
//        Class<?> aClass = Class.forName("com.safcomicrofinance.ReactNativeFlipper");
//        aClass
//            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
//            .invoke(null, context, reactInstanceManager);
//      } catch (ClassNotFoundException e) {
//        e.printStackTrace();
//      } catch (NoSuchMethodException e) {
//        e.printStackTrace();
//      } catch (IllegalAccessException e) {
//        e.printStackTrace();
//      } catch (InvocationTargetException e) {
//        e.printStackTrace();
//      }
//    }
//  }
}
