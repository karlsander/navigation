package com.navigation.reactnative;

import android.text.InputType;

import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.material.appbar.AppBarLayout;

import java.util.Map;

import javax.annotation.Nonnull;

public class SearchBarManager extends ViewGroupManager<SearchBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVSearchBar";
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(SearchBarView view, String placeholder) {
        view.searchView.setQueryHint(placeholder);
    }

    @ReactProp(name = "text")
    public void setText(SearchBarView view, String text) {
        view.setQuery(text);
    }

    @ReactProp(name = "mostRecentEventCount")
    public void setMostRecentEventCount(SearchBarView view, int mostRecentEventCount) {
        view.mostRecentEventCount = mostRecentEventCount;
    }

    @ReactProp(name = "autoCapitalize")
    public void setAutoCapitalize(SearchBarView view, int autoCapitalize) {
        view.searchView.setInputType(autoCapitalize);
    }

    @ReactProp(name = "barTintColor", customType = "Color", defaultInt = Integer.MAX_VALUE)
    public void setBarTintColor(SearchBarView view, int barTintColor) {
        view.setBarTintColor(barTintColor != Integer.MAX_VALUE ? barTintColor : null);
    }

    @ReactProp(name = "bottomBar")
    public void setBottomBar(SearchBarView view, boolean bottomBar) {
        view.bottomBar = bottomBar;
        CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) view.getLayoutParams();
        if (!bottomBar) {
            params.bottomMargin = 0;
            AppBarLayout.ScrollingViewBehavior behavior = new AppBarLayout.ScrollingViewBehavior();
            params.setBehavior(behavior);
        } else {
            params.bottomMargin = (int) PixelUtil.toPixelFromDIP(56);
            params.setBehavior(null);
        }
    }

    @Nonnull
    @Override
    protected SearchBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new SearchBarView(reactContext);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("onCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .build();
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        return MapBuilder.<String, Object>of(
            "AutoCapitalize",
            MapBuilder.of(
                "none", InputType.TYPE_CLASS_TEXT,
                "words", InputType.TYPE_TEXT_FLAG_CAP_WORDS,
                "sentences", InputType.TYPE_TEXT_FLAG_CAP_SENTENCES,
                "allCharacters", InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS));
    }
}