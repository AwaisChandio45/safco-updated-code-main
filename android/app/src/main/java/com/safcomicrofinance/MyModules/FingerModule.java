package com.safcomicrofinance.MyModules;

import static android.content.Context.MODE_PRIVATE;

import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.Toast;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.safcomicrofinance.R;
import com.safcomicrofinance.Services.NotificationService;
import com.safcomicrofinance.secugen.FingerPrintReader;
import com.safcomicrofinance.utilies.HexConversion;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.Random;

import SecuGen.FDxSDKPro.JSGFPLib;
import SecuGen.FDxSDKPro.SGDeviceInfoParam;
import SecuGen.FDxSDKPro.SGFDxDeviceName;
import SecuGen.FDxSDKPro.SGFDxSecurityLevel;


public class FingerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";
    private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = (UsbDevice) intent
                            .getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (intent.getBooleanExtra(
                            UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (device != null) {
                            //Log.d(TAG, "Vender DI" + device.getVendorId());
                            //Log.d(TAG, "Producat ID " + device.getProductId());
                        } else {
                        }
                        //Log.e(TAG, "mUsbReceiver.onReceive() Device is null");
                    } else {
                    }
                    // Log.e(TAG, "mUsbReceiver.onReceive() permission denied for device " + device);
                }
            }
        }
    };
    HexConversion conversion;
    FingerPrintReader fingerPrintReader1;
    private IntentFilter filter;
    private JSGFPLib sgfplib;
    private boolean isDeviceRegistered = false;
    private PendingIntent mPermissionIntent;
    private byte[] mRegisterImage, mCaptureTemplate;
    private int[] mMaxTemplateSize;
    private int mImageWidth;
    private int mImageHeight;
    private int mImageDPI;
    private String cnic, base64Temp;
    private DatePickerDialog mDatePickerDialog;
    private SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
    private EditText nicEdt;
    private Bitmap fingerBmp;
    Intent mServiceIntent;
    private NotificationService mYourService;
    private ImageView imageViewCapFingerprint, imageViewCustomer;
    ProgressDialog progressDialog;
    private final BroadcastReceiver mUsbAttachedAndDetReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (UsbManager.ACTION_USB_DEVICE_ATTACHED.equals(intent.getAction())) {
                usbPermission();
                initiateDeviceAndView();
                //Log.e(TAG, "onReceive: Usb Attached");
            }
            if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(intent.getAction())) {
                //Log.e(TAG, "onReceive: USB Detached");
                fingerPrintReader1 = null;

            }
        }
    };
    private String mRegisterTemplateStr;
    private AlertDialog alertDialog;
    Context context;


    //constructor
    public FingerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context=reactContext;
        reactContext.addLifecycleEventListener(this);
        conversion = new HexConversion();
       usbPermission();
        initiateDeviceAndView();

    }
private void usbPermission() {
    
    mPermissionIntent = PendingIntent.getBroadcast(context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
    filter = new IntentFilter(ACTION_USB_PERMISSION);
    context.registerReceiver(mUsbReceiver, filter);

    // Get the UsbManager instance
    UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
    
    // Pass both context and usbManager to the constructor
    sgfplib = new JSGFPLib(context, usbManager);
    
    long error = sgfplib.Init(SGFDxDeviceName.SG_DEV_AUTO);
    
}

    // private void usbPermission() {
    //     mPermissionIntent = PendingIntent.getBroadcast(context, 0, new Intent(
    //             ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
    //     filter = new IntentFilter(ACTION_USB_PERMISSION);
    //     context.registerReceiver(mUsbReceiver, filter);
    //     sgfplib = new JSGFPLib(
    //             (UsbManager) context.getSystemService(Context.USB_SERVICE));
    //     long error = sgfplib.Init(SGFDxDeviceName.SG_DEV_AUTO);
    // }

    public void initiateDeviceAndView() {
        UsbDevice usbDevice = sgfplib.GetUsbDevice();
        if (usbDevice != null) {
            sgfplib.GetUsbManager().requestPermission(usbDevice, mPermissionIntent);
            long error = sgfplib.OpenDevice(0);
            fingerPrintReader1 = new FingerPrintReader(imageViewCapFingerprint,
                    sgfplib);

            mMaxTemplateSize = new int[1];
            sgfplib.GetMaxTemplateSize(mMaxTemplateSize);
            mCaptureTemplate = new byte[mMaxTemplateSize[0]];
            SGDeviceInfoParam deviceInfo = new SGDeviceInfoParam();
            mImageWidth = deviceInfo.imageWidth;
            mImageHeight = deviceInfo.imageHeight;
            isDeviceRegistered = true;
        }
    }
    //Mandatory function getName that specifies the module name
    @ReactMethod
    public String getName() {
        return "FingerModule";
    }
    public Uri getImageUri(Context inContext, Bitmap inImage) {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
        String path = MediaStore.Images.Media.insertImage(inContext.getContentResolver(), inImage, "Title", null);
        return Uri.parse(path);
    }
    //Custom function that we are going to export to JS
    @ReactMethod
    public void showToast(final Promise promise) throws JSONException {
        UsbDevice usbDevice = sgfplib.GetUsbDevice();
        if (usbDevice != null) {
            sgfplib.GetUsbManager().requestPermission(usbDevice, mPermissionIntent);
            long error = sgfplib.OpenDevice(0);
            fingerPrintReader1 = new FingerPrintReader(imageViewCapFingerprint,
                    sgfplib);

            mMaxTemplateSize = new int[1];
            sgfplib.GetMaxTemplateSize(mMaxTemplateSize);
            mCaptureTemplate = new byte[mMaxTemplateSize[0]];
            SGDeviceInfoParam deviceInfo = new SGDeviceInfoParam();
            mImageWidth = deviceInfo.imageWidth;
            mImageHeight = deviceInfo.imageHeight;
            isDeviceRegistered = true;
            if (isDeviceRegistered) {

                fingerPrintReader1.readFingerPrint();
                mCaptureTemplate = fingerPrintReader1.getHexTemplate();
                fingerBmp = fingerPrintReader1.toGrayscale(fingerPrintReader1.getFPBitMap());
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                fingerBmp.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream .toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                String encodedtemp = Base64.encodeToString(mCaptureTemplate, Base64.DEFAULT);
                JSONObject jsonObject=new JSONObject();
                jsonObject.put("imageValue",encoded);
                jsonObject.put("imageTemp",encodedtemp);

//            Toast.makeText(context, "DeviceRegistered "+fingerBmp, Toast.LENGTH_SHORT).show();
                Log.d("------?", String.valueOf(mCaptureTemplate));
                Log.d("------?", String.valueOf(mCaptureTemplate));
                Log.d("------?", String.valueOf(encoded));
                Log.d("------?", String.valueOf(encoded));
//            Uri getUri=getImageUri(context,fingerBmp);
                promise.resolve(jsonObject.toString());
//                    imageViewCapFingerprint.setImageBitmap(fingerBmp);
//                    mRegisterImage = CommonMethod.bitmapToByteArray(fingerBmp);
//                        Log.e("mRegistered : ", mRegisterImage + "");
//                        Log.e("mCaptured : ", mCaptureTemplate + "");

            }else{
                Toast.makeText(context, "Device Registered Failed! Kindly connect your device", Toast.LENGTH_SHORT).show();
                promise.reject("E_NO_IMAGE_DATA_FOUND","E_NO_IMAGE_DATA_FOUND");
            }

        }else{
            Toast.makeText(context, "Device Registered Failed! Kindly connect your device", Toast.LENGTH_SHORT).show();
            promise.reject("E_NO_IMAGE_DATA_FOUND","E_NO_IMAGE_DATA_FOUND");
        }


    }
    @ReactMethod
    public void permissionCheckMethod(final Promise promise){
        if (isDeviceRegistered)
        {promise.resolve("1");}
        else{
            Toast.makeText(context, "Device Registered Failed! Kindly connect your device", Toast.LENGTH_SHORT).show();
            promise.reject("E_NO_IMAGE_DATA_FOUND","E_NO_IMAGE_DATA_FOUND");
        }
    }
    @ReactMethod
    public void matchPrintTwo(String base64Temp,String base64Temp2,final Promise promise) {
        if (isDeviceRegistered) {

//            fingerPrintReader1.readFingerPrint();
//            mCaptureTemplate = fingerPrintReader1.getHexTemplate();
//            fingerBmp = fingerPrintReader1.toGrayscale(fingerPrintReader1.getFPBitMap());
            byte[] verifiedFP = Base64.decode(base64Temp, Base64.DEFAULT);
            byte[] verifiedFP2 = Base64.decode(base64Temp2, Base64.DEFAULT);

            boolean[] matched = new boolean[1];
            sgfplib.MatchTemplate(verifiedFP2, verifiedFP, SGFDxSecurityLevel.SL_NORMAL, matched);
            if (matched[0]) {
                Toast.makeText(context, "Successfully Matched!", Toast.LENGTH_SHORT).show();
                promise.resolve("1");
            }else{
//                Toast.makeText(context, "Sorry Not Matched!", Toast.LENGTH_SHORT).show();
                promise.reject("0");
            }

        }else{
            Toast.makeText(context, "Device Registered Failed! Kindly connect your device", Toast.LENGTH_SHORT).show();
            promise.reject("E_NO_IMAGE_DATA_FOUND","E_NO_IMAGE_DATA_FOUND");
        }
    }
    @ReactMethod
    public void matchPrint(String base64Temp,final Promise promise) {
        if (isDeviceRegistered) {

            fingerPrintReader1.readFingerPrint();
            mCaptureTemplate = fingerPrintReader1.getHexTemplate();
            fingerBmp = fingerPrintReader1.toGrayscale(fingerPrintReader1.getFPBitMap());
            byte[] verifiedFP = Base64.decode(base64Temp, Base64.DEFAULT);
            boolean[] matched = new boolean[1];
            sgfplib.MatchTemplate(mCaptureTemplate, verifiedFP, SGFDxSecurityLevel.SL_NORMAL, matched);
            if (matched[0]) {
                Toast.makeText(context, "Successfully Matched!", Toast.LENGTH_SHORT).show();
                promise.resolve("1");
            }else{
                Toast.makeText(context, "Sorry Not Matched!", Toast.LENGTH_SHORT).show();
                promise.reject("0");
            }

        }else{
            Toast.makeText(context, "Device Registered Failed! Kindly connect your device", Toast.LENGTH_SHORT).show();
            promise.reject("E_NO_IMAGE_DATA_FOUND","E_NO_IMAGE_DATA_FOUND");
        }

    }
    public static byte[] bitmapToByteArray(Bitmap bitmap) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
        return stream.toByteArray();
    }
    @ReactMethod
    private void gettingusbPermission() {
        usbPermission();
    }
    @ReactMethod
    private void resetDevice() {
        usbPermission();
        initiateDeviceAndView();
    }
    @ReactMethod
    public void startServies(String userId){
        SharedPreferences.Editor editor = context.getSharedPreferences(String.valueOf(R.string.MY_PREFS_NAME), MODE_PRIVATE).edit();
        editor.putString("userId", userId);
        editor.apply();
        mYourService = new NotificationService();
        mServiceIntent = new Intent(getReactApplicationContext(), mYourService.getClass());
        //working but comment for disable this location functionality
//        if (!isMyServiceRunning(mYourService.getClass())) {
//            getReactApplicationContext().startService(mServiceIntent);
//        }
    }

    @ReactMethod
    public void exportDatabaseSSF(int value,final Promise promise){
        progressDialog = new ProgressDialog(getCurrentActivity());
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER); // Progress Dialog Style Spinner

        switch(value){
            case 1:
                int get=exportSSFDatabase();
                    promise.resolve(get);
                break;
            case 2:
                int get2=importSSFDatabase();
                    promise.resolve(get2);
                break;
            case 3:
                int get3=exportSSFDatabase();
                promise.resolve(get3);
                break;
            case 4:
                int get4=importSSFDatabase();
                promise.resolve(get4);
                break;
        }

    }


//    *******************************************
     //EXPORTING DATABASE SSF //
    public int exportSSFDatabase() {
        progressDialog.setMessage("Please wait..."); // Setting Message
        progressDialog.setTitle("Exporting!"); // Setting Title
        progressDialog.show();
        File file = new File(Environment.getExternalStorageDirectory() + "/Safco_reactapp");
        File data = Environment.getDataDirectory();
        FileChannel source = null;
        FileChannel destination = null;
        String currentDBPath = "/data/" + "com.safcomicrofinance" + "/databases/" + "safcoapp.db";
        if (!file.exists()) {
            file.mkdirs();
        }
        File currentDB = new File(data, currentDBPath);
        File backupDB = new File(file, "database_copy.db");
        Log.e("backupFileLocation ", backupDB.getAbsolutePath() + "");
        try {
            source = new FileInputStream(currentDB).getChannel();
            destination = new FileOutputStream(backupDB).getChannel();
            destination.transferFrom(source, 0, source.size());
            source.close();
            destination.close();
            Log.d("====>export:", "exportDatabase: DB Exported");
            progressDialog.dismiss();
        } catch (IOException e) {
            e.printStackTrace();
            progressDialog.dismiss();
            return 1;
        }
        return 0;
    }
    public int importSSFDatabase() {
        progressDialog.setMessage("Please wait..."); // Setting Message
        progressDialog.setTitle("Importing!"); // Setting Title
        progressDialog.show();
        File file = new File(Environment.getExternalStorageDirectory() + "/Safco_reactapp");
        File data = Environment.getDataDirectory();
        FileChannel source = null;
        FileChannel destination = null;
        String currentDBPath = "/data/" + "com.safcomicrofinance" + "/databases/" + "safcoapp.db";
        File currentDB = new File(data, currentDBPath);
        File backupDB = new File(file,"database_copy.db");

        Log.e("BBPath ", backupDB.getAbsolutePath() + "");

        if (!backupDB.exists()) {
            progressDialog.dismiss();
            return 1;
        }
        try {
            source = new FileInputStream(backupDB).getChannel();
            destination = new FileOutputStream(currentDB).getChannel();
            destination.transferFrom(source, 0, source.size());
            source.close();
            destination.close();
            Log.d("===>", "importSSFDatabase: DB imported");
            progressDialog.dismiss();
        } catch (IOException e) {
            e.printStackTrace();
            progressDialog.dismiss();
            return 2;
        }
        return 0;
    }
    //EXPORTING DATABASE SSF //


    //EXPORTING DATABASE SSF //
    public int exportRepaymentDatabase() {
        progressDialog.setMessage("Please wait..."); // Setting Message
        progressDialog.setTitle("Exporting!"); // Setting Title
        progressDialog.show();
        File file = new File(Environment.getExternalStorageDirectory() + "/Safco_reactapp");
        File data = Environment.getDataDirectory();
        FileChannel source = null;
        FileChannel destination = null;
        String currentDBPath = "/data/" + "com.safcomicrofinance" + "/databases/" + "SafcoMicrofinance_Main_Database.db";
        if (!file.exists()) {
            file.mkdirs();
        }
        File currentDB = new File(data, currentDBPath);
        File backupDB = new File(file, "safcoappRepayment.db");
        Log.e("backupFileLocation ", backupDB.getAbsolutePath() + "");
        try {
            source = new FileInputStream(currentDB).getChannel();
            destination = new FileOutputStream(backupDB).getChannel();
            destination.transferFrom(source, 0, source.size());
            source.close();
            destination.close();
            Log.d("====>export:", "exportDatabase: DB Exported");
            progressDialog.dismiss();
        } catch (IOException e) {
            e.printStackTrace();
            progressDialog.dismiss();
            return 1;
        }
        return 0;
    }
    public int importRepaymentDatabase() {
        progressDialog.setMessage("Please wait..."); // Setting Message
        progressDialog.setTitle("Importing!"); // Setting Title
        progressDialog.show();
        File file = new File(Environment.getExternalStorageDirectory() + "/Safco_reactapp");
        File data = Environment.getDataDirectory();
        FileChannel source = null;
        FileChannel destination = null;
        String currentDBPath = "/data/" + "com.safcomicrofinance" + "/databases/" + "SafcoMicrofinance_Main_Database.db";
        File currentDB = new File(data, currentDBPath);
        File backupDB = new File(file,"safcoappRepayment.db");

        Log.e("BBPath ", backupDB.getAbsolutePath() + "");

        if (!backupDB.exists()) {

            progressDialog.show();
            return 1;
        }
        try {
            source = new FileInputStream(backupDB).getChannel();
            destination = new FileOutputStream(currentDB).getChannel();
            destination.transferFrom(source, 0, source.size());
            source.close();
            destination.close();
            progressDialog.show();
            Log.d("===>", "importRepaymentDatabase: DB imported");
        } catch (IOException e) {
            e.printStackTrace();
            progressDialog.show();
            return 2;
        }
        return 0;
    }
    //EXPORTING DATABASE SSF //



// Write file
    @ReactMethod
    public static void writeToFile(String data,String name,final Promise promise) {
        Log.e("--->", "writeToFile: File about to be created");
        int random=new Random().nextInt(61) + 20;
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), name+".txt");
        try {
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.append(data);
            fileWriter.flush();
            fileWriter.close();
            Log.e("--->", "writeToFile: file created: " + file.getAbsolutePath());
       promise.resolve(true);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(String.valueOf(false),e.getMessage());
            //Log.e(TAG, "writeToFile: Exception");
        }
    }

    //    *******************************************
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

    @Override
    public void onHostResume() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        intentFilter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        context.registerReceiver(mUsbAttachedAndDetReceiver, intentFilter);

    }
    @Override
    public void onHostPause() {
        try {
            getCurrentActivity().unregisterReceiver(mUsbAttachedAndDetReceiver);
            getCurrentActivity().unregisterReceiver(mUsbReceiver);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onHostDestroy() {
        sgfplib.CloseDevice();
        sgfplib.Close();
        try {
            getCurrentActivity().unregisterReceiver(mUsbAttachedAndDetReceiver);
            getCurrentActivity().unregisterReceiver(mUsbReceiver);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
    }
}