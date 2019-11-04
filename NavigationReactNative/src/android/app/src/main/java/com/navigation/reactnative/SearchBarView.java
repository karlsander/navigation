package com.navigation.reactnative;

import android.content.Context;
import android.graphics.Color;
import android.view.ViewGroup;

import androidx.appcompat.widget.SearchView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

public class SearchBarView extends ReactViewGroup {
    SearchView searchView;

    public SearchBarView(Context context) {
        super(context);
        searchView = new SearchView(context);
        searchView.setBackgroundColor(Color.WHITE);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                WritableMap event = Arguments.createMap();
                event.putString("text", newText);
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onChangeText", event);
                return false;
            }
        });
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        ViewGroup view = (ViewGroup) getParent();
        NavigationBarView navigationBarView = null;
        for(int j = 0; j < view.getChildCount(); j++) {
            if (view.getChildAt(j) instanceof  NavigationBarView)
                navigationBarView = (NavigationBarView) view.getChildAt(j);
        }
        if (navigationBarView != null)
            navigationBarView.searchMenuItem.setActionView(searchView);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
    }
}
