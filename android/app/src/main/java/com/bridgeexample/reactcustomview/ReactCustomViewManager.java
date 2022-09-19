package com.bridgeexample.reactcustomview;

import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

public class ReactCustomViewManager extends SimpleViewManager<View> {

    public static final String REACT_CLASS = "ReactCustomView";
    ThemedReactContext mCallerContext;
    View view;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected View createViewInstance(ThemedReactContext context) {
        mCallerContext = context;
        view = new View(context);
        view.setBackgroundColor(Color.BLUE);

        setColor(view, null);

//        ArrayList children = new ArrayList<View>();
//        View child = new View(context);
//        child.setBackgroundColor(Color.YELLOW);
//        child.setLayoutParams(new ViewGroup.LayoutParams(20, 20));
//        children.add(child);
//
//         view.addChildrenForAccessibility(children);
        return view;
    }

    @ReactProp(name = "color")
    public void setColor(View view, @Nullable String color) {
        view.setLayoutParams(new ViewGroup.LayoutParams(100, 100));
        view.setBackgroundColor(Color.RED);
        view.setY(0);
        view.setX(0);
        view.offsetLeftAndRight(0);
        view.offsetTopAndBottom(0);

        if(color != null) {
            view.setBackgroundColor(Color.parseColor(color));
        }
    }
}