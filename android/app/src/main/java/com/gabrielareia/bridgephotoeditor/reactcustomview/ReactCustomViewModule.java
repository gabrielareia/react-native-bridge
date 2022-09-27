package com.gabrielareia.bridgephotoeditor.reactcustomview;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.exifinterface.media.ExifInterface;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.util.List;

public class ReactCustomViewModule extends ReactContextBaseJavaModule {
    private static final int IMAGE_PICKER_REQUEST = 1;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
    private static final String E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER";
    private static final String E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND";

    private Callback mSuccessCallback;
    private Callback mFailCallback;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == IMAGE_PICKER_REQUEST) {
                if (mSuccessCallback != null && mFailCallback != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mFailCallback.invoke("Image picker was cancelled");
                    } else if (resultCode == Activity.RESULT_OK) {
                        Uri uri = intent.getData();

                        if (uri == null) {
                            mFailCallback.invoke("No image data found");
                        } else {
                            mSuccessCallback.invoke(uri.toString());
                        }
                    }

                    mSuccessCallback = null;
                    mFailCallback = null;
                }
            }
        }
    };

    ReactCustomViewModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "ReactCustomView";
    }

    @ReactMethod
    public void pickImage(final Callback successCallback,final Callback failCallback) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            failCallback.invoke("Activity doesn't exist");
            return;
        }

        // Store the promise to resolve/reject when picker returns data
        mSuccessCallback = successCallback;
        mFailCallback = failCallback;

        try {
            final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

            String [] mimeTypes = {"image/png", "image/jpg","image/jpeg"};
            galleryIntent.setType("image/*");
            galleryIntent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);

            final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");

            currentActivity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST);
        } catch (Exception e) {
            mFailCallback.invoke(e);
            mSuccessCallback = null;
            mFailCallback = null;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void loadImage(String uri, Callback successCallback, Callback failCallback) {
        try {
            Uri selectedImage = Uri.parse(uri);
            InputStream imageStream = this.getReactApplicationContext().getContentResolver().openInputStream(selectedImage);
            Bitmap importedBitmap = BitmapFactory.decodeStream(imageStream);

            ExifInterface exif = new ExifInterface(imageStream);
            int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, 1);

            int rotation = 0;

            if(orientation == 3) {
                rotation = 180;
            } else if(orientation == 6) {
                rotation = 90;
            } else if(orientation == 8) {
                rotation = -90;
            }

            Matrix matrix = new Matrix();
            matrix.postRotate(rotation);
            Bitmap imageBitmap = Bitmap.createBitmap(importedBitmap, 0, 0, importedBitmap.getWidth(), importedBitmap.getHeight(), matrix, true);

            int width = imageBitmap.getWidth();
            int height = imageBitmap.getHeight();

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            imageBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();

            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

            String header = "data:image/png;base64,";

            successCallback.invoke(header + encoded, width, height);
        } catch(Exception e) {
            failCallback.invoke(e.toString() + " | " + e.getMessage() + " | " + e.getLocalizedMessage() + " | " + e.getCause());
        }
    }

    @ReactMethod
    public void loadFilter(String imageBase64, String filter, Callback successCallback, Callback failCallback) {
        try {
            List<Filter> filterRegions = Filter.getFiltersFromJson(filter);

            byte[] imageBytes = Base64.decode(imageBase64, Base64.DEFAULT);
            Bitmap imageBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);

            int width = imageBitmap.getWidth();
            int height = imageBitmap.getHeight();

            int[] pixels = new int[width * height];
            imageBitmap.getPixels(pixels,0, width, 0, 0, width, height);

            applyFilter(pixels, filterRegions, width, height);

            Bitmap newBitmap = Bitmap.createBitmap(pixels, width, height, Bitmap.Config.ARGB_8888);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            newBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();

            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

            String header = "data:image/png;base64,";

            successCallback.invoke(header + encoded, width, height);
        } catch(Exception e) {
            failCallback.invoke(e.toString() + " | " + e.getMessage() + " | " + e.getLocalizedMessage() + " | " + e.getCause());
        }
    }

    private void applyFilter(int[] pixels, List<Filter> filterRegions, int width, int height) {
        int filterSides = (int)Math.sqrt(filterRegions.size());

        for (int i = 0; i < pixels.length; i++) {
            int pixel = pixels[i];
            int a = (pixel >> 24) & 0xff;
            int r = (pixel >> 16) & 0xff;
            int g = (pixel >> 8) & 0xff;
            int b = (pixel >> 0) & 0xff;

            Filter filter = getFilter(filterRegions, width, height, filterSides, i);

            if(filter.multiply != 0) {
                r *= filter.multiply;
                g *= filter.multiply;
                b *= filter.multiply;
            }

            if(filter.sum != 0) {
                r += filter.sum;
                g += filter.sum;
                b += filter.sum;
            }

            if(filter.color != null) {
                int color = Color.parseColor(filter.color);
                switch(filter.colorMode) {
                    case Multiply:
                        r = multiplyColors(r, (color >> 16) & 0xff);
                        g = multiplyColors(g, (color >> 8) & 0xff);
                        b = multiplyColors(b, (color >> 0) & 0xff);
                        break;
                    case  Add:
                        r += color;
                        g += color;
                        b += color;
                        break;
                    case  Screen:
                        r += color + 1;
                        g += color + 1;
                        b += color + 1;
                        break;
                    case  SoftLight:
                        r += color * 0.5;
                        g += color * 0.5;
                        b += color * 0.5;
                        break;
                }
            }

            r = clampColor(r);
            g = clampColor(g);
            b = clampColor(b);

            int newPixel = (a << 24) | (r << 16) | (g << 8) | (b << 0);

            pixels[i] = newPixel;
        }
    }

    private int multiplyColors(int colorA, int colorB) {
        return (int)(normalizeColor(colorA) * normalizeColor(colorB) * 0xff);
    }

    private double normalizeColor(int color) {
        return color / (double)0xff;
    }

    private Filter getFilter(List<Filter> filterRegions, int width, int height, int filterSides, int i) {
        int x = i % width;
        int y = i / width;

        int xFilter = (int)((x / (double)width) * filterSides);
        int yFilter = (int)((y / (double)height) * filterSides);

        int filterIndex = xFilter + yFilter * filterSides;

        return filterRegions.get(filterIndex);
    }

    private int clampColor(int color) {
        return Math.max(0x00, Math.min(0xff, color));
    }
}
